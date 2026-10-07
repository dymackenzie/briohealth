import { GARDEN, type Species } from './config'
import { easeOutQuart } from './ease'
import { bendAngle, clamp, lerp, TAU, type Pt } from './path'
import type { GroupPart, LinePart, Part, PathSpec } from './species'
import { INK, washOf } from './wash'

/**
 * Two pens for one model. The canvas pen draws a plant at any stage of its
 * growth: a line up to a share of its length, a group scaled out from its
 * anchor, each wash fading in behind its line as the part opens. The SVG
 * pen writes the finished plant for the server-rendered still. Both lay
 * down, per path: the paper fill (which hides what is behind), the wash,
 * then the ink.
 */

/* ---------------------------------------------------------------- canvas */

function toPath2D(lines: Pt[][], closed?: boolean): Path2D {
  const p = new Path2D()
  for (const l of lines) {
    p.moveTo(l[0][0], l[0][1])
    for (let i = 1; i < l.length; i++) p.lineTo(l[i][0], l[i][1])
    if (closed) p.closePath()
  }
  return p
}

/** Draw parts at `age` ms, bent by `bend`, at opacity A. */
export function drawParts(ctx: CanvasRenderingContext2D, parts: Part[], age: number, bend: number, H: number, A: number) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const p of parts) {
    if (age <= p.t0) continue
    const e = age >= p.tDone ? 1 : easeOutQuart((age - p.t0) / (p.t1 - p.t0))
    if (p.k === 'line') drawLine(ctx, p, e, bend, H, A)
    else drawGroup(ctx, p, e, bend, H, A)
  }
}

export function drawLine(ctx: CanvasRenderingContext2D, p: LinePart, e: number, bend: number, H: number, A: number) {
  const n = p.pts.length
  const chunks = p.w1 !== p.w ? 4 : 1
  const per = Math.ceil((n - 1) / chunks)
  const width = (s: number) => lerp(p.w, p.w1, (s + per / 2) / (n - 1))
  const w = washOf(p)
  let list: { path: Path2D; w: number }[]
  if (e >= 1 && !bend) {
    if (!p.cache) {
      p.cache = []
      for (let c = 0; c < chunks; c++) {
        const s = c * per
        if (s >= n - 1) break
        p.cache.push({ path: toPath2D([p.pts.slice(s, Math.min(n - 1, s + per) + 1)]), w: width(s) })
      }
    }
    list = p.cache
  } else {
    const total = p.cum[n - 1] * e
    // The last whole point, then the partial one, bent on the fly.
    let last = 0
    while (last < n - 1 && p.cum[last + 1] <= total) last++
    const frac = last < n - 1 ? (total - p.cum[last]) / (p.cum[last + 1] - p.cum[last]) : 0
    const end = frac > 0 ? last + 1 : last
    if (end < 1) return
    const point = (i: number): Pt => {
      let x = p.pts[i][0]
      let y = p.pts[i][1]
      if (i > last) {
        x = lerp(p.pts[last][0], x, frac)
        y = lerp(p.pts[last][1], y, frac)
      }
      if (bend && y < 0) {
        const t = bendAngle(bend, -y, H)
        const cs = Math.cos(t)
        const sn = Math.sin(t)
        const bx = x * cs - y * sn
        y = x * sn + y * cs
        x = bx
      }
      return [x, y]
    }
    if (!w) {
      // No wash (roots, hatching): straight onto the context, no Path2D per frame.
      ctx.strokeStyle = INK[p.role]
      ctx.globalAlpha = A * p.alpha
      for (let c = 0; c < chunks; c++) {
        const s0 = c * per
        if (s0 >= end) break
        ctx.lineWidth = width(s0)
        ctx.beginPath()
        for (let i = s0; i <= Math.min(end, s0 + per); i++) {
          const q = point(i)
          if (i === s0) ctx.moveTo(q[0], q[1])
          else ctx.lineTo(q[0], q[1])
        }
        ctx.stroke()
      }
      return
    }
    list = []
    for (let c = 0; c < chunks; c++) {
      const s0 = c * per
      if (s0 >= end) break
      const path = new Path2D()
      for (let i = s0; i <= Math.min(end, s0 + per); i++) {
        const q = point(i)
        if (i === s0) path.moveTo(q[0], q[1])
        else path.lineTo(q[0], q[1])
      }
      list.push({ path, w: width(s0) })
    }
  }
  if (w) {
    ctx.globalAlpha = A * w.a
    ctx.strokeStyle = w.c
    ctx.translate(w.dx, w.dy)
    for (const c of list) {
      ctx.lineWidth = c.w + GARDEN.washes.lineWashPx
      ctx.stroke(c.path)
    }
    ctx.translate(-w.dx, -w.dy)
  }
  ctx.strokeStyle = INK[p.role]
  ctx.globalAlpha = A * p.alpha
  for (const c of list) {
    ctx.lineWidth = c.w
    ctx.stroke(c.path)
  }
}

