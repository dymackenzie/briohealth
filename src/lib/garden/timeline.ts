import { GARDEN } from './config'
import type { Occupant } from './layout'

type Origin = Occupant['origin']

/**
 * A growing plant's age when it is planted. A sown plant starts at 0: its
 * seed has just landed, the roots lead, then the stem comes up. The opening
 * plants have no seed and skip the root lead, so each one's stem is rising
 * from the first frame it is drawn in, `delay` after the garden starts.
 */
export function startAge(origin: Origin, delay = 0): number {
  return origin === 'initial' ? GARDEN.growth.rootLeadMs - delay : 0
}

/**
 * How strongly the seed under a growing plant shows at `age`. A sown seed
 * lies on the ground until the stem is up, then fades; the opening plants
 * never show one, so the page never opens on seeds waiting to grow.
 */
export function seedAlpha(origin: Origin, age: number): number {
  if (origin === 'initial') return 0
  const g = GARDEN.growth
  const end = g.rootLeadMs + g.stemMs * 0.127
  if (age < end) return 1
  return Math.max(0, 1 - (age - end) / g.seedFadeMs)
}
