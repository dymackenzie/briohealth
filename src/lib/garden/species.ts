import { GARDEN, type InkRole, type Species, type WashKey } from './config'
import { DONE_AT, invOutQuart, smoothstep } from './ease'
import { bendAngle, bendPt, clamp, cumLen, lerp, offsetPts, polyAt, rootPts, stemPts, TAU, xform, type Pt } from './path'
import { ri, rng32, rr, type Rng } from './rng'

/**
 * The five herbs as parametric models, in an engraving's terms: outlines,
 * hatching, stipple, paper fills that hide what is behind, and flat washes
 * under the ink. No DOM: the same model draws the canvas (pen.ts) and the
 * SVG still. Plant coordinates: the origin is the base on the ground line,
 * y down. A line part grows along its length; a group part (a leaf, a ray,
 * a disc) scales out from its anchor. Times are ms on the plant's own clock.
 */

/** Where a wash sits: its species, a misregistration (two unit vectors) and the plant's strength jitter. */
export interface WashTag {
  wash?: WashKey
  sp?: Species
  wo?: [number, number, number, number]
  wj?: number
}

export interface PathSpec extends WashTag {
  lines: Pt[][]
  closed?: boolean
  fill?: InkRole
  stroke?: InkRole
  w: number
  alpha?: number
  /** The canvas's cached geometry. */
  p2d?: Path2D
}

export interface LinePart extends WashTag {
  k: 'line'
  pts: Pt[]
  cum: Float32Array
  w: number
  /** The width at the far end; thinner than `w` for a tapered stem or root. */
  w1: number
  role: InkRole
  t0: number
  t1: number
  tDone: number
  alpha: number
  cache?: { path: Path2D; w: number }[]
}

export interface GroupPart {
  k: 'group'
  paths: PathSpec[]
  ax: number
  ay: number
  /** Anchor height, for the bend. */
  ah: number
  t0: number
  t1: number
  tDone: number
}

export type Part = LinePart | GroupPart

export interface Bloom {
  x: number
  y: number
  r: number
  t0: number
}

export interface Model {
  species: Species
  H: number
  top: Part[]
  roots: Part[]
  blooms: Bloom[]
  tEnd: number
  topLines: LinePart[]
  topGroups: GroupPart[]
}

/** The soil and sky a plant may use. */
export interface Env {
  rootDepth: number
  xMin: number
  xMax: number
  maxH: number
}

type Draft = Pick<Model, 'species' | 'H' | 'top' | 'roots' | 'blooms'>

export function linePart(pts: Pt[], w: number, role: InkRole, t0: number, t1: number, w1?: number, alpha?: number): LinePart {
  return { k: 'line', pts, cum: cumLen(pts), w, w1: w1 ?? w, role, t0, t1, tDone: t0 + (t1 - t0) * DONE_AT, alpha: alpha ?? 1 }
}

export function groupPart(paths: PathSpec[], ax: number, ay: number, t0: number, t1: number): GroupPart {
  return { k: 'group', paths, ax, ay, ah: -ay, t0, t1, tDone: t0 + (t1 - t0) * DONE_AT }
}

/** When a stem growing from t0 over dur reaches a fraction f of its length. */
export const stemTime = (t0: number, dur: number, f: number) => t0 + invOutQuart(f) * dur

type Profile = (u: number) => number

const PROFILE: Record<'lance' | 'spatula' | 'linear' | 'oblong', Profile> = {
  lance: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 1.15),
  spatula: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 1.6)), 0.62),
  linear: (u) => Math.pow(Math.sin(Math.PI * u), 0.35),
  oblong: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.9)), 0.55),
}

/** A strap-shaped ray: narrow at the base, rounded or toothed at the tip. */
const strap =
  (base: number, round: number): Profile =>
  (u) => {
    let w = base + (1 - base) * smoothstep(clamp(u / 0.4, 0, 1))
    if (round > 0 && u > 1 - round) w *= Math.sqrt(Math.max(0, 1 - Math.pow((u - (1 - round)) / round, 2)))
    return w
  }

interface BladeOpts {
  ax: number
  ay: number
  ang: number
  len: number
  wid: number
  profile: Profile
  curve?: number
  serr?: number
  veins?: 'arc'
  hatch?: boolean
  midrib?: boolean
  stroke?: InkRole
  w?: number
}

/** A blade leaf: outline, midrib, optional veins, hatching on the side away from the light. */
function bladeLeaf(o: BladeOpts): PathSpec[] {
  const L = GARDEN.lines
  const down = Math.cos(o.ang) >= 0 ? 1 : -1
  const n = Math.max(10, Math.round(o.len / 2.2))
  const curve = (o.curve ?? 0.12) * down
  const midY = (u: number) => curve * u * u * o.len
  const hwAt = (u: number, i: number) => {
    let t = 1
    if (o.serr && u > 0.15 && u < 0.92) t = 1 + o.serr * (i % 2 ? 1 : -0.4)
    return o.profile(u) * o.wid * t
  }
  const mid: Pt[] = []
  const up: Pt[] = []
  const lo: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const u = i / n
    const x = u * o.len
    const y = midY(u)
    const hw = hwAt(u, i)
    mid.push([x, y])
    up.push([x, y - hw])
    lo.push([x, y + hw])
  }
  const T = (pts: Pt[]) => xform(pts, o.ax, o.ay, o.ang)
  const stroke = o.stroke ?? 'line'
  const w = o.w ?? L.leafPx
  const paths: PathSpec[] = [{ lines: [T(up.concat(lo.reverse()))], closed: true, fill: 'petal', stroke, w, wash: 'leaf' }]
  if (o.midrib !== false) paths.push({ lines: [T(mid.slice(0, Math.round(n * 0.9)))], stroke, w: w * 0.7 })
  if (o.veins === 'arc') {
    const v: Pt[][] = []
    for (const s of [-1, 1]) {
      const line: Pt[] = []
      for (let i = 1; i <= n * 0.86; i++) {
        const u = i / n
        line.push([u * o.len, midY(u) + s * o.profile(u) * o.wid * 0.55])
      }
      v.push(T(line))
    }
    paths.push({ lines: v, stroke: 'hatch', w: L.hatchPx, alpha: L.hatchAlpha })
  }
  if (o.hatch !== false) {
    const h: Pt[][] = []
    const gap = L.hatchGapPx
    for (let x = o.len * 0.1; x < o.len * 0.88; x += gap) {
      const u = x / o.len
      const u2 = Math.min(0.97, u + 0.07)
      h.push(T([[x, midY(u) + down * 0.5], [u2 * o.len, midY(u2) + down * o.profile(u2) * o.wid * 0.86]]))
    }
    // The lit side: short strokes along the margin only, half as dense.
    for (let x = o.len * 0.2; x < o.len * 0.8; x += gap * 2) {
      const u = x / o.len
      const hw = o.profile(u) * o.wid
      h.push(T([[x, midY(u) - down * hw * 0.5], [x + gap * 0.8, midY(u) - down * hw * 0.85]]))
    }
    paths.push({ lines: h, stroke: 'hatch', w: L.hatchPx, alpha: L.hatchAlpha })
  }
  return paths
}

