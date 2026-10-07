import { describe, expect, it } from 'vitest'
import { GARDEN } from './config'
import { breakpointOf, decidePlanting, layoutFor, pickSpecies, type Occupant } from './layout'
import { rng32 } from './rng'

const lg = layoutFor(1200, 400, 'lg')
const sm = layoutFor(358, 268.5, 'sm')
const plant = (id: number, x: number, origin: Occupant['origin'] = 'initial'): Occupant => ({ id, x, origin })

describe('breakpointOf', () => {
  it('follows Tailwind’s md and lg', () => {
    expect(breakpointOf(390)).toBe('sm')
    expect(breakpointOf(768)).toBe('md')
    expect(breakpointOf(1023)).toBe('md')
    expect(breakpointOf(1024)).toBe('lg')
  })
})

describe('layoutFor', () => {
  it('puts the ground line on the floor’s top edge', () => {
    expect(lg.groundY).toBe(Math.round(400 * GARDEN.groundAt))
    expect(lg.skyH + lg.soilH).toBe(400)
  })
})

describe('decidePlanting', () => {
  it('plants in open ground, kept off the edges', () => {
    expect(decidePlanting(600, [plant(1, 100)], [], lg)).toEqual({ kind: 'plant', x: 600, evict: null })
    expect(decidePlanting(2, [], [], lg)).toEqual({ kind: 'plant', x: GARDEN.insetPx, evict: null })
  })

  it('rustles a plant that is too close, on a wide bed', () => {
    expect(decidePlanting(120, [plant(1, 100), plant(2, 400)], [], lg)).toEqual({ kind: 'rustle', id: 1 })
  })

  it('replaces the nearest plant on a phone, in its place, so nothing grows into a neighbour', () => {
    expect(decidePlanting(150, [plant(1, 100), plant(2, 180)], [], sm)).toEqual({ kind: 'replace', id: 2, x: 180 })
  })

  it('ignores a tap beside a seed that is still falling', () => {
    expect(decidePlanting(610, [], [600], lg)).toEqual({ kind: 'none' })
  })

  it('at the cap, makes room with the oldest visitor’s plant first, then a self-sown one, then an original', () => {
    // Oldest first, all well away from the tap at 1100.
    const bed = (origins: Occupant['origin'][]) => origins.map((o, i) => plant(i + 1, 30 + i * 2, o))
    const cap = GARDEN.maxPlants.lg
    const initial = Array.from({ length: cap - 2 }, () => 'initial' as const)
    expect(decidePlanting(1100, bed([...initial, 'self', 'visitor']), [], lg)).toMatchObject({ kind: 'plant', evict: cap })
    expect(decidePlanting(1100, bed([...initial, 'self', 'self']), [], lg)).toMatchObject({ kind: 'plant', evict: cap - 1 })
    expect(decidePlanting(1100, bed([...initial, 'initial', 'initial']), [], lg)).toMatchObject({ kind: 'plant', evict: 1 })
    expect(decidePlanting(1100, bed(initial), [], lg)).toMatchObject({ kind: 'plant', evict: null })
  })
})

describe('pickSpecies', () => {
  it('avoids the neighbours’ species while there is a choice', () => {
    const rng = rng32(9)
    for (let i = 0; i < 50; i++) expect(['chamomile', 'echinacea']).not.toContain(pickSpecies(rng, ['chamomile', 'echinacea']))
  })
})