/**
 * A group at growth `e`: its paper and ink fade in fast, and the wash comes
 * in behind the line as the part opens.
 */
export const groupFades = (e: number) => ({ fade: Math.min(1, e * 2.5), washFade: clamp((e - 0.3) / 0.7, 0, 1) })

/** Bend a group about the plant's base and scale it out from its anchor (ctx is saved by the caller). */
export function groupTransform(ctx: CanvasRenderingContext2D, g: GroupPart, e: number, bend: number, H: number) {
  if (bend) ctx.rotate(bendAngle(bend, g.ah, H))
  if (e < 1) {
    ctx.translate(g.ax, g.ay)
    ctx.scale(e, e)
    ctx.translate(-g.ax, -g.ay)
  }
}

/** Draw a group at growth `e`; `wash: false` leaves its washes out (the engine's dry sprite). */
export function drawGroup(ctx: CanvasRenderingContext2D, g: GroupPart, e: number, bend: number, H: number, A: number, wash = true) {
  ctx.save()
  groupTransform(ctx, g, e, bend, H)
  const f = groupFades(e)
  const fade = f.fade
  const washFade = wash ? f.washFade : 0
  for (const path of g.paths) {
    if (!path.p2d) path.p2d = toPath2D(path.lines, path.closed)
    if (path.fill) {
      ctx.globalAlpha = A * fade
      ctx.fillStyle = INK[path.fill]
      ctx.fill(path.p2d)
    }
    const w = washFade > 0 ? washOf(path) : null
    if (w) {
      ctx.globalAlpha = A * washFade * w.a
      if (path.fill) {
        ctx.translate(w.dx, w.dy)
        ctx.fillStyle = w.c
        ctx.fill(path.p2d)
        ctx.translate(-w.dx, -w.dy)
      } else {
        // A line wash (thread and feather leaves) is a soft body round the
        // ink, barely offset, so it never reads as a shadow.
        ctx.translate(w.dx * 0.3, w.dy * 0.3)
        ctx.strokeStyle = w.c
        ctx.lineWidth = path.w + GARDEN.washes.lineWashPx
        ctx.stroke(path.p2d)
        ctx.translate(-w.dx * 0.3, -w.dy * 0.3)
      }
    }
    if (path.stroke) {
      ctx.globalAlpha = A * fade * (path.alpha ?? 1)
      ctx.strokeStyle = INK[path.stroke]
      ctx.lineWidth = path.w
      ctx.stroke(path.p2d)
    }
  }
  ctx.restore()
}