/** Chamomile's leaf: a rachis with thread-fine, forked lobes (bipinnate). */
function threadLeaf(rng: Rng, o: { ax: number; ay: number; ang: number; len: number }): PathSpec[] {
  const down = Math.cos(o.ang) >= 0 ? 1 : -1
  const lines: Pt[][] = []
  const rachis: Pt[] = []
  const ry = (u: number) => 0.14 * down * u * u * o.len
  for (let i = 0; i <= 8; i++) rachis.push([(i / 8) * o.len, ry(i / 8)])
  lines.push(rachis)
  const nl = 7
  for (let i = 1; i <= nl; i++) {
    const u = (i / (nl + 1)) * 0.96
    const side = i % 2 ? 1 : -1
    const bx = u * o.len
    const by = ry(u)
    const la = side * rr(rng, 0.5, 0.75)
    const ll = o.len * 0.36 * (1 - u * 0.55) * rr(rng, 0.85, 1.1)
    const tip: Pt = [bx + Math.cos(la) * ll, by + Math.sin(la) * ll]
    const midp: Pt = [bx + Math.cos(la) * ll * 0.5, by + Math.sin(la) * ll * 0.5]
    lines.push([[bx, by], midp, tip])
    const fa = la + side * 0.5
    const fl = ll * 0.45
    lines.push([midp, [midp[0] + Math.cos(fa) * fl, midp[1] + Math.sin(fa) * fl]])
    const q: Pt = [bx + Math.cos(la) * ll * 0.76, by + Math.sin(la) * ll * 0.76]
    const qa = la - side * 0.45
    lines.push([q, [q[0] + Math.cos(qa) * fl * 0.6, q[1] + Math.sin(qa) * fl * 0.6]])
  }
  return [{ lines: lines.map((l) => xform(l, o.ax, o.ay, o.ang)), stroke: 'line', w: 0.65, wash: 'leaf' }]
}

/** Yarrow's leaf: a rachis with dense, comb-like pinnae, each with tiny pinnules ("millefolium"). */
function featherLeaf(rng: Rng, o: { ax: number; ay: number; ang: number; len: number; wid: number }): PathSpec[] {
  const down = Math.cos(o.ang) >= 0 ? 1 : -1
  const ry = (u: number) => 0.1 * down * u * u * o.len
  const rachis: Pt[] = []
  for (let i = 0; i <= 10; i++) rachis.push([(i / 10) * o.len, ry(i / 10)])
  const pin: Pt[][] = []
  for (let x = o.len * 0.05; x < o.len * 0.98; x += 2.1) {
    const u = x / o.len
    const by = ry(u)
    for (const side of [-1, 1]) {
      const pl = o.wid * PROFILE.oblong(u) * rr(rng, 0.8, 1.1)
      const pa = side * rr(rng, 0.95, 1.15)
      pin.push([[x, by], [x + Math.cos(pa) * pl, by + Math.sin(pa) * pl]])
      for (const [t, s] of [[0.42, 1], [0.72, -1]] as const) {
        const q: Pt = [x + Math.cos(pa) * pl * t, by + Math.sin(pa) * pl * t]
        const ta = pa + s * 0.65
        pin.push([q, [q[0] + Math.cos(ta) * pl * 0.3, q[1] + Math.sin(ta) * pl * 0.3]])
      }
    }
  }
  const T = (l: Pt[]) => xform(l, o.ax, o.ay, o.ang)
  return [
    { lines: pin.map(T), stroke: 'hatch', w: 0.55, alpha: 0.95, wash: 'leaf' },
    { lines: [T(rachis)], stroke: 'line', w: 0.8 },
  ]
}

interface Ring {
  n: number
  len: number
  w: number
  e0: number
  curl: number
  profile: Profile
  teeth?: number
  notch?: number
  veins?: number[]
  z?: number
}

interface HeadOpts {
  r0: number
  dh: number
  pk: number
  beta: number
  stipple?: number
  spirals?: number
  spikes?: number
  petalPx?: number
  rings: Ring[]
}

/**
 * A composite flower head seen slightly from above. Rays are straps on a
 * ring around the vertical axis, reflexed by `e0` and `curl`, projected and
 * sorted, so the back rays sit behind the disc and the front ones over the
 * stem. The disc is a dome (chamomile), a spiny cone (echinacea) or nearly
 * flat (calendula), stippled or spiralled like an engraving.
 */
