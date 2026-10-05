/** A seeded generator (mulberry32): the same seed always draws the same garden. */
export type Rng = () => number

export function rng32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A uniform number in [a, b). */
export const rr = (rng: Rng, a: number, b: number) => a + (b - a) * rng()

/** A whole number from a to b inclusive. */
export const ri = (rng: Rng, a: number, b: number) => Math.floor(rr(rng, a, b + 1))
