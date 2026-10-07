import { describe, expect, it } from 'vitest'
import { BREAKPOINTS } from './config'
import { cellFor, packShelves } from './atlas'
import { initialComposition, layoutFor, modelAt } from './layout'
import { groupFades } from './pen'
import { modelBounds } from './species'

const overlap = (a: { x: number; y: number; w: number; h: number }, b: typeof a) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

describe('a sprite cell', () => {
  it('starts on a whole CSS pixel and covers the bounds with their padding, in device pixels', () => {
    for (const dpr of [1, 1.5, 2]) {
      const b = { minX: -12.3, minY: -80.6, maxX: 9.2, maxY: -40.1 }
      const c = cellFor(b, dpr)
      expect(Number.isInteger(c.x) && Number.isInteger(c.y)).toBe(true)
      expect(c.x).toBeLessThanOrEqual(b.minX - 3)
      expect(c.y).toBeLessThanOrEqual(b.minY - 3)
      expect(c.x + c.sw / dpr).toBeGreaterThanOrEqual(b.maxX + 3)
      expect(c.y + c.sh / dpr).toBeGreaterThanOrEqual(b.maxY + 3)
    }
  })

  it('is never empty', () => {
    const c = cellFor({ minX: 0, minY: 0, maxX: 0, maxY: 0 }, 1, 0)
    expect(c.sw).toBeGreaterThanOrEqual(1)
    expect(c.sh).toBeGreaterThanOrEqual(1)
  })
})

describe('the atlas packing', () => {
  it('keeps every box inside the sheet, apart from the others by the gap, in input order', () => {
    const boxes = Array.from({ length: 60 }, (_, i) => ({ sw: 5 + ((i * 37) % 70), sh: 4 + ((i * 53) % 45) }))
    const { at, w, h } = packShelves(boxes, 1)
    expect(at).toHaveLength(boxes.length)
    const rects = boxes.map((b, i) => ({ x: at[i][0], y: at[i][1], w: b.sw + 1, h: b.sh + 1 }))
    for (const [i, r] of rects.entries()) {
      expect(r.x).toBeGreaterThanOrEqual(0)
      expect(r.y).toBeGreaterThanOrEqual(0)
      expect(r.x + boxes[i].sw).toBeLessThanOrEqual(w)
      expect(r.y + boxes[i].sh).toBeLessThanOrEqual(h)
      for (const s of rects.slice(i + 1)) expect(overlap(r, s)).toBe(false)
    }
  })

  it('fits a box wider than the rest', () => {
    const { at, w } = packShelves([{ sw: 400, sh: 10 }, { sw: 4, sh: 4 }])
    expect(w).toBeGreaterThanOrEqual(400)
    expect(at[0][0]).toBe(0)
  })

  it('packs every opening plant into a small sheet, with each part inside its cell', () => {
    for (const bp of BREAKPOINTS) {
      const W = bp === 'lg' ? 1280 : bp === 'md' ? 700 : 358
      const L = layoutFor(W, bp === 'lg' ? W / 3 : (W * 3) / 4, bp)
      for (const s of initialComposition(bp, W)) {
        const m = modelAt(s.species, s.seed, s.hFrac, s.x, L).model
        const cells = m.topGroups.map((g) => cellFor(modelBounds([g], 0, m.H), 2))
        const { w, h } = packShelves([...cells, ...cells])
        // A sheet at dpr 2 stays well inside any browser's canvas limits.
        expect(Math.max(w, h)).toBeLessThan(2048)
        for (const [i, g] of m.topGroups.entries()) {
          const b = modelBounds([g], 0, m.H)
          const c = cells[i]
          expect(b.minX).toBeGreaterThanOrEqual(c.x)
          expect(b.maxY).toBeLessThanOrEqual(c.y + c.sh / 2)
        }
      }
    }
  })
})

describe('a group opening', () => {
  it('fades its paper and ink in first, then its wash, and ends whole', () => {
    expect(groupFades(0)).toEqual({ fade: 0, washFade: 0 })
    expect(groupFades(0.3).washFade).toBe(0)
    expect(groupFades(0.4).fade).toBe(1)
    expect(groupFades(1)).toEqual({ fade: 1, washFade: 1 })
    let last = -1
    for (let e = 0; e <= 1; e += 0.05) {
      const { washFade } = groupFades(e)
      expect(washFade).toBeGreaterThanOrEqual(last)
      last = washFade
    }
  })
})
