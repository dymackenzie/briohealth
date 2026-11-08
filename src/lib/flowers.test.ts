import { describe, expect, it } from 'vitest'

import { GARDEN } from '@/lib/garden/config'
import { rng32 } from '@/lib/garden/rng'
import { flowerSvg, PLANT_CHANCE, plants } from './flowers'

describe('selection flowers', () => {
  it('plants the same letters every time, about one in five', () => {
    const keys = Array.from({ length: 2000 }, (_, i) => `${i % 37}:${i}`)
    expect(keys.map(plants)).toEqual(keys.map(plants))
    const share = keys.filter(plants).length / keys.length
    expect(share).toBeGreaterThan(PLANT_CHANCE - 0.05)
    expect(share).toBeLessThan(PLANT_CHANCE + 0.05)
  })

  it('spreads along a line instead of bunching up', () => {
    for (const id of [0, 1, 7, 42]) {
      const row = Array.from({ length: 60 }, (_, i) => plants(`${id}:${i}`))
      expect(row.filter(Boolean).length).toBeGreaterThan(4)
      expect(row.filter(Boolean).length).toBeLessThan(22)
      expect(row.slice(30).some(Boolean)).toBe(true)
    }
  })

  it('draws the same flower from the same seed, and different ones from others', () => {
    expect(flowerSvg(18, rng32(7))).toBe(flowerSvg(18, rng32(7)))
    expect(flowerSvg(18, rng32(7))).not.toBe(flowerSvg(18, rng32(8)))
  })

  it('uses only the garden washes, never cream, and hides itself from screen readers', () => {
    const { creamWhite, ...rest } = GARDEN.botanical
    const allowed = new Set(Object.values(rest))
    for (let seed = 1; seed <= 50; seed++) {
      const svg = flowerSvg(18, rng32(seed))
      const colours = [...svg.matchAll(/(?:fill|stroke)="(#[0-9a-f]{6})"/g)].map((m) => m[1])
      expect(colours.length).toBeGreaterThan(0)
      for (const c of colours) expect(allowed.has(c)).toBe(true)
      expect(svg).not.toContain(creamWhite)
      expect(svg).toContain('aria-hidden="true"')
    }
  })

  it('is five petals and a centre, petals between 0.2 and 0.28 times the text size', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const svg = flowerSvg(20, rng32(seed))
      expect(svg).not.toContain('stem')
      expect(svg).not.toContain('leaf')
      expect(svg.match(/class="petal"/g)).toHaveLength(5)
      for (const [, ry] of svg.matchAll(/ry="([\d.]+)"/g)) {
        expect(Number(ry) * 2).toBeGreaterThanOrEqual(4 - 0.1)
        expect(Number(ry) * 2).toBeLessThanOrEqual(5.6 + 0.1)
      }
    }
  })
})
