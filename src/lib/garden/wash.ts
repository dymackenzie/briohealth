import { GARDEN, SPECIES, type InkRole, type Species, type WashKey } from './config'
import { clamp } from './path'
import type { WashTag } from './species'

/** The ink colours by role, as hex. */
export const INK: Record<InkRole, string> = Object.fromEntries(
  Object.entries(GARDEN.colours).map(([role, token]) => [role, GARDEN.palette[token]]),
) as Record<InkRole, string>

const LUT: Record<Species, Partial<Record<WashKey, { c: string; a: number }>>> = Object.fromEntries(
  SPECIES.map((sp) => {
    const own = GARDEN.washes.species[sp]
    const out: Partial<Record<WashKey, { c: string; a: number }>> = {}
    for (const k of new Set([...Object.keys(GARDEN.washes.base), ...Object.keys(own)]) as Set<WashKey>) {
      const e = own[k] ?? GARDEN.washes.base[k]
      if (e) out[k] = { c: GARDEN.botanical[e[0]], a: e[1] }
    }
    return [sp, out]
  }),
) as Record<Species, Partial<Record<WashKey, { c: string; a: number }>>>

export interface Wash {
  c: string
  a: number
  dx: number
  dy: number
}

/** The wash under a tagged path or line: its colour, strength and offset, or null. */
export function washOf(o: WashTag): Wash | null {
  if (!o.wash || !o.sp || !o.wo) return null
  const w = LUT[o.sp][o.wash]
  if (!w) return null
  const W = GARDEN.washes
  return {
    c: w.c,
    a: clamp(w.a + (o.wj ?? 0) * W.alphaJitter, 0, 1),
    dx: o.wo[0] * W.offsetPx + o.wo[2] * W.jitterPx,
    dy: o.wo[1] * W.offsetPx + o.wo[3] * W.jitterPx,
  }
}
