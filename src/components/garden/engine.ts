import { GARDEN, type Species } from '@/lib/garden/config'
import { easeOutQuart, smoothstep } from '@/lib/garden/ease'
import { shouldAnimateGarden } from '@/lib/garden/gates'
import {
  breakpointOf,
  decidePlanting,
  initialComposition,
  layoutFor,
  fitX,
  pickSpecies,
  plantEnv,
  plantHeight,
  type Layout,
  type Occupant,
} from '@/lib/garden/layout'
import { cellFor, packShelves, type Cell } from '@/lib/garden/atlas'
import { clamp, lerp, rad, TAU } from '@/lib/garden/path'
import { drawGroup, drawLine, drawParts, drawSeed, groupFades, groupTransform } from '@/lib/garden/pen'
import { rng32, rr } from '@/lib/garden/rng'
import { buildModel, modelBounds, type GroupPart, type Model, type Part } from '@/lib/garden/species'
import { seedAlpha, startAge } from '@/lib/garden/timeline'
import { washOf } from '@/lib/garden/wash'

/**
 * The garden's canvas engine, loaded lazily by Garden.tsx once the hero is
 * hydrated, in view and the browser is idle. Everything that touches the
 * DOM lives here; the models, layout, gates and pens are pure modules in
 * src/lib/garden.
 *
 * Frames: plants that are still growing draw live (stems as lines, finished
 * leaves and flowers from a per-plant layer, opening ones scaled out of a
 * per-plant atlas: a few hundred image draws a frame instead of thousands
 * of paths, which is what a laptop's GPU chokes on); a finished plant is a
 * cached sprite, rotated for the lean and the sway. Off the frame: models
 * are built and sprites drawn in idle slices of GARDEN.sliceMs, so no task
 * gets long. The loop stops whenever nothing moves (settled, paused, reduced
 * motion), the box leaves the viewport, or the tab is hidden.
 */

type Origin = Occupant['origin']

interface Sprite {
  c: HTMLCanvasElement
  x: number
  y: number
  w: number
  h: number
}

interface Bake extends Sprite {
  cx: CanvasRenderingContext2D
  bend: number
  baked: Uint8Array
}

/** A sprite's place in an atlas: its cell there (device px) and where it sits on the plant. */
interface Slot extends Cell {
  sx: number
  sy: number
}

/** A growing plant's leaves and flowers, each drawn once: without its washes (dry) and, if it has any, with them (wet). */
interface Atlas {
  c: HTMLCanvasElement
  cx: CanvasRenderingContext2D
  /** Per top group. */
  cells: { dry: Slot; wet: Slot | null }[]
  /** Which cells are drawn. */
  ready: Uint8Array
}

interface Plant {
  id: number
  species: Species
  seed: number
  x: number
  hFrac: number
  origin: Origin
  age: number
  steer: number
  lastSteer?: number
  lean: number
  rustle: number
  wither: number
  dormant: boolean
  done: boolean
  phase: number
  period: number
  model: Model | null
  sprite: Sprite | null
  rootSprite: Sprite | null
  bake: Bake | null
  lineBake: Bake | null
  rootBake: Bake | null
  atlas: Atlas | null
  /** A sprite is being drawn in idle time. */
  rastering: boolean
  /** Bumped by every rebuild, so a stale idle job drops its work. */
  gen: number
}

interface Seed {
  x: number
  y0: number
  t: number
  species: Species
  seed: number
  hFrac: number
  origin: Origin
  drift: number
  spin: number
}

export interface GardenHandle {
  setPaused(paused: boolean): void
  destroy(): void
}

type Job = Generator<void, void, void>

/** Finished parts drawn into the per-plant layers in one frame, at most. */
const BAKES_PER_FRAME = 6
/** Atlas cells a frame may draw itself when idle time hasn't reached them. */
const CELLS_PER_FRAME = 4
/** The longest step a frame takes; below 10fps the garden slows rather than jumps. */
const MAX_STEP_MS = 100

