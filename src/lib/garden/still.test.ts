import { gzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import { BREAKPOINTS, GARDEN } from './config'
import { stillSvg } from './still'

const all = BREAKPOINTS.map((bp) => stillSvg(bp))

describe('the SVG still', () => {
  it('is the same garden every time', () => {
    for (const bp of BREAKPOINTS) expect(stillSvg(bp)).toBe(stillSvg(bp))
  })

  it('stays under its byte budget, gzipped, per breakpoint', () => {
    for (const svg of all) expect(gzipSync(svg).length).toBeLessThanOrEqual(GARDEN.stillMaxGzipBytes)
  })

  it('uses only the site tokens and the garden colours, and no gradient, filter, shadow or image', () => {
    const allowed = new Set([...Object.values(GARDEN.palette), ...Object.values(GARDEN.botanical)])
    for (const svg of all) {
      for (const c of svg.match(/#[0-9a-f]{6}\b/gi) ?? []) expect(allowed).toContain(c.toLowerCase())
      expect(svg).not.toMatch(/Gradient|<filter|drop-shadow|<image/i)
    }
  })

  it('is a standalone document sized to its box', () => {
    expect(all[0]).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 358 268\.5"/)
    expect(all[2]).toMatch(/viewBox="0 0 1200 400"/)
  })

  it('keys every used id to a definition', () => {
    for (const svg of all) {
      const defined = new Set([...svg.matchAll(/id="([^"]+)"/g)].map((x) => x[1]))
      for (const [, id] of svg.matchAll(/href="#([^"]+)"/g)) expect(defined).toContain(id)
    }
  })
})