/** A seed glyph: calendula's curved achene, echinacea's angular one, lavender's dark nutlet, a ribbed ovoid for the rest. */
export function drawSeed(ctx: CanvasRenderingContext2D, species: Species, x: number, y: number, rot: number, A: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.globalAlpha = A
  ctx.lineWidth = 0.9
  ctx.strokeStyle = INK.seed
  ctx.fillStyle = INK.petal
  ctx.beginPath()
  if (species === 'calendula') {
    ctx.arc(0, 1.2, 3.2, Math.PI * 1.1, Math.PI * 1.9)
    ctx.stroke()
    ctx.beginPath()
    for (const t of [1.25, 1.45, 1.65]) {
      const a = Math.PI * t
      ctx.moveTo(Math.cos(a) * 2.6, 1.2 + Math.sin(a) * 2.6)
      ctx.lineTo(Math.cos(a) * 3.8, 1.2 + Math.sin(a) * 3.8)
    }
    ctx.lineWidth = 0.6
    ctx.stroke()
  } else if (species === 'echinacea') {
    ctx.moveTo(-3, 0.4)
    ctx.lineTo(-0.5, -1.6)
    ctx.lineTo(3, -0.6)
    ctx.lineTo(0.8, 1.6)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(-2, 0.2)
    ctx.lineTo(2.2, -0.4)
    ctx.lineWidth = 0.5
    ctx.stroke()
  } else if (species === 'lavender') {
    ctx.ellipse(0, 0, 1.9, 1.3, 0, 0, TAU)
    ctx.fillStyle = INK.seed
    ctx.fill()
  } else {
    ctx.ellipse(0, 0, 2.4, 1.2, 0, 0, TAU)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(-1.6, 0.35)
    ctx.lineTo(1.6, 0.35)
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
  ctx.restore()
}

/* ---------------------------------------------------------------- SVG */

/** One decimal, no leading zero, no trailing zeros: the still's numbers are most of its bytes. */
function num(v: number): string {
  const r = Math.round(v * 10) / 10
  if (r === 0) return '0'
  let s = r.toFixed(1)
  if (s.endsWith('.0')) s = s.slice(0, -2)
  return s.replace(/^(-?)0\./, '$1.')
}

/** Path data in relative moves: a short `l` run per polyline. */
function pathData(lines: Pt[][], closed?: boolean): string {
  let d = ''
  let cx = 0
  let cy = 0
  for (const l of lines) {
    const x0 = Math.round(l[0][0] * 10) / 10
    const y0 = Math.round(l[0][1] * 10) / 10
    d += `M${num(x0)} ${num(y0)}`
    cx = x0
    cy = y0
    let seg = ''
    for (let i = 1; i < l.length; i++) {
      const x = Math.round(l[i][0] * 10) / 10
      const y = Math.round(l[i][1] * 10) / 10
      const dx = num(x - cx)
      const dy = num(y - cy)
      if (dx === '0' && dy === '0') continue
      const pair = `${dx}${dy.startsWith('-') ? '' : ' '}${dy}`
      seg += seg && !pair.startsWith('-') ? ` ${pair}` : pair
      cx = x
      cy = y
    }
    if (seg) d += `l${seg}`
    if (closed) d += 'z'
  }
  return d
}

const opacity = (a: number) => (a >= 0.995 ? '' : ` opacity="${String(Math.round(a * 100) / 100).replace(/^0\./, '.')}"`)

/**
 * The finished plant as SVG elements, in plant coordinates. Each closed
 * path is written once (in `defs` order, as an id) and used for its paper,
 * its wash and its ink, which keeps the still small.
 */
export function svgParts(parts: Part[], ids: { next: number }): { defs: string; body: string } {
  let defs = ''
  let body = ''
  const line = (lines: Pt[][], closed?: boolean) => pathData(lines, closed)
  for (const p of parts) {
    if (p.k === 'line') {
      const n = p.pts.length
      const chunks = p.w1 !== p.w ? 4 : 1
      const per = Math.ceil((n - 1) / chunks)
      const w = washOf(p)
      const pieces: { d: string; w: number }[] = []
      for (let c = 0; c < chunks; c++) {
        const s = c * per
        if (s >= n - 1) break
        pieces.push({ d: line([p.pts.slice(s, Math.min(n - 1, s + per) + 1)]), w: lerp(p.w, p.w1, (s + per / 2) / (n - 1)) })
      }
      if (w) {
        body += `<g transform="translate(${num(w.dx)} ${num(w.dy)})" stroke="${w.c}"${opacity(w.a)}>`
        for (const pc of pieces) body += `<path d="${pc.d}" stroke-width="${num(pc.w + GARDEN.washes.lineWashPx)}"/>`
        body += '</g>'
      }
      body += `<g stroke="${INK[p.role]}"${opacity(p.alpha)}>`
      for (const pc of pieces) body += `<path d="${pc.d}" stroke-width="${num(pc.w)}"/>`
      body += '</g>'
      continue
    }
    for (const path of p.paths) body += svgPath(path, ids, (d) => (defs += d))
  }
  return { defs, body }
}

function svgPath(path: PathSpec, ids: { next: number }, addDef: (s: string) => void): string {
  const d = pathData(path.lines, path.closed)
  const w = washOf(path)
  const uses = (path.fill ? 1 : 0) + (w ? 1 : 0) + (path.stroke ? 1 : 0)
  if (uses <= 1) {
    // Used once: inline.
    if (path.fill) return `<path d="${d}" fill="${INK[path.fill]}" stroke="none"/>`
    if (w) return `<path d="${d}" stroke="${w.c}" stroke-width="${num(path.w + GARDEN.washes.lineWashPx)}"${opacity(w.a)}/>`
    return `<path d="${d}" stroke="${INK[path.stroke!]}" stroke-width="${num(path.w)}"${opacity(path.alpha ?? 1)}/>`
  }
  const id = `g${(ids.next++).toString(36)}`
  addDef(`<path id="${id}" d="${d}"/>`)
  let out = ''
  if (path.fill) out += `<use href="#${id}" fill="${INK[path.fill]}" stroke="none"/>`
  if (w) {
    if (path.fill) out += `<use href="#${id}" fill="${w.c}" stroke="none" x="${num(w.dx)}" y="${num(w.dy)}"${opacity(w.a)}/>`
    else out += `<use href="#${id}" stroke="${w.c}" stroke-width="${num(path.w + GARDEN.washes.lineWashPx)}" x="${num(w.dx * 0.3)}" y="${num(w.dy * 0.3)}"${opacity(w.a)}/>`
  }
  if (path.stroke) out += `<use href="#${id}" stroke="${INK[path.stroke]}" stroke-width="${num(path.w)}"${opacity(path.alpha ?? 1)}/>`
  return out
}