function flowerHead(m: Draft, rng: Rng, cx: number, cy: number, o: HeadOpts, t0: number) {
  const L = GARDEN.lines
  const dur = GARDEN.growth.bloomMs
  const cb = Math.cos(o.beta)
  const sb = Math.sin(o.beta)
  const proj = (X: number, Y: number, Z: number): Pt => [cx + X, cy - Z * cb + Y * sb]
  const rays: { depth: number; paths: PathSpec[]; ax: number; ay: number; a: number }[] = []
  for (const ring of o.rings) {
    const phase = rng() * TAU
    for (let i = 0; i < ring.n; i++) {
      const a = phase + (i * TAU) / ring.n + rr(rng, -0.1, 0.1)
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      const len = ring.len * rr(rng, 0.88, 1.08)
      const w = ring.w * rr(rng, 0.9, 1.1)
      const e0 = ring.e0 + rr(rng, -0.12, 0.12)
      const curl = ring.curl * rr(rng, 0.8, 1.2)
      const N = 10
      let X = ca * o.r0 * 0.9
      let Y = sa * o.r0 * 0.9
      let Z = ring.z ?? 0
      const left: Pt[] = []
      const right: Pt[] = []
      const ctr: [number, number, number, number][] = []
      let e = e0
      for (let k = 0; k <= N; k++) {
        const u = k / N
        if (k > 0) {
          e = e0 + curl * u
          const st = len / N
          X += ca * Math.cos(e) * st
          Y += sa * Math.cos(e) * st
          Z += Math.sin(e) * st
        }
        const hw = w * ring.profile(u)
        left.push(proj(X - sa * hw, Y + ca * hw, Z))
        right.push(proj(X + sa * hw, Y - ca * hw, Z))
        ctr.push([X, Y, Z, hw])
      }
      const tip: Pt[] = []
      if (ring.teeth) {
        const [X1, Y1, Z1, hw] = ctr[N]
        const dX = ca * Math.cos(e)
        const dY = sa * Math.cos(e)
        const dZ = Math.sin(e)
        const T = ring.teeth
        const depth = len * (ring.notch ?? 0.07)
        for (let j = 1; j < 2 * T; j++) {
          const s = 1 - (2 * j) / (2 * T)
          const back = j % 2 ? depth : 0
          tip.push(proj(X1 - sa * hw * s - dX * back, Y1 + ca * hw * s - dY * back, Z1 - dZ * back))
        }
      }
      const outline = left.concat(tip, right.slice().reverse())
      const [, mY, mZ] = ctr[N >> 1]
      const depth = mY * cb + mZ * sb
      const paths: PathSpec[] = [{ lines: [outline], closed: true, fill: 'petal', stroke: 'line', w: o.petalPx ?? L.petalPx, wash: 'petal' }]
      if (ring.veins) {
        const v: Pt[][] = []
        for (const off of ring.veins) {
          const line: Pt[] = []
          for (let k = 1; k <= N * 0.82; k++) {
            const [x, y, z, hw] = ctr[k]
            line.push(proj(x - sa * hw * off, y + ca * hw * off, z))
          }
          v.push(line)
        }
        paths.push({ lines: v, stroke: 'hatch', w: L.hatchPx, alpha: depth < 0 ? 1 : 0.7 })
      }
      const [bx, by] = proj(ctr[0][0], ctr[0][1], ctr[0][2])
      rays.push({ depth, paths, ax: bx, ay: by, a })
    }
  }
  rays.sort((p, q) => p.depth - q.depth)
  const rayT = (a: number) => t0 + dur * (0.3 + (0.25 * (((a % TAU) + TAU) % TAU)) / TAU)
  for (const r of rays) if (r.depth < 0) m.top.push(groupPart(r.paths, r.ax, r.ay, rayT(r.a), rayT(r.a) + dur * 0.55))
  m.top.push(groupPart(discPaths(rng, cx, cy, o), cx, cy, t0, t0 + dur * 0.45))
  for (const r of rays) if (r.depth >= 0) m.top.push(groupPart(r.paths, r.ax, r.ay, rayT(r.a), rayT(r.a) + dur * 0.55))
  const extent = o.rings.reduce((mx, r) => Math.max(mx, r.len), 0) + o.r0
  m.blooms.push({ x: cx, y: cy - o.dh * cb * 0.4, r: extent * 0.85, t0: t0 + dur * 0.5 })
}

function discPaths(rng: Rng, cx: number, cy: number, o: HeadOpts): PathSpec[] {
  const cb = Math.cos(o.beta)
  const sb = Math.sin(o.beta)
  const r0 = o.r0
  const pk = o.pk
  const N = 20
  const top: Pt[] = []
  const bot: Pt[] = []
  // The silhouette's top: the dome's projected height combined with the back
  // rim of the base ellipse, which is what shows from well above (calendula).
  const topY = (s: number) => -Math.hypot(o.dh * cb * Math.pow(s, pk), r0 * sb * s)
  for (let i = 0; i <= N; i++) {
    const t = Math.PI - (Math.PI * i) / N
    top.push([cx + r0 * Math.cos(t), cy + topY(Math.sin(t))])
  }
  for (let i = 1; i < N; i++) {
    const t = (Math.PI * i) / N
    bot.push([cx + r0 * Math.cos(t), cy + r0 * sb * Math.sin(t)])
  }
  const paths: PathSpec[] = [{ lines: [top.concat(bot)], closed: true, fill: 'petal', stroke: 'line', w: 0.85, wash: 'disc' }]
  if (o.stipple) {
    // Stipple as short ticks, never dots, denser on the shaded side.
    const ticks: Pt[][] = []
    const count = Math.round(r0 * r0 * o.stipple)
    for (let i = 0; i < count; i++) {
      const xr = rr(rng, -0.94, 0.94)
      const s = Math.sqrt(1 - xr * xr)
      const y = rr(rng, topY(s) * 0.88, r0 * sb * s * 0.8)
      if (rng() > 0.25 + 0.75 * Math.pow((xr + 1) / 2, 1.3)) continue
      const x = cx + xr * r0
      const yy = cy + y
      ticks.push([[x, yy], [x + 0.5, yy + 0.75]])
    }
    paths.push({ lines: ticks, stroke: 'line', w: 0.6, alpha: 0.9 })
  }
  if (o.spirals) {
    // Echinacea's cone: the two families of spirals the florets sit on, front half only.
    const runs: Pt[][] = []
    const Zf = (rho: number) => o.dh * Math.pow(Math.max(0, 1 - (rho / r0) ** 2), pk / 2)
    for (const k of [-1, 1]) {
      for (let j = 0; j < o.spirals; j++) {
        const phi0 = (j * TAU) / o.spirals + (k > 0 ? 0.13 : 0)
        let run: Pt[] = []
        for (let st = 0; st <= 16; st++) {
          const s = (st / 16) * 0.94
          const rho = r0 * Math.pow(1 - s, 0.9)
          const phi = phi0 + k * s * 2.3
          const dZ = (Zf(rho + 0.01) - Zf(rho)) / 0.01
          if (-dZ * Math.sin(phi) * cb + sb > 0.08) run.push([cx + rho * Math.cos(phi), cy - Zf(rho) * cb + rho * Math.sin(phi) * sb])
          else if (run.length) {
            if (run.length > 1) runs.push(run)
            run = []
          }
        }
        if (run.length > 1) runs.push(run)
      }
    }
    paths.push({ lines: runs, stroke: 'line', w: 0.5, alpha: 0.85 })
  }
  if (o.spikes) {
    const sp: Pt[][] = []
    for (let i = 2; i < N - 1; i++) {
      const p = top[i]
      const a = top[i - 1]
      const b = top[i + 1]
      const dx = b[0] - a[0]
      const dy = b[1] - a[1]
      const l = Math.hypot(dx, dy) || 1
      sp.push([p, [p[0] + (dy / l) * o.spikes, p[1] + (-dx / l) * o.spikes]])
    }
    paths.push({ lines: sp, stroke: 'line', w: 0.6 })
  }
  return paths
}

