import { describe, expect, it } from 'vitest'
import { GARDEN, SPECIES, type Breakpoint } from './config'
import { breakpointOf, initialComposition, layoutFor, modelAt, plantEnv, plantHeight } from './layout'
import { buildModel, modelBounds, type WashTag } from './species'

const box = (viewport: number) => {
  const bp = breakpointOf(viewport)
  const gutter = Math.min(Math.max(16, viewport * 0.04), 40)
  const W = Math.min(1280, viewport) - 2 * gutter
  return layoutFor(W, W / GARDEN.aspect[bp], bp)
}

describe('the herb models', () => {
  it('are the same plant for the same seed', () => {
    const L = box(1440)
    for (const s of SPECIES) {
      const a = buildModel(s, 42, plantHeight(0.8, L), plantEnv(200, L))
      const b = buildModel(s, 42, plantHeight(0.8, L), plantEnv(200, L))
      expect(JSON.stringify(a.top)).toBe(JSON.stringify(b.top))
      expect(JSON.stringify(a.roots)).toBe(JSON.stringify(b.roots))
    }
  })

  it('differ by seed', () => {
    const L = box(1440)
    const a = buildModel('echinacea', 1, 200, plantEnv(200, L))
    const b = buildModel('echinacea', 2, 200, plantEnv(200, L))
    expect(JSON.stringify(a.top)).not.toBe(JSON.stringify(b.top))
  })

  it('each flower, finish, and root, with every part timed inside the plant’s growth', () => {
    const L = box(1440)
    for (const s of SPECIES) {
      const m = buildModel(s, 7, plantHeight(0.85, L), plantEnv(300, L))
      expect(m.blooms.length).toBeGreaterThan(0)
      expect(m.roots.length).toBeGreaterThan(0)
      for (const p of [...m.top, ...m.roots]) {
        expect(p.t1).toBeGreaterThan(p.t0)
        expect(p.tDone).toBeLessThanOrEqual(m.tEnd)
      }
    }
  })

  it('tags every wash with its species and an offset', () => {
    const L = box(1440)
    for (const s of SPECIES) {
      const m = buildModel(s, 3, 180, plantEnv(300, L))
      const tagged: WashTag[] = m.top.flatMap((p): WashTag[] => (p.k === 'line' ? [p] : p.paths)).filter((x) => x.wash)
      expect(tagged.length).toBeGreaterThan(0)
      for (const t of tagged) {
        expect(t.sp).toBe(s)
        expect(t.wo).toHaveLength(4)
      }
    }
  })
})

describe('the opening composition', () => {
  const widths = [320, 360, 390, 768, 834, 1024, 1180, 1440]

  it.each(widths)('fits the sky and the box at %ipx', (viewport) => {
    const L = box(viewport)
    for (const s of initialComposition(L.bp, L.W)) {
      const { x, model } = modelAt(s.species, s.seed, s.hFrac, s.x, L)
      const top = modelBounds(model.top, 0, model.H)
      const roots = modelBounds(model.roots, 0, model.H)
      expect(-top.minY).toBeLessThanOrEqual(L.skyH - GARDEN.maxHeightMarginPx + 0.5)
      expect(x + top.minX).toBeGreaterThanOrEqual(0)
      expect(x + top.maxX).toBeLessThanOrEqual(L.W)
      expect(roots.maxY).toBeLessThanOrEqual(L.soilH)
      expect(x + roots.minX).toBeGreaterThanOrEqual(0)
      expect(x + roots.maxX).toBeLessThanOrEqual(L.W)
    }
  })

  it('sows every species on the desktop bed, and as many plants as the breakpoint asks for', () => {
    for (const bp of ['sm', 'md', 'lg'] as Breakpoint[]) {
      const comp = initialComposition(bp, 1000)
      expect(comp).toHaveLength(GARDEN.initialPlants[bp])
    }
    expect(new Set(initialComposition('lg', 1200).map((s) => s.species))).toEqual(new Set(SPECIES))
  })
})
