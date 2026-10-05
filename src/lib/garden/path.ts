import type { Rng } from './rng'

/** A point in plant coordinates: origin at the base on the ground line, y down. */
export type Pt = [number, number]

export const TAU = Math.PI * 2
export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const rad = (d: number) => (d * Math.PI) / 180

export function cumLen(pts: Pt[]): Float32Array {
  const c = new Float32Array(pts.length)
  for (let i = 1; i < pts.length; i++) c[i] = c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return c
}

/** The point at a fraction of a polyline's length, with its direction as an angle from straight up (`a`) and from straight down (`down`). */
export function polyAt(pts: Pt[], f: number) {
  const c = cumLen(pts)
  const target = clamp(f, 0, 1) * c[c.length - 1]
  let i = 1
  while (i < pts.length - 1 && c[i] < target) i++
  const a = pts[i - 1]
  const b = pts[i]
  const t = c[i] === c[i - 1] ? 0 : (target - c[i - 1]) / (c[i] - c[i - 1])
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  return { x: lerp(a[0], b[0], t), y: lerp(a[1], b[1], t), a: Math.atan2(dx, -dy), down: Math.atan2(dx, dy) }
}

/** Rotate by `ang` and move to (ax, ay). */
export function xform(pts: Pt[], ax: number, ay: number, ang: number): Pt[] {
  const c = Math.cos(ang)
  const s = Math.sin(ang)
  return pts.map(([x, y]) => [ax + x * c - y * s, ay + x * s + y * c])
}

/** A polyline moved sideways by d (positive is to the right of travel). */
export function offsetPts(pts: Pt[], d: number): Pt[] {
  const n = pts.length
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(n - 1, i + 1)]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const l = Math.hypot(dx, dy) || 1
    return [p[0] + (-dy / l) * d, p[1] + (dx / l) * d]
  })
}

export interface StemOpts {
  /** Total turn over the length. */
  curv?: number
  /** Random wobble per step. */
  wob?: number
  /** Pull back toward vertical. */
  upright?: number
  step?: number
}

/** A stem from (x0, y0) going up, `ang` from vertical. */
export function stemPts(rng: Rng, x0: number, y0: number, ang: number, len: number, o: StemOpts = {}): Pt[] {
  const n = Math.max(6, Math.round(len / (o.step || 5)))
  const seg = len / n
  const pts: Pt[] = [[x0, y0]]
  let a = ang
  let x = x0
  let y = y0
  for (let i = 1; i <= n; i++) {
    a += (o.curv || 0) / n + (rng() - 0.5) * (o.wob ?? 0.04) - (a * (o.upright || 0)) / n
    x += Math.sin(a) * seg
    y -= Math.cos(a) * seg
    pts.push([x, y])
  }
  return pts
}

export interface RootOpts {
  wob?: number
  /** Pull back toward straight down. */
  gravi?: number
  step?: number
  xMin?: number
  xMax?: number
  yMax?: number
}

/** A root going down, `ang` from straight down, kept inside the soil's limits. */
export function rootPts(rng: Rng, x0: number, y0: number, ang: number, len: number, o: RootOpts = {}): Pt[] {
  const n = Math.max(5, Math.round(len / (o.step || 4)))
  const seg = len / n
  const pts: Pt[] = [[x0, y0]]
  let a = ang
  let x = x0
  let y = y0
  for (let i = 1; i <= n; i++) {
    a += (rng() - 0.5) * (o.wob ?? 0.25) - (a * (o.gravi ?? 0.5)) / n
    x += Math.sin(a) * seg
    y += Math.cos(a) * seg
    if (o.xMin !== undefined && o.xMax !== undefined) x = clamp(x, o.xMin, o.xMax)
    if (o.yMax !== undefined) y = Math.min(y, o.yMax)
    pts.push([x, y])
  }
  return pts
}

/** How far a point at height h turns when a plant bends by `bend` (radians at the tip). */
export function bendAngle(bend: number, h: number, H: number): number {
  return h > 0 ? bend * Math.pow(h / H, 1.4) : 0
}

/** A point bent about the plant's base. */
export function bendPt(p: Pt, bend: number, H: number): Pt {
  if (!bend) return p
  const h = -p[1]
  if (h <= 0) return p
  const t = bendAngle(bend, h, H)
  const c = Math.cos(t)
  const s = Math.sin(t)
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]
}
