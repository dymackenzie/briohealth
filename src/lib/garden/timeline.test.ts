import { describe, expect, it } from 'vitest'
import { BREAKPOINTS, GARDEN } from './config'
import { initialComposition } from './layout'
import { seedAlpha, startAge } from './timeline'

const g = GARDEN.growth

describe('the opening', () => {
  it('starts its stagger with a plant that comes up at once', () => {
    for (const bp of BREAKPOINTS) {
      for (const W of [320, 768, 1440]) {
        const delays = initialComposition(bp, W).map((s) => s.delay)
        expect(Math.min(...delays)).toBe(0)
        for (const d of delays) expect(d).toBeLessThanOrEqual(g.staggerMs[1] - g.staggerMs[0])
      }
    }
  })

  it('has its stems rising from the first frame: no root lead before them', () => {
    // A stem starts at rootLeadMs in every model, so an opening plant's age reaches it with its delay.
    expect(startAge('initial')).toBe(g.rootLeadMs)
    expect(startAge('initial', 400)).toBe(g.rootLeadMs - 400)
  })

  it('never shows a seed', () => {
    for (const age of [-1000, 0, g.rootLeadMs, g.rootLeadMs + 100]) expect(seedAlpha('initial', age)).toBe(0)
  })
})

describe('a sown plant', () => {
  it('starts from its seed, roots first', () => {
    expect(startAge('visitor')).toBe(0)
    expect(startAge('self')).toBe(0)
  })

  it('keeps its seed on the ground until the stem is up, then fades it', () => {
    expect(seedAlpha('visitor', 0)).toBe(1)
    expect(seedAlpha('self', g.rootLeadMs)).toBe(1)
    const end = g.rootLeadMs + g.stemMs * 0.127
    expect(seedAlpha('visitor', end + g.seedFadeMs / 2)).toBeCloseTo(0.5)
    expect(seedAlpha('visitor', end + g.seedFadeMs)).toBe(0)
    expect(seedAlpha('visitor', end + g.seedFadeMs * 3)).toBe(0)
  })
})