/** A stem, thinning toward the tip like an engraved one, with a fine shading line beside it when `double` is set. */
function addStem(m: Draft, pts: Pt[], w: number, t0: number, dur: number, double?: number) {
  const stem = linePart(pts, w, 'line', t0, t0 + dur, w * 0.6)
  stem.wash = 'stem'
  m.top.push(stem)
  if (double) m.top.push(linePart(offsetPts(pts, double), GARDEN.lines.hatchPx, 'hatch', t0, t0 + dur))
}

/* ---- roots ---- */

const rootDur = () => GARDEN.growth.stemMs / GARDEN.growth.rootRate

interface FibrousOpts {
  n: number
  spread: number
  len: readonly [number, number]
  branches?: number
  x0?: number
  y0?: number
  t0?: number
  w?: number
  wob?: number
  gravi?: number
}

function fibrousRoots(m: Draft, rng: Rng, env: Env, o: FibrousOpts) {
  const dur = rootDur()
  const lim = { xMin: env.xMin, xMax: env.xMax, yMax: env.rootDepth }
  for (let i = 0; i < o.n; i++) {
    const a = rr(rng, -o.spread, o.spread)
    const len = (env.rootDepth * rr(rng, o.len[0], o.len[1])) / Math.max(0.6, Math.cos(a))
    const pts = rootPts(rng, (o.x0 ?? 0) + rr(rng, -1.5, 1.5), o.y0 ?? 0, a, len, { wob: o.wob ?? 0.22, gravi: o.gravi ?? 0.35, ...lim })
    const t0 = (o.t0 ?? 0) + rr(rng, 0, GARDEN.growth.stemMs * 0.064)
    const t1 = t0 + dur * rr(rng, 0.75, 1)
    m.roots.push(linePart(pts, o.w ?? 1.0, 'root', t0, t1, 0.35))
    const nb = ri(rng, 1, o.branches ?? 2)
    for (let b = 0; b < nb; b++) {
      const f = rr(rng, 0.25, 0.75)
      const p = polyAt(pts, f)
      const sa = p.down + (rng() < 0.5 ? -1 : 1) * rr(rng, 0.5, 1.0)
      const sp = rootPts(rng, p.x, p.y, sa, len * rr(rng, 0.2, 0.4), { wob: 0.3, gravi: 0.3, ...lim })
      const st = stemTime(t0, t1 - t0, f)
      m.roots.push(linePart(sp, 0.6, 'root', st, st + (t1 - t0) * 0.5, 0.25))
    }
  }
}

function taproot(m: Draft, rng: Rng, env: Env, o: { len: number; thick: number; laterals: number }) {
  const dur = rootDur()
  const ctr = rootPts(rng, 0, 0, rr(rng, -0.08, 0.08), env.rootDepth * o.len, { wob: 0.07, gravi: 0.8, step: 3, yMax: env.rootDepth })
  const n = ctr.length - 1
  const left: Pt[] = []
  const right: Pt[] = []
  ctr.forEach((p, i) => {
    const hw = o.thick * Math.pow(1 - i / n, 0.85) + 0.25
    const a = ctr[Math.max(0, i - 1)]
    const b = ctr[Math.min(n, i + 1)]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const l = Math.hypot(dx, dy) || 1
    left.push([p[0] - (dy / l) * hw, p[1] + (dx / l) * hw])
    right.push([p[0] + (dy / l) * hw, p[1] - (dx / l) * hw])
  })
  m.roots.push(linePart(left, 0.9, 'root', 0, dur))
  m.roots.push(linePart(right, 0.9, 'root', 0, dur))
  // Transverse wrinkles, as on an engraved root.
  for (let i = 2; i < n - 3; i += 3) {
    const t = stemTime(0, dur, i / n)
    const mid: Pt = [(left[i][0] + right[i][0]) / 2, (left[i][1] + right[i][1]) / 2 + 0.6]
    m.roots.push(groupPart([{ lines: [[left[i], mid, right[i]]], stroke: 'root', w: 0.5, alpha: 0.75 }], ctr[i][0], ctr[i][1], t, t + GARDEN.growth.leafMs * 0.15))
  }
  for (let j = 0; j < o.laterals; j++) {
    const f = rr(rng, 0.15, 0.85)
    const p = polyAt(ctr, f)
    const side = j % 2 ? 1 : -1
    const sp = rootPts(rng, p.x + side * o.thick * (1 - f), p.y, side * rr(rng, 0.7, 1.3), env.rootDepth * rr(rng, 0.18, 0.42), {
      wob: 0.3,
      gravi: 0.5,
      xMin: env.xMin,
      xMax: env.xMax,
      yMax: env.rootDepth,
    })
    const st = stemTime(0, dur, f)
    m.roots.push(linePart(sp, 0.65, 'root', st, st + dur * 0.5, 0.25))
  }
}

/* ---- the five herbs ---- */

type Builder = (rng: Rng, H: number, env: Env) => Draft

const draft = (species: Species, H: number): Draft => ({ species, H, top: [], roots: [], blooms: [] })

