import { describe, expect, it } from 'vitest'
import { GARDEN, SPECIES } from './config'
import { COVER_H, COVER_MARGIN, COVER_VERSION, COVER_W, coverFor, coverLayout, coverPath, coverSvg } from './cover'

const SPREAD = [1, 2, 3, 7, 42, 99, 100, 512, 1234, 4096, 20000, 65535, 123456, 999999, 9999999]

describe('the blog cover', () => {
  it('is the same drawing for the same id', () => {
    for (const id of [1, 1234, 9999999]) {
      expect(coverFor(id)).toEqual(coverFor(id))
      expect(coverSvg(id)).toBe(coverSvg(id))
    }
  })

  it('draws all five herbs across ids 1 to 200, and neighbours usually differ', () => {
    const seen = new Set<string>()
    let same = 0
    for (let id = 1; id <= 200; id++) {
      seen.add(coverFor(id).species)
      if (coverFor(id).species === coverFor(id + 1).species) same++
    }
    expect([...seen].sort()).toEqual([...SPECIES].sort())
    expect(same).toBeLessThan(80)
  })

  it('keeps the plant inside the box with a margin', () => {
    for (const id of SPREAD) {
      const { bounds: b, x, y, scale } = coverLayout(id)
      expect(x + b.minX * scale).toBeGreaterThanOrEqual(COVER_MARGIN - 0.5)
      expect(x + b.maxX * scale).toBeLessThanOrEqual(COVER_W - COVER_MARGIN + 0.5)
      expect(y + b.minY * scale).toBeGreaterThanOrEqual(COVER_MARGIN - 0.5)
      expect(y + b.maxY * scale).toBeLessThanOrEqual(COVER_H - COVER_MARGIN + 0.5)
      // And still fills most of the height.
      expect(-b.minY * scale).toBeGreaterThan(COVER_H * 0.6)
    }
  })

  it('is a standalone 480x320 SVG on flat sand', () => {
    const svg = coverSvg(1234)
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 480 320"/)
    expect(svg).toContain(`<rect width="480" height="320" fill="${GARDEN.palette.grey}"/>`)
  })

  it('uses only the garden tokens and botanical colours, and no gradient, filter or image', () => {
    const allowed = new Set([...Object.values(GARDEN.palette), ...Object.values(GARDEN.botanical)])
    for (const id of SPREAD) {
      const svg = coverSvg(id)
      for (const c of svg.match(/#[0-9a-f]{6}\b/gi) ?? []) expect(allowed).toContain(c.toLowerCase())
      expect(svg).not.toMatch(/Gradient|<filter|drop-shadow|<image|<text/i)
    }
  })

  it('keys every used id to a definition', () => {
    for (const id of SPREAD) {
      const svg = coverSvg(id)
      const defined = new Set([...svg.matchAll(/id="([^"]+)"/g)].map((x) => x[1]))
      for (const [, ref] of svg.matchAll(/href="#([^"]+)"/g)) expect(defined).toContain(ref)
    }
  })

  it('has a versioned path', () => {
    expect(coverPath(1234)).toBe(`/blog/cover/1234.webp?v=${COVER_VERSION}`)
  })
})
