import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { GARDEN, gardenLabel, HERBS, SPECIES, validateGardenConfig, type GardenConfig } from './config'

const tokens = readFileSync(new URL('../../styles/tokens.css', import.meta.url), 'utf8')
const token = (name: string) => tokens.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1].toLowerCase()

describe('GARDEN', () => {
  it('is a sound config', () => {
    expect(validateGardenConfig(GARDEN)).toEqual([])
  })

  it('mirrors the site tokens exactly', () => {
    const names: Record<keyof GardenConfig['palette'], string> = {
      paper: 'paper',
      grey: 'grey',
      ink: 'ink',
      inkSoft: 'ink-soft',
      teal: 'teal',
      tealDeep: 'teal-deep',
      onTeal: 'on-teal',
      tide: 'tide',
      clay: 'clay',
    }
    for (const [key, css] of Object.entries(names)) expect(GARDEN.palette[key as keyof typeof names]).toBe(token(css))
  })

  it('draws ink in site tokens only and keeps the nine garden colours to the washes', () => {
    expect(Object.values(GARDEN.colours).every((t) => t in GARDEN.palette)).toBe(true)
    expect(Object.keys(GARDEN.botanical)).toHaveLength(9)
    for (const hex of Object.values(GARDEN.botanical)) expect(Object.values(GARDEN.palette)).not.toContain(hex)
  })

  it('gives yarrow a faint pink and chamomile white rays', () => {
    expect(GARDEN.washes.species.yarrow.petal).toEqual(['roseClay', 0.35])
    expect(GARDEN.washes.species.chamomile.petal?.[0]).toBe('creamWhite')
  })

  it('keeps a tap on a phone from growing a plant into its neighbour', () => {
    expect(GARDEN.crowded.sm).toBe('replace')
    expect(GARDEN.minSpacingPx.sm).toBeGreaterThan(GARDEN.minSpacingPx.lg)
  })
})

describe('validateGardenConfig', () => {
  const broken = (patch: (c: GardenConfig) => void) => {
    const c = structuredClone(GARDEN)
    patch(c)
    return validateGardenConfig(c)
  }

  it('catches a colour that is not a hex, or a wash naming no garden colour', () => {
    expect(broken((c) => (c.botanical.sage = 'green'))).toContain('botanical.sage is not a lowercase hex colour')
    expect(broken((c) => (c.washes.base.leaf = ['olive' as never, 0.5])).join()).toMatch(/names no botanical colour/)
    expect(broken((c) => (c.washes.base.leaf = ['sage', 2])).join()).toMatch(/alpha is out of range/)
  })

  it('catches caps, ranges and timings that cannot work', () => {
    expect(broken((c) => (c.maxPlants.sm = 2))).toContain('maxPlants.sm is below initialPlants')
    expect(broken((c) => (c.heights.yarrow = [0.9, 0.5]))).toContain('heights.yarrow is not ordered')
    expect(broken((c) => (c.growth.stemMs = 0))).toContain('growth.stemMs is not positive')
    expect(broken((c) => (c.idle.settleAfterMs = 1000))).toContain('idle.settleAfterMs is not after idle.afterMs')
    expect(broken((c) => (c.sliceMs = 80))).toContain('sliceMs must stay under a long task')
    expect(broken((c) => SPECIES.forEach((s) => (c.species[s] = 0)))).toContain('no species has a weight')
  })
})

describe('the garden’s accessible name', () => {
  it('names all five herbs, common and Latin, and makes no claims', () => {
    expect(gardenLabel()).toBe(
      'An illustrated herb garden: chamomile, Matricaria chamomilla; echinacea, Echinacea purpurea; calendula, Calendula officinalis; lavender, Lavandula angustifolia; yarrow, Achillea millefolium.',
    )
    expect(HERBS.map((h) => h.species)).toEqual([...SPECIES])
  })

  it('has no em or en dashes (UI chrome)', () => {
    expect(gardenLabel()).not.toMatch(/[–—]/)
  })
})