/** Echinacea purpurea: one stout stem, coarse lanceolate leaves, a big spiny cone with long down-swept rays; a taproot. */
const echinacea: Builder = (rng, H, env) => {
  const m = draft('echinacea', H)
  const g = GARDEN.growth
  const L = GARDEN.lines
  const t0 = g.rootLeadMs
  const dur = g.stemMs
  const stem = stemPts(rng, 0, 0, rr(rng, -0.06, 0.06), H * 0.84, { curv: rr(rng, -0.12, 0.12), wob: 0.02, upright: 0.5 })
  addStem(m, stem, L.stoutPx, t0, dur, 1.5)
  let side2: { tip: Pt; t: number } | null = null
  if (rng() < 0.8) {
    const f = rr(rng, 0.4, 0.46)
    const p = polyAt(stem, f)
    const side = rng() < 0.5 ? -1 : 1
    const br = stemPts(rng, p.x, p.y, p.a + side * 0.75, H * rr(rng, 0.24, 0.28), { curv: -side * 0.7, wob: 0.02 })
    const bt = stemTime(t0, dur, f)
    addStem(m, br, L.stemPx, bt, dur * 0.7)
    side2 = { tip: br[br.length - 1], t: stemTime(bt, dur * 0.7, 0.96) }
  }
  for (let i = 0; i < 6; i++) {
    const f = 0.05 + i * 0.1 + rr(rng, -0.015, 0.015)
    const p = polyAt(stem, f)
    const side = i % 2 ? 1 : -1
    const len = H * (0.3 - 0.17 * (f / 0.6)) * rr(rng, 0.92, 1.06)
    const ang = -Math.PI / 2 + p.a + side * rr(rng, 0.85, 1.1)
    const lt = stemTime(t0, dur, f)
    m.top.push(groupPart(bladeLeaf({ ax: p.x, ay: p.y, ang, len, wid: len * 0.17, profile: PROFILE.lance, curve: 0.2, serr: 0.06, veins: 'arc' }), p.x, p.y, lt, lt + g.leafMs))
  }
  const head = (x: number, y: number, r0: number, t: number) =>
    flowerHead(
      m,
      rng,
      x,
      y,
      {
        r0,
        dh: r0 * 1.15,
        pk: 0.7,
        beta: 0.3,
        spirals: 9,
        spikes: 1.6,
        rings: [{ n: 13, len: r0 * 2.5, w: r0 * 0.3, e0: -0.62, curl: -0.45, profile: strap(0.5, 0), teeth: 3, notch: 0.06, veins: [-0.35, 0.35] }],
      },
      t,
    )
  if (side2) head(side2.tip[0], side2.tip[1], H * 0.036, side2.t)
  const tip = stem[stem.length - 1]
  head(tip[0], tip[1], H * 0.056, stemTime(t0, dur, 0.96))
  taproot(m, rng, env, { len: 0.88, thick: 2.6, laterals: 7 })
  return m
}

/** Matricaria chamomilla: slender branching stems, thread leaves, small heads with a raised dome and reflexed rays; fibrous roots. */
const chamomile: Builder = (rng, H, env) => {
  const m = draft('chamomile', H)
  const g = GARDEN.growth
  const L = GARDEN.lines
  const t0 = g.rootLeadMs
  const dur = g.stemMs * 0.9
  const main = stemPts(rng, 0, 0, rr(rng, -0.12, 0.12), H * rr(rng, 0.8, 0.88), { curv: rr(rng, -0.25, 0.25), wob: 0.05, upright: 0.3 })
  addStem(m, main, L.stemPx * 0.85, t0, dur)
  const tipM = main[main.length - 1]
  const heads: [number, number, number, number][] = [[tipM[0], tipM[1], H * 0.034, stemTime(t0, dur, 0.96)]]
  const leaves: [ReturnType<typeof polyAt>, number, number, number][] = []
  const nb = ri(rng, 3, 4)
  for (let i = 0; i < nb; i++) {
    const f = 0.3 + (i / nb) * 0.42 + rr(rng, -0.03, 0.03)
    const p = polyAt(main, f)
    const side = i % 2 ? 1 : -1
    const bl = H * rr(rng, 0.3, 0.42) * (1 - f * 0.35)
    const br = stemPts(rng, p.x, p.y, p.a + side * rr(rng, 0.4, 0.65), bl, { curv: -side * rr(rng, 0.2, 0.4), wob: 0.05 })
    const bt = stemTime(t0, dur, f)
    addStem(m, br, L.stemPx * 0.7, bt, dur * 0.7)
    const tip = br[br.length - 1]
    heads.push([tip[0], tip[1], H * 0.03 * rr(rng, 0.85, 1.05), stemTime(bt, dur * 0.7, 0.96)])
    leaves.push([polyAt(br, 0.4), side, stemTime(bt, dur * 0.7, 0.4), 0.13])
  }
  for (let i = 0; i < 7; i++) {
    const f = 0.04 + i * 0.1
    leaves.push([polyAt(main, f), i % 2 ? 1 : -1, stemTime(t0, dur, f), 0.19 * (1 - f * 0.45)])
  }
  for (const [p, side, t, s] of leaves) {
    const ang = -Math.PI / 2 + p.a + side * rr(rng, 0.75, 1.1)
    m.top.push(groupPart(threadLeaf(rng, { ax: p.x, ay: p.y, ang, len: H * s }), p.x, p.y, t, t + g.leafMs))
  }
  for (const [x, y, r0, t] of heads) {
    flowerHead(
      m,
      rng,
      x,
      y,
      { r0, dh: r0 * 1.25, pk: 0.85, beta: 0.4, stipple: 3.4, petalPx: 0.65, rings: [{ n: 13, len: r0 * 2.2, w: r0 * 0.4, e0: -0.2, curl: -1.0, profile: strap(0.5, 0.25) }] },
      t,
    )
  }
  fibrousRoots(m, rng, env, { n: 9, spread: 0.9, len: [0.35, 0.7], branches: 2 })
  return m
}