export function mountGarden(box: HTMLElement, canvas: HTMLCanvasElement, opts: { paused: boolean }): GardenHandle {
  const ctx = canvas.getContext('2d')
  if (!ctx) return { setPaused() {}, destroy() {} }
  const G = GARDEN.growth
  const P = GARDEN.pointer
  const I = GARDEN.idle
  const coarse = matchMedia('(pointer: coarse)').matches
  const fps = coarse ? GARDEN.fps.coarse : GARDEN.fps.fine
  const rng = rng32(GARDEN.seed ^ 0x9e3779b9)
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)')

  let layout: Layout = measure()
  let dpr = 1
  let plants: Plant[] = []
  let seeds: Seed[] = []
  let clock = 0
  let lastTick = 0
  let lastDraw = 0
  let raf = 0
  let paused = opts.paused
  let inView = true
  let hidden = document.hidden
  let pointer = { x: 0, y: 0, active: false, until: 0 }
  let lastInteract = 0
  let swayAmp = 1
  let nextGust = I.afterMs + I.gustEveryMs * 0.5
  let gust: { start: number } | null = null
  let nextSelfSeed = I.afterMs + I.selfSeedEveryMs
  let selfSeeded = 0
  let nextId = 1
  let destroyed = false
  let bakeBudget = 0
  let cellBudget = 0

  const reduced = () => mqReduce.matches
  const still = () => reduced() || paused
  const animating = () => shouldAnimateGarden({ paused, reducedMotion: reduced(), saveData: false, hidden, inView })

  /* ---- idle work: model building and sprite drawing, in short slices ---- */

  const jobs: Job[] = []
  let idleHandle = 0
  const ric: (cb: (d: IdleDeadline) => void) => number =
    typeof requestIdleCallback === 'function'
      ? (cb) => requestIdleCallback(cb, { timeout: 500 })
      : (cb) => window.setTimeout(() => cb({ didTimeout: true, timeRemaining: () => GARDEN.sliceMs } as IdleDeadline), 16)
  const cic = (h: number) => (typeof cancelIdleCallback === 'function' ? cancelIdleCallback(h) : clearTimeout(h))

  function enqueue(job: Job) {
    jobs.push(job)
    if (!idleHandle) idleHandle = ric(runJobs)
  }
  function runJobs() {
    idleHandle = 0
    const end = performance.now() + GARDEN.sliceMs
    while (jobs.length && performance.now() < end) {
      if (jobs[0].next().done) jobs.shift()
    }
    if (jobs.length && !destroyed) idleHandle = ric(runJobs)
  }

  /* ---- layout ---- */

  function measure(): Layout {
    const r = box.getBoundingClientRect()
    return layoutFor(r.width, r.height, breakpointOf(window.innerWidth))
  }

  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, coarse ? GARDEN.dprCap.coarse : GARDEN.dprCap.fine)
    canvas.width = Math.max(1, Math.round(layout.W * dpr))
    canvas.height = Math.max(1, Math.round(layout.Hb * dpr))
  }

  /**
   * Build (or rebuild) a plant's model in idle time, and for a growing plant
   * its offscreen layers too, so its first frames only draw. It shows once
   * all of that is ready; a finished plant then gets its sprite.
   */
  function prepare(p: Plant) {
    const gen = ++p.gen
    p.model = null
    p.rastering = false
    p.sprite = p.rootSprite = p.bake = p.lineBake = p.rootBake = p.atlas = null
    const stale = () => destroyed || p.gen !== gen || !plants.includes(p)
    enqueue(
      (function* () {
        yield
        if (stale()) return
        // Build at x, then (as a separate step) again where it fits, if it has to move.
        const H = plantHeight(p.hFrac, layout)
        let m = buildModel(p.species, p.seed, H, plantEnv(p.x, layout))
        yield
        if (stale()) return
        let x = fitX(p.x, modelBounds(m.top, 0, m.H), layout.W)
        if (Math.abs(x - p.x) > 0.5) {
          m = buildModel(p.species, p.seed, H, plantEnv(x, layout))
          yield
          if (stale()) return
        } else x = p.x
        const built = { x, model: m }
        if (p.done || p.age >= m.tEnd) {
          p.x = built.x
          p.model = m
          p.age = m.tEnd
          p.done = true
          raster(p)
          return
        }
        yield
        if (stale()) return
        const rootBake = newLayer(m.roots, 0, m.H)
        yield
        if (stale()) return
        const bake = newLayer(m.topGroups, p.steer, m.H)
        yield
        if (stale()) return
        const at = newAtlas(m)
        p.x = built.x
        p.model = m
        p.rootBake = rootBake
        p.bake = bake
        p.atlas = at
        wake()
        fillAtlas(p, at, m)
      })(),
    )
  }

  function newPlant(o: { species: Species; seed: number; x: number; hFrac: number; origin: Origin; grown: boolean; delay?: number }, build = true): Plant {
    const p: Plant = {
      id: nextId++,
      species: o.species,
      seed: o.seed,
      x: o.x,
      hFrac: o.hFrac,
      origin: o.origin,
      age: o.grown ? Infinity : startAge(o.origin, o.delay),
      steer: 0,
      lean: 0,
      rustle: 0,
      wither: 0,
      dormant: false,
      done: o.grown,
      phase: rng() * TAU,
      period: rr(rng, ...I.swayPeriodMs),
      model: null,
      sprite: null,
      rootSprite: null,
      bake: null,
      lineBake: null,
      rootBake: null,
      atlas: null,
      rastering: false,
      gen: 0,
    }
    plants.push(p)
    if (build) prepare(p)
    return p
  }

  function plantInitial(grown: boolean) {
    const opening = initialComposition(layout.bp, layout.W)
    const made = opening.map((s) => newPlant({ ...s, origin: 'initial', grown }, false))
    // Built in the order they come up, so the first stem never waits on the others' models.
    const order = made.map((_, i) => i).sort((a, b) => opening[a].delay - opening[b].delay)
    for (const i of order) prepare(made[i])
  }

  let resizeTimer = 0
  function onResize() {
    clearTimeout(resizeTimer)
    // The canvas stretches with its box until the drag settles.
    resizeTimer = window.setTimeout(() => {
      const prev = layout
      const next = measure()
      if (Math.abs(next.W - prev.W) < 0.5 && Math.abs(next.Hb - prev.Hb) < 0.5) return
      layout = next
      sizeCanvas()
      if (prev.bp !== next.bp) {
        // Another breakpoint: its own composition, grown; visitors' plants stay if they fit.
        plants = plants.filter((p) => p.origin !== 'initial' && p.x < next.W - GARDEN.insetPx)
        for (const p of plants) prepare(p)
        plantInitial(true)
      } else {
        const sx = next.W / prev.W
        for (const p of plants) {
          p.x *= sx
          prepare(p)
        }
      }
      seeds = []
      draw()
      wake()
    }, 150)
  }

  /* ---- sprites ---- */

  function canvas2d(w: number, h: number) {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const cx = c.getContext('2d')!
    cx.lineCap = 'round'
    cx.lineJoin = 'round'
    return { c, cx }
  }

  function newLayer(parts: Part[], bend: number, H: number): Bake {
    const { x, y, sw, sh } = cellFor(modelBounds(parts, bend, H), dpr)
    const { c, cx } = canvas2d(sw, sh)
    cx.setTransform(dpr, 0, 0, dpr, -x * dpr, -y * dpr)
    return { c, cx, x, y, w: sw / dpr, h: sh / dpr, bend, baked: new Uint8Array(parts.length) }
  }

  /** A growing plant's atlas, laid out but not drawn. */
  function newAtlas(m: Model): Atlas {
    const slots: Slot[] = []
    const cells = m.topGroups.map((g) => {
      const c = cellFor(modelBounds([g], 0, m.H), dpr)
      const dry = { ...c, sx: 0, sy: 0 }
      const wet = g.paths.some((q) => washOf(q)) ? { ...c, sx: 0, sy: 0 } : null
      slots.push(dry)
      if (wet) slots.push(wet)
      return { dry, wet }
    })
    const pk = packShelves(slots)
    slots.forEach((s, k) => ([s.sx, s.sy] = pk.at[k]))
    return { ...canvas2d(pk.w, pk.h), cells, ready: new Uint8Array(cells.length) }
  }

  function fillCell(at: Atlas, g: GroupPart, i: number, H: number) {
    const { dry, wet } = at.cells[i]
    for (const s of [dry, wet]) {
      if (!s) continue
      at.cx.setTransform(dpr, 0, 0, dpr, s.sx - s.x * dpr, s.sy - s.y * dpr)
      drawGroup(at.cx, g, 1, 0, H, 1, s === wet)
    }
    at.ready[i] = 1
  }

  /**
   * Draw a growing plant's leaves and flowers into its atlas in idle time,
   * the earliest to open first. A frame that reaches a part first draws its
   * cell itself (a few a frame), or else draws the part live.
   */
  function fillAtlas(p: Plant, at: Atlas, m: Model) {
    enqueue(
      (function* () {
        const G = m.topGroups
        for (const i of G.map((_, i) => i).sort((a, b) => G[a].t0 - G[b].t0)) {
          yield
          if (p.atlas !== at || destroyed || !plants.includes(p)) return
          if (!at.ready[i]) fillCell(at, G[i], i, m.H)
        }
      })(),
    )
  }

  function drawPart(cx: CanvasRenderingContext2D, part: Part, bend: number, H: number) {
    if (part.k === 'line') drawLine(cx, part, 1, bend, H, 1)
    else drawGroup(cx, part, 1, bend, H, 1)
  }

  /** Draw a finished plant's sprites a few parts at a time in idle slices; it shows once both are ready. */
  function raster(p: Plant) {
    if (p.rastering || !p.model) return
    p.rastering = true
    const m = p.model
    enqueue(
      (function* () {
        const top = newLayer(m.top, p.steer, m.H)
        for (const part of m.top) {
          if (p.model !== m) return
          drawPart(top.cx, part, p.steer, m.H)
          yield
        }
        const roots = newLayer(m.roots, 0, m.H)
        for (const part of m.roots) {
          if (p.model !== m) return
          drawPart(roots.cx, part, 0, m.H)
          yield
        }
        p.rastering = false
        if (p.model !== m) return
        p.sprite = top
        p.rootSprite = roots
        p.bake = p.lineBake = p.rootBake = p.atlas = null
        if (animating() && raf) return
        draw()
      })(),
    )
  }

  /**
   * A plant that has just finished growing gets its sprite in idle time,
   * made from its layers (every part is in them by now) rather than redrawn;
   * until then it keeps drawing from the layers.
   */
  function finish(p: Plant) {
    const m = p.model!
    enqueue(
      (function* () {
        yield
        if (p.model !== m || destroyed) return
        const bk = p.bake
        const rb = p.rootBake
        if (!bk || !rb || bk.bend !== p.steer || !bk.baked.every(Boolean) || !rb.baked.every(Boolean)) {
          raster(p)
          return
        }
        const sprite = newLayer(m.top, p.steer, m.H)
        yield
        if (p.model !== m) return
        drawParts(sprite.cx, m.topLines, Infinity, p.steer, m.H, 1)
        sprite.cx.setTransform(dpr, 0, 0, dpr, -sprite.x * dpr, -sprite.y * dpr)
        sprite.cx.globalAlpha = 1
        sprite.cx.drawImage(bk.c, bk.x, bk.y, bk.w, bk.h)
        p.sprite = sprite
        p.rootSprite = rb
        p.bake = p.lineBake = p.rootBake = p.atlas = null
      })(),
    )
  }

  /**
   * Draw the finished parts into a layer once each, draw the layer, then the
   * parts still growing. A frame bakes at most BAKES_PER_FRAME parts; when
   * many finish together the rest draw live and bake on a later frame, so no
   * frame gets long.
   */
  function drawLayered(layer: Bake, parts: Part[], age: number, bend: number, H: number, A: number, at: Atlas | null = null) {
    const live: number[] = []
    for (let i = 0; i < parts.length; i++) {
      if (layer.baked[i]) continue
      if (age >= parts[i].tDone && bakeBudget > 0) {
        drawPart(layer.cx, parts[i], bend, H)
        layer.baked[i] = 1
        bakeBudget--
      } else live.push(i)
    }
    ctx!.globalAlpha = A
    ctx!.drawImage(layer.c, layer.x, layer.y, layer.w, layer.h)
    for (const i of live) partAt(parts[i], i, age, bend, H, A, at)
  }

  /** One part at `age`. A group whose sprites are in the atlas is scaled out of it, its wash crossfading in over the dry sprite. */
  function partAt(q: Part, i: number, age: number, bend: number, H: number, A: number, at: Atlas | null) {
    if (age <= q.t0) return
    const e = age >= q.tDone ? 1 : easeOutQuart((age - q.t0) / (q.t1 - q.t0))
    if (q.k === 'line') return drawLine(ctx!, q, e, bend, H, A)
    if (!at || (!at.ready[i] && cellBudget-- <= 0)) return drawGroup(ctx!, q, e, bend, H, A)
    if (!at.ready[i]) fillCell(at, q, i, H)
    const s = at.cells[i]
    const { fade, washFade } = groupFades(e)
    ctx!.save()
    groupTransform(ctx!, q, e, bend, H)
    if (!s.wet || washFade < 1) blit(at.c, s.dry, A * fade)
    if (s.wet && washFade > 0) blit(at.c, s.wet, A * fade * washFade)
    ctx!.restore()
  }

  function blit(c: HTMLCanvasElement, s: Slot, a: number) {
    ctx!.globalAlpha = a
    ctx!.drawImage(c, s.sx, s.sy, s.sw, s.sh, s.x, s.y, s.sw / dpr, s.sh / dpr)
  }

  /**
   * A growing plant: its stems, then its leaves and flowers, each from a
   * layer of the finished ones plus the ones still growing. While the
   * pointer bends it, nothing is baked and the stems draw live.
   */
  function drawGrowing(p: Plant, A: number) {
    const m = p.model!
    const steady = p.lastSteer === undefined || Math.abs(p.steer - p.lastSteer) < 1e-4
    p.lastSteer = p.steer
    if (!steady) {
      p.bake = p.lineBake = null
      drawParts(ctx!, m.topLines, p.age, p.steer, m.H, A)
      m.topGroups.forEach((g, i) => partAt(g, i, p.age, p.steer, m.H, A, p.atlas))
      return
    }
    if (!p.lineBake || p.lineBake.bend !== p.steer) p.lineBake = newLayer(m.topLines, p.steer, m.H)
    drawLayered(p.lineBake, m.topLines, p.age, p.steer, m.H, A)
    if (!p.bake || p.bake.bend !== p.steer) p.bake = newLayer(m.topGroups, p.steer, m.H)
    drawLayered(p.bake, m.topGroups, p.age, p.steer, m.H, A, p.atlas)
  }

  /* ---- motion ---- */

  function influence(p: Plant): number {
    if (!pointer.active || !p.model || pointer.y > layout.groundY) return 0
    const d = Math.hypot(pointer.x - p.x, pointer.y - (layout.groundY - p.model.H * 0.6))
    return d < P.influenceRadiusPx ? smoothstep(Math.min(1, (1 - d / P.influenceRadiusPx) * P.falloff)) : 0
  }

  const angleToPointer = (p: Plant) => Math.atan2(pointer.x - p.x, layout.groundY - pointer.y)

  /** Lean, sway, gust, rustle and wither, as one rotation about the base: the canvas's transform. */
  function rotation(p: Plant): number {
    let sway = rad(I.swayDeg) * swayAmp * Math.sin((TAU * clock) / p.period + p.phase)
    if (gust) {
      const half = I.gustMs * 0.5
      const tg = clock - gust.start - (p.x / layout.W) * half
      if (tg > 0 && tg < half) sway += rad(I.gustDeg) * swayAmp * Math.pow(Math.sin((Math.PI * tg) / half), 2)
    }
    sway += rad(I.rustleDeg) * p.rustle * Math.sin((TAU * clock) / 900)
    const droop = p.wither ? rad(4) * easeOutQuart(Math.min(1, p.wither)) * (p.x < layout.W / 2 ? -1 : 1) : 0
    return p.lean + sway + droop
  }

  function update(dt: number) {
    clock += dt
    const since = clock - lastInteract
    const idle = since > I.afterMs
    const settled = since > I.settleAfterMs
    swayAmp += ((settled ? 0 : 1) - swayAmp) * (1 - Math.exp(-dt / (I.settleMs / 3)))
    if (settled && swayAmp < 0.002) swayAmp = 0
    if (pointer.until && clock > pointer.until) pointer = { ...pointer, active: false, until: 0 }
    if (idle && !settled && clock > nextGust) {
      gust = { start: clock }
      nextGust = clock + I.gustEveryMs * rr(rng, 0.8, 1.2)
    }
    if (gust && clock - gust.start > I.gustMs) gust = null
    if (idle && !settled && clock > nextSelfSeed) {
      selfSeed()
      nextSelfSeed = clock + I.selfSeedEveryMs
    }

    let growing = plants.filter((p) => p.origin !== 'initial' && !p.done && !p.dormant && p.age >= 0).length
    for (const p of plants) {
      if (!p.model) continue
      if (p.dormant) {
        if (growing >= G.maxConcurrent) continue
        p.dormant = false
        growing++
      }
      const f = influence(p)
      if (!p.done) {
        p.age += dt * (1 + (P.growthBoost - 1) * f)
        if (p.age > 0 && f > 0) {
          const target = clamp(angleToPointer(p), -rad(P.maxSteerDeg), rad(P.maxSteerDeg)) * P.steer
          p.steer += (target - p.steer) * (1 - Math.exp((-dt * f) / P.steerEaseMs))
        }
        if (p.age >= p.model.tEnd) {
          p.age = p.model.tEnd
          p.done = true
          finish(p)
        }
      }
      const leanTarget = f > 0 ? clamp(angleToPointer(p), -rad(P.maxLeanDeg), rad(P.maxLeanDeg)) * f : 0
      p.lean += (leanTarget - p.lean) * (1 - Math.exp(-dt / (P.leanEaseMs / 3)))
      p.rustle *= Math.exp(-dt / 700)
      if (p.rustle < 0.005) p.rustle = 0
      if (p.wither) p.wither += dt / G.witherMs
    }
    plants = plants.filter((p) => p.wither < 1)

    for (const s of seeds) s.t += dt
    for (const s of seeds) if (s.t >= G.seedDropMs) land(s)
    seeds = seeds.filter((s) => s.t < G.seedDropMs)
  }

  function needsLoop(): boolean {
    if (seeds.length || gust || swayAmp > 0 || jobs.length) return true
    return plants.some((p) => !p.done || p.dormant || p.wither || p.rustle || Math.abs(p.lean) > 1e-4)
  }

  /* ---- draw ---- */

  function draw() {
    bakeBudget = BAKES_PER_FRAME
    cellBudget = CELLS_PER_FRAME
    const L = layout
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx!.clearRect(0, 0, L.W, L.Hb)
    ctx!.lineCap = 'round'
    ctx!.lineJoin = 'round'
    const fixed = still()
    const alpha = (p: Plant) => (p.wither ? 1 - easeOutQuart(Math.min(1, p.wither)) : 1)
    for (const p of plants) {
      if (!p.model) continue
      const A = alpha(p)
      ctx!.save()
      ctx!.translate(p.x, L.groundY)
      if (p.done && p.rootSprite) {
        ctx!.globalAlpha = A
        ctx!.drawImage(p.rootSprite.c, p.rootSprite.x, p.rootSprite.y, p.rootSprite.w, p.rootSprite.h)
      } else if (!p.done || p.rootBake) {
        if (!p.rootBake) p.rootBake = newLayer(p.model.roots, 0, p.model.H)
        drawLayered(p.rootBake, p.model.roots, p.age, 0, p.model.H, A)
      }
      ctx!.restore()
    }
    for (const p of plants) {
      const A = alpha(p)
      // A sown seed lies on the ground (while its model builds, too) until the stem is up.
      const sa = p.done ? 0 : seedAlpha(p.origin, p.age)
      if (sa > 0) drawSeed(ctx!, p.species, p.x + 2.5, L.groundY - 1.2, 0.2, A * sa)
      if (!p.model) continue
      ctx!.save()
      ctx!.translate(p.x, L.groundY)
      if (!fixed) ctx!.rotate(rotation(p))
      if (p.done && p.sprite) {
        ctx!.globalAlpha = A
        ctx!.drawImage(p.sprite.c, p.sprite.x, p.sprite.y, p.sprite.w, p.sprite.h)
      } else if (!p.done || p.bake) drawGrowing(p, A)
      ctx!.restore()
    }
    for (const s of seeds) {
      const t = easeOutQuart(Math.min(1, s.t / G.seedDropMs))
      drawSeed(ctx!, s.species, s.x + s.drift * Math.sin(Math.PI * t), lerp(s.y0, L.groundY - 1.2, t), s.spin * t, 1)
    }
    ctx!.globalAlpha = 1
  }

  /* ---- the loop ---- */

  function frame(now: number) {
    raf = 0
    if (!animating()) return setLoop(false)
    if (now - lastDraw < 1000 / fps - 2) {
      raf = requestAnimationFrame(frame)
      return
    }
    const dt = Math.min(MAX_STEP_MS, now - lastTick)
    lastTick = lastDraw = now
    update(dt)
    draw()
    if (needsLoop()) raf = requestAnimationFrame(frame)
    else setLoop(false)
  }

  function wake() {
    if (destroyed) return
    if (!animating()) {
      draw()
      return
    }
    if (raf || !needsLoop()) return
    lastTick = lastDraw = performance.now()
    raf = requestAnimationFrame(frame)
    setLoop(true)
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    setLoop(false)
  }

  /** The loop's state on the box, for tests and for anyone debugging: on or off. */
  function setLoop(on: boolean) {
    const v = on ? 'on' : 'off'
    if (box.dataset.loop !== v) box.dataset.loop = v
  }

  /* ---- planting ---- */

  const living = () => plants.filter((p) => !p.wither)

  function speciesFor(x: number): Species {
    const near = living()
      .slice()
      .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))
      .slice(0, 2)
      .map((p) => p.species)
    return pickSpecies(rng, near)
  }

  function sow(x: number, y: number, origin: Origin) {
    const species = speciesFor(x)
    const seed = Math.floor(rng() * 2 ** 31)
    const hFrac = rr(rng, ...GARDEN.heights[species])
    if (still()) {
      // Nothing moves: the plant appears grown.
      newPlant({ species, seed, x, hFrac, origin, grown: true })
      return
    }
    seeds.push({ x, y0: Math.min(y, layout.groundY - 4), t: 0, species, seed, hFrac, origin, drift: rr(rng, -10, 10), spin: rr(rng, -2, 2) })
    wake()
  }

  function plantAt(x: number, y: number) {
    const live = living()
    const d = decidePlanting(x, live, seeds.map((s) => s.x), layout)
    const byId = (id: number) => live.find((p) => p.id === id)!
    if (d.kind === 'none') return
    if (d.kind === 'rustle') {
      if (!still()) byId(d.id).rustle = 1
      wake()
      return
    }
    if (d.kind === 'replace') {
      const old = byId(d.id)
      if (still()) plants = plants.filter((p) => p !== old)
      else old.wither = 1e-4
      sow(d.x, y, 'visitor')
      return
    }
    if (d.evict !== null) {
      const old = byId(d.evict)
      if (still()) plants = plants.filter((p) => p !== old)
      else old.wither = 1e-4
    }
    sow(d.x, y, 'visitor')
  }

  function land(s: Seed) {
    const p = newPlant({ species: s.species, seed: s.seed, x: s.x, hFrac: s.hFrac, origin: s.origin, grown: false })
    const growing = plants.filter((q) => q !== p && q.origin !== 'initial' && !q.done && !q.dormant && q.age >= 0).length
    p.dormant = growing >= G.maxConcurrent
  }

  function selfSeed() {
    if (selfSeeded >= I.selfSeedMax) return
    const donors = living().filter((p) => p.done && p.model && p.model.blooms.length)
    if (!donors.length) return
    const d = donors[Math.floor(rng() * donors.length)]
    const b = d.model!.blooms[Math.floor(rng() * d.model!.blooms.length)]
    for (let tries = 0; tries < 8; tries++) {
      const x = d.x + rr(rng, 50, 110) * (rng() < 0.5 ? -1 : 1)
      if (x < GARDEN.insetPx || x > layout.W - GARDEN.insetPx) continue
      const plan = decidePlanting(x, living(), seeds.map((s) => s.x), layout)
      if (plan.kind !== 'plant' || plan.evict !== null) continue
      const t = rotation(d)
      const bx = d.x + b.x * Math.cos(t) - b.y * Math.sin(t)
      const by = layout.groundY + b.x * Math.sin(t) + b.y * Math.cos(t)
      selfSeeded++
      seeds.push({
        x: plan.x,
        y0: by,
        t: 0,
        species: d.species,
        seed: Math.floor(rng() * 2 ** 31),
        hFrac: rr(rng, ...GARDEN.heights[d.species]),
        origin: 'self',
        drift: (bx - plan.x) * 0.5,
        spin: rr(rng, -2, 2),
      })
      return
    }
  }

  /* ---- events ---- */

  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top] as const
  }
  let down: { x: number; y: number; t: number } | null = null

  function onMove(e: PointerEvent) {
    if (e.pointerType === 'touch') return
    const [x, y] = local(e)
    pointer = { x, y, active: true, until: 0 }
    lastInteract = clock
    wake()
  }
  function onLeave(e: PointerEvent) {
    if (e.pointerType === 'touch') return
    pointer = { ...pointer, active: false }
    wake()
  }
  function onDown(e: PointerEvent) {
    const [x, y] = local(e)
    down = { x, y, t: performance.now() }
  }
  function onUp(e: PointerEvent) {
    if (!down) return
    const [x, y] = local(e)
    const tap = Math.hypot(x - down.x, y - down.y) < 10 && performance.now() - down.t < 700
    down = null
    if (!tap) return
    lastInteract = clock
    // On touch the plants near the tap lean toward it for a moment, as they do toward a mouse.
    if (e.pointerType === 'touch') pointer = { x, y, active: true, until: clock + 1400 }
    plantAt(x, y)
  }
  const onCancel = () => {
    down = null
  }

  function onReduceChange() {
    if (reduced()) {
      stop()
      for (const s of seeds) land(s)
      seeds = []
      plants = plants.filter((p) => !p.wither)
      for (const p of plants) {
        p.dormant = false
        p.lean = p.rustle = 0
        if (!p.done) {
          p.done = true
          p.age = Infinity
          p.bake = p.lineBake = p.rootBake = null
          if (p.model) {
            p.age = p.model.tEnd
            raster(p)
          }
        }
      }
      swayAmp = 0
      draw()
    } else {
      lastInteract = clock
      wake()
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) inView = e.isIntersecting
      if (inView) wake()
      else stop()
    },
    { threshold: 0 },
  )
  const onVisibility = () => {
    hidden = document.hidden
    if (hidden) stop()
    else wake()
  }
  const ro = new ResizeObserver(onResize)

  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerleave', onLeave)
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onCancel)
  mqReduce.addEventListener('change', onReduceChange)
  document.addEventListener('visibilitychange', onVisibility)
  io.observe(box)
  ro.observe(box)

  sizeCanvas()
  plantInitial(reduced())
  setLoop(false)
  wake()

  return {
    setPaused(next: boolean) {
      if (next === paused) return
      paused = next
      if (paused) {
        stop()
        draw()
      } else {
        lastInteract = clock
        wake()
      }
    },
    destroy() {
      destroyed = true
      stop()
      clearTimeout(resizeTimer)
      if (idleHandle) cic(idleHandle)
      jobs.length = 0
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onCancel)
      mqReduce.removeEventListener('change', onReduceChange)
      document.removeEventListener('visibilitychange', onVisibility)
      plants = []
      seeds = []
    },
  }
}