/** Calendula officinalis: low and bushy, spatulate leaves, flat heads of broad toothed rays in two rows; a short taproot. */
const calendula: Builder = (rng, H, env) => {
  const m = draft('calendula', H)
  const g = GARDEN.growth
  const L = GARDEN.lines
  const t0 = g.rootLeadMs
  const dur = g.stemMs * 0.85
  const ns = ri(rng, 3, 4)
  const angles = ns === 3 ? [-0.42, 0.05, 0.45] : [-0.55, -0.18, 0.2, 0.55]
  const heads: [number, number, number, number, boolean][] = []
  const leaves: [{ x: number; y: number; a: number }, number, number, number, number][] = []
  angles.forEach((a0, i) => {
    const a = a0 + rr(rng, -0.08, 0.08)
    const len = H * (1 - Math.abs(a) * 0.55) * rr(rng, 0.86, 1.0)
    const st = stemPts(rng, rr(rng, -2, 2), 0, a, len, { curv: -a * 0.8, wob: 0.03 })
    const ts = t0 + i * g.stemMs * 0.027
    addStem(m, st, L.stemPx, ts, dur, 1.1)
    const tip = st[st.length - 1]
    heads.push([tip[0], tip[1], H * rr(rng, 0.05, 0.06), stemTime(ts, dur, 0.96), i === 0 && ns === 4])
    for (const f of [0.35, 0.62]) {
      const side = i % 2 ? (f > 0.5 ? 1 : -1) : f > 0.5 ? -1 : 1
      leaves.push([polyAt(st, f), side, stemTime(ts, dur, f), H * 0.2, 0.5])
    }
  })
  for (let i = 0; i < 5; i++) {
    const side = i % 2 ? 1 : -1
    leaves.unshift([{ x: 0, y: -2, a: 0 }, side, t0 + g.stemMs * (0.036 + i * 0.032), H * rr(rng, 0.24, 0.32), rr(rng, 0.7, 1.15) + (i >> 1) * 0.06])
  }
  for (const [p, side, t, len, spread] of leaves) {
    const ang = -Math.PI / 2 + p.a + side * spread
    m.top.push(groupPart(bladeLeaf({ ax: p.x, ay: p.y, ang, len, wid: len * 0.24, profile: PROFILE.spatula, curve: 0.16 }), p.x, p.y, t, t + g.leafMs))
  }
  for (const [x, y, r0, t, bud] of heads) {
    if (bud) {
      flowerHead(m, rng, x, y, { r0: r0 * 0.6, dh: r0 * 0.5, pk: 1, beta: 0.2, rings: [{ n: 9, len: r0 * 0.9, w: r0 * 0.3, e0: 1.1, curl: 0.25, profile: strap(0.6, 0.3) }] }, t)
      continue
    }
    flowerHead(
      m,
      rng,
      x,
      y,
      {
        r0,
        dh: r0 * 0.3,
        pk: 1,
        beta: 0.85,
        stipple: 4.2,
        rings: [
          { n: 16, len: r0 * 1.6, w: r0 * 0.34, e0: 0.16, curl: -0.25, profile: strap(0.38, 0), teeth: 3, notch: 0.08, veins: [-0.35, 0.35] },
          { n: 12, len: r0 * 1.05, w: r0 * 0.3, e0: 0.35, curl: -0.2, profile: strap(0.4, 0), teeth: 3, notch: 0.08, z: r0 * 0.1, veins: [0] },
        ],
      },
      t,
    )
  }
  taproot(m, rng, env, { len: 0.58, thick: 1.8, laterals: 6 })
  return m
}

/** Lavandula angustifolia: a woody base, a fan of leafless stalks with interrupted spikes of whorled florets, grey linear leaves. */
const lavender: Builder = (rng, H, env) => {
  const m = draft('lavender', H)
  const g = GARDEN.growth
  const L = GARDEN.lines
  const t0 = g.rootLeadMs
  const dur = g.stemMs
  const k = clamp(H / 180, 0.7, 1.25)
  const woody: Pt[][] = []
  for (const a of [-0.35, 0.05, 0.4]) {
    const w = stemPts(rng, rr(rng, -1.5, 1.5), 0, a + rr(rng, -0.08, 0.08), H * rr(rng, 0.1, 0.15), { curv: -a * 0.5, wob: 0.06 })
    addStem(m, w, L.stoutPx * 1.1, t0, dur * 0.5, 1.3)
    woody.push(w)
  }
  const ns = ri(rng, 6, 8)
  const leaves: [ReturnType<typeof polyAt>, number, number][] = []
  const spikes: [Pt[], number, number][] = []
  for (let i = 0; i < ns; i++) {
    const wd = woody[Math.min(2, Math.floor((i / ns) * 3))]
    const base = wd[wd.length - 1]
    const a = lerp(-0.3, 0.3, i / (ns - 1)) + rr(rng, -0.06, 0.06)
    const len = H * rr(rng, 0.74, 0.88) - H * 0.12
    const st = stemPts(rng, base[0], base[1], a, len, { curv: -a * 0.35, wob: 0.015, step: 6 })
    const bt = stemTime(t0, dur * 0.5, 0.9) + i * g.stemMs * 0.02
    addStem(m, st, L.stemPx * 0.75, bt, dur * 0.8)
    spikes.push([st, bt, 1 - (H * rr(rng, 0.21, 0.26)) / len])
    leaves.push([polyAt(st, 0.06), bt, 1], [polyAt(st, 0.12), bt, -1])
  }
  for (const wd of woody) {
    for (const f of [0.4, 0.75, 1]) {
      const p = polyAt(wd, f)
      leaves.push([p, t0 + g.stemMs * 0.055, 1], [p, t0 + g.stemMs * 0.064, -1])
    }
  }
  for (const [p, t, side] of leaves) {
    const ang = -Math.PI / 2 + p.a + side * rr(rng, 0.3, 0.7)
    const len = H * rr(rng, 0.1, 0.15)
    m.top.push(
      groupPart(
        bladeLeaf({ ax: p.x, ay: p.y, ang, len, wid: 1.35 * k, profile: PROFILE.linear, curve: 0.05, hatch: false, midrib: false, stroke: 'hatch', w: 0.75 }),
        p.x,
        p.y,
        t,
        t + g.leafMs,
      ),
    )
  }
  for (const [st, bt, fs] of spikes) lavenderSpike(m, rng, st, bt, dur * 0.8, fs, k)
  // Woody, branching roots.
  const rd = rootDur()
  for (let i = 0; i < 4; i++) {
    const a = rr(rng, -0.7, 0.7)
    const len = env.rootDepth * rr(rng, 0.55, 0.9)
    const lim = { xMin: env.xMin, xMax: env.xMax, yMax: env.rootDepth }
    const pts = rootPts(rng, rr(rng, -2, 2), 0, a, len, { wob: 0.28, gravi: 0.3, ...lim })
    const rt = rr(rng, 0, g.stemMs * 0.045)
    m.roots.push(linePart(pts, 1.7, 'root', rt, rt + rd * rr(rng, 0.8, 1), 0.4))
    for (let b = 0; b < 3; b++) {
      const f = rr(rng, 0.2, 0.8)
      const p = polyAt(pts, f)
      const sp = rootPts(rng, p.x, p.y, p.down + (b % 2 ? 1 : -1) * rr(rng, 0.5, 1), len * rr(rng, 0.25, 0.45), { wob: 0.3, gravi: 0.3, ...lim })
      const st = stemTime(rt, rd, f)
      m.roots.push(linePart(sp, 0.8, 'root', st, st + rd * 0.5, 0.25))
    }
  }
  return m
}

function lavenderSpike(m: Draft, rng: Rng, stalk: Pt[], t0: number, dur: number, fs: number, k: number) {
  const L = GARDEN.lines
  const nw = ri(rng, 7, 9)
  let last = t0
  for (let w = 0; w < nw; w++) {
    const q = w / (nw - 1)
    const f = fs + (0.985 - fs) * Math.pow(q, 0.75)
    const p = polyAt(stalk, f)
    const s = 1 - 0.35 * q
    const paths: PathSpec[] = []
    for (const [j, spread] of [[-2, 1.05], [2, 1.0], [-1, 0.5], [1, 0.55], [0, 0]] as const) {
      if (q > 0.85 && Math.abs(j) === 2) continue
      const sgn = Math.sign(j) || (rng() < 0.5 ? -1 : 1)
      const a = p.a + sgn * spread * rr(rng, 0.85, 1.15)
      const flen = (j === 0 ? 4.2 : 5.2) * s * k
      const fw = 1.7 * s * k
      const shape: Pt[] = []
      for (let i = 0; i <= 8; i++) shape.push([(i / 8) * flen, -fw * Math.pow(Math.sin(Math.PI * Math.pow(i / 8, 0.75)), 0.9)])
      for (let i = 8; i >= 0; i--) shape.push([(i / 8) * flen, fw * Math.pow(Math.sin(Math.PI * Math.pow(i / 8, 0.75)), 0.9)])
      const ang = -Math.PI / 2 + a
      const bx = p.x + Math.cos(ang + Math.PI / 2) * sgn * 0.5
      const by = p.y + Math.sin(ang + Math.PI / 2) * sgn * 0.5
      paths.push({ lines: [xform(shape, bx, by, ang)], closed: true, fill: 'petal', stroke: 'line', w: 0.65, wash: 'calyx' })
      if (j !== 0 && q < 0.8 && rng() < 0.6) {
        // A corolla lip just out of the calyx.
        const tx = bx + Math.cos(ang) * (flen + 0.9 * k)
        const ty = by + Math.sin(ang) * (flen + 0.9 * k)
        const lip: Pt[] = []
        for (let i = 0; i <= 10; i++) lip.push([tx + Math.cos((i / 10) * TAU) * 1.15 * k, ty + Math.sin((i / 10) * TAU) * 0.8 * k])
        paths.push({ lines: [lip], closed: true, fill: 'petal', stroke: 'line', w: 0.55, wash: 'petal' })
      }
      if (sgn > 0) paths.push({ lines: [xform([[flen * 0.2, 0.2], [flen * 0.8, 0.4]], bx, by, ang)], stroke: 'hatch', w: L.hatchPx, alpha: L.hatchAlpha })
    }
    const tw = stemTime(t0, dur, f)
    m.top.push(groupPart(paths, p.x, p.y, tw, tw + GARDEN.growth.leafMs * 0.8))
    last = Math.max(last, tw)
  }
  const pm = polyAt(stalk, (fs + 1) / 2)
  const c = cumLen(stalk)
  m.blooms.push({ x: pm.x, y: pm.y, r: (c[c.length - 1] * (1 - fs)) / 2 + 4, t0: last })
}

/** Achillea millefolium: upright stem, feathery comb-like leaves, a flat-topped corymb of tiny florets; a creeping rhizome. */
const yarrow: Builder = (rng, H, env) => {
  const m = draft('yarrow', H)
  const g = GARDEN.growth
  const L = GARDEN.lines
  const t0 = g.rootLeadMs
  const dur = g.stemMs
  const wC = H * rr(rng, 0.16, 0.19)
  const stem = stemPts(rng, 0, 0, rr(rng, -0.05, 0.05), H * 0.86 - wC * 0.5, { curv: rr(rng, -0.1, 0.1), wob: 0.02, upright: 0.6 })
  addStem(m, stem, L.stemPx, t0, dur, 1.2)
  const nl = ri(rng, 7, 8)
  for (let i = 0; i < nl; i++) {
    const f = 0.02 + i * (0.68 / nl)
    const p = polyAt(stem, f)
    const side = i % 2 ? 1 : -1
    const len = H * (0.28 - 0.16 * (f / 0.7)) * rr(rng, 0.9, 1.08)
    const ang = -Math.PI / 2 + p.a + side * (f < 0.1 ? rr(rng, 1.0, 1.25) : rr(rng, 0.6, 0.85))
    const lt = stemTime(t0, dur, f)
    m.top.push(groupPart(featherLeaf(rng, { ax: p.x, ay: p.y, ang, len, wid: len * 0.13 }), p.x, p.y, lt, lt + g.leafMs))
  }
  let side: [Pt, number] | null = null
  if (rng() < 0.65) {
    const f = rr(rng, 0.5, 0.58)
    const p = polyAt(stem, f)
    const s = rng() < 0.5 ? -1 : 1
    const br = stemPts(rng, p.x, p.y, p.a + s * 0.8, H * rr(rng, 0.22, 0.26), { curv: -s * 0.75, wob: 0.02 })
    const bt = stemTime(t0, dur, f)
    addStem(m, br, L.stemPx * 0.8, bt, dur * 0.6)
    side = [br[br.length - 1], stemTime(bt, dur * 0.6, 0.96)]
  }
  const tip = stem[stem.length - 1]
  corymb(m, rng, tip[0], tip[1], wC, stemTime(t0, dur, 0.96))
  if (side) corymb(m, rng, side[0][0], side[0][1], wC * 0.55, side[1])
  // Rhizome: a creeping runner just under the ground. It wanders (a slow
  // undulation plus a random walk), thins as it goes, has a node about every
  // 30px with a scale scar, and fine wavy rootlets hang from each node. A
  // shorter runner may go the other way.
  const rd = rootDur()
  fibrousRoots(m, rng, env, { n: 4, spread: 0.7, len: [0.25, 0.55], branches: 2, wob: 0.42, gravi: 0.2 })
  const first = rng() < 0.5 ? -1 : 1
  const runners: [number, number][] = [
    [first, 1],
    [-first, rng() < 0.4 ? 0.55 : 0],
  ]
  for (const [dir, share] of runners) {
    if (!share) continue
    const room = dir > 0 ? env.xMax - 6 : -env.xMin - 6
    const len = Math.min(env.rootDepth * 0.85 * share, room)
    if (len < 20) continue
    const n = Math.round(len / 3)
    const phase = rr(rng, 0, TAU)
    const maxY = Math.min(22, env.rootDepth * 0.32)
    const rz: Pt[] = []
    let y = 6
    let drift = 0
    for (let i = 0; i <= n; i++) {
      drift = drift * 0.8 + (rng() - 0.5) * 0.9
      y = clamp(y + drift * 0.6 + 0.1, 4, maxY)
      rz.push([dir * (i / n) * len, y + 1.6 * Math.sin(i * 0.33 + phase)])
    }
    const rt = share < 1 ? rd * 0.25 : 0
    m.roots.push(linePart(rz, 1.6, 'root', rt, rt + rd, 0.7))
    const nodes = Math.max(2, Math.round(len / 30))
    for (let k = 1; k <= nodes; k++) {
      const f = k / (nodes + 0.4)
      const p = polyAt(rz, f)
      const t = stemTime(rt, rd, f)
      const scar: Pt[] = [
        [p.x - 0.4 * dir, p.y - 2.2],
        [p.x + 0.6 * dir, p.y + 1.8],
      ]
      m.roots.push(groupPart([{ lines: [scar], stroke: 'root', w: 0.6, alpha: 0.8 }], p.x, p.y, t, t + GARDEN.growth.leafMs * 0.2))
      fibrousRoots(m, rng, env, { n: ri(rng, 1, 2), spread: 0.7, len: [0.14, 0.36], branches: 1, x0: p.x, y0: p.y, t0: t, w: 0.7, wob: 0.45, gravi: 0.18 })
    }
  }
  return m
}

function corymb(m: Draft, rng: Rng, tx: number, ty: number, wC: number, t0: number) {
  const dur = GARDEN.growth.bloomMs
  const k = clamp(wC / 26, 0.65, 1.2)
  const top = ty - wC * 0.5
  const florets: Pt[] = []
  const count = Math.round(wC * 2.4)
  for (let i = 0; i < count; i++) {
    const phi = rr(rng, 0, Math.PI)
    const rho = Math.sqrt(rng())
    const X = Math.cos(phi) * rho * wC
    const D = Math.sin(phi) * rho
    florets.push([tx + X, top + Math.pow(X / wC, 2) * wC * 0.3 + D * wC * 0.26])
  }
  // Pedicels: the stem divides into a few rays that each feed a cluster.
  const fork: Pt = [tx, ty - wC * 0.12]
  const ped: Pt[][] = [[[tx, ty], fork]]
  const nP = ri(rng, 5, 7)
  for (let i = 0; i < nP; i++) {
    const X = lerp(-0.8, 0.8, i / (nP - 1)) * wC + rr(rng, -2, 2)
    const end: Pt = [tx + X * 0.85, top + Math.pow(X / wC, 2) * wC * 0.3 + wC * 0.08]
    ped.push([fork, [lerp(fork[0], end[0], 0.5), lerp(fork[1], end[1], 0.6)], end])
  }
  m.top.push(groupPart([{ lines: ped, stroke: 'line', w: 0.6 }], tx, ty, t0, t0 + dur * 0.45))
  florets.sort((a, b) => a[1] - b[1])
  const rf = 2.2 * k
  const paths: PathSpec[] = florets.map(([x, y]) => {
    const pts: Pt[] = []
    for (let j = 0; j < 15; j++) {
      const t = (j / 15) * TAU
      const r = rf * (0.76 + 0.24 * Math.abs(Math.cos(2.5 * t)))
      pts.push([x + Math.cos(t) * r, y + Math.sin(t) * r * 0.8])
    }
    return { lines: [pts], closed: true, fill: 'petal', stroke: 'line', w: 0.55, wash: 'petal' }
  })
  const ticks: Pt[][] = florets.filter(() => rng() < 0.7).map(([x, y]) => [[x - 0.3, y - 0.2], [x + 0.4, y + 0.3]])
  paths.push({ lines: ticks, stroke: 'line', w: 0.5, alpha: 0.8 })
  m.top.push(groupPart(paths, tx, top + wC * 0.1, t0 + dur * 0.3, t0 + dur))
  m.blooms.push({ x: tx, y: top + wC * 0.08, r: wC * 0.9, t0: t0 + dur * 0.55 })
}

const BUILDERS: Record<Species, Builder> = { chamomile, echinacea, calendula, lavender, yarrow }

/** A plant's model, shrunk if it would rise above the sky's top margin, with its washes tagged. */
export function buildModel(species: Species, seed: number, H: number, env: Env): Model {
  let d = BUILDERS[species](rng32(seed), H, env)
  for (let pass = 0; pass < 2; pass++) {
    const b = modelBounds(d.top, 0, H)
    if (-b.minY <= env.maxH) break
    H *= env.maxH / -b.minY
    d = BUILDERS[species](rng32(seed), H, env)
  }
  // Each wash gets its species, an offset (the plant's misregistration plus a
  // little of its own, as unit vectors the config scales) and the plant's
  // strength jitter.
  const wr = rng32(seed ^ 0x5bd1e995)
  const dir = wr() * TAU
  const wj = wr() * 2 - 1
  const tag = (o: WashTag) => {
    o.sp = species
    o.wo = [Math.cos(dir), Math.sin(dir), wr() * 2 - 1, wr() * 2 - 1]
    o.wj = wj
  }
  for (const p of d.top) {
    if (p.k === 'line') {
      if (p.wash) tag(p)
    } else for (const path of p.paths) if (path.wash) tag(path)
  }
  let tEnd = 0
  for (const p of d.top) tEnd = Math.max(tEnd, p.tDone)
  for (const p of d.roots) tEnd = Math.max(tEnd, p.tDone)
  return {
    ...d,
    tEnd,
    topLines: d.top.filter((p): p is LinePart => p.k === 'line'),
    topGroups: d.top.filter((p): p is GroupPart => p.k === 'group'),
  }
}

export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

/** The extent of some parts, bent by `bend`. */
export function modelBounds(parts: Part[], bend: number, H: number): Bounds {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  const add = (x: number, y: number) => {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  for (const p of parts) {
    if (p.k === 'line') {
      for (const q of p.pts) {
        const b = bendPt(q, bend, H)
        add(b[0], b[1])
      }
    } else {
      const t = bend ? bendAngle(bend, p.ah, H) : 0
      const c = Math.cos(t)
      const s = Math.sin(t)
      for (const path of p.paths) for (const l of path.lines) for (const q of l) add(q[0] * c - q[1] * s, q[0] * s + q[1] * c)
    }
  }
  return { minX, minY, maxX, maxY }
}
