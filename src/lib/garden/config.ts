/**
 * The homepage hero's herb garden: every tunable in one place. Pure data,
 * read by the models (species.ts), the layout, the SVG still and the canvas
 * engine. Colours are names: `palette` mirrors the site tokens
 * (tokens.css, pinned by a test) and `botanical` is the garden's own small
 * set, used for nothing else on the site.
 */

export type Species = 'chamomile' | 'echinacea' | 'calendula' | 'lavender' | 'yarrow'
export const SPECIES: readonly Species[] = ['chamomile', 'echinacea', 'calendula', 'lavender', 'yarrow']

export type Breakpoint = 'sm' | 'md' | 'lg'
export const BREAKPOINTS: readonly Breakpoint[] = ['sm', 'md', 'lg']

/** The ink roles: line work, hatching, the paper under every leaf and petal, roots, seeds. */
export type InkRole = 'line' | 'hatch' | 'petal' | 'root' | 'seed'
/** What a wash colours. */
export type WashKey = 'stem' | 'leaf' | 'petal' | 'disc' | 'calyx'

export type Token = 'paper' | 'grey' | 'ink' | 'inkSoft' | 'teal' | 'tealDeep' | 'onTeal' | 'tide' | 'clay'
export type BotanicalColour =
  | 'sage'
  | 'sageGrey'
  | 'saffron'
  | 'marigold'
  | 'ochre'
  | 'roseClay'
  | 'russet'
  | 'dustyLavender'
  | 'creamWhite'
/** [colour, alpha] */
export type WashEntry = readonly [BotanicalColour, number]

export interface GardenConfig {
  seed: number
  palette: Record<Token, string>
  colours: Record<InkRole, Token>
  botanical: Record<BotanicalColour, string>
  washes: {
    /** Each wash sits this far off its line, in one direction per plant. */
    offsetPx: number
    /** Plus up to this much of its own, per part. */
    jitterPx: number
    /** Per-plant variation in a wash's strength, plus or minus. */
    alphaJitter: number
    /** How much wider than its line a stem's (or a thread leaf's) wash is. */
    lineWashPx: number
    base: Partial<Record<WashKey, WashEntry>>
    species: Record<Species, Partial<Record<WashKey, WashEntry>>>
  }
  dprCap: { fine: number; coarse: number }
  fps: { fine: number; coarse: number }
  /** Viewport widths, matching Tailwind's md and lg. */
  breakpoints: { md: number; lg: number }
  /** Box aspect (width / height) per breakpoint: 4:3 below lg, 3:1 from lg. */
  aspect: Record<Breakpoint, number>
  /** The ground line, as a share of the box height: the teal floor's top edge. */
  groundAt: number
  insetPx: number
  maxHeightMarginPx: number
  initialPlants: Record<Breakpoint, number>
  maxPlants: Record<Breakpoint, number>
  minSpacingPx: Record<Breakpoint, number>
  /** A tap too close to a plant rustles it, or (where the bed is narrow) replaces it. */
  crowded: Record<Breakpoint, 'rustle' | 'replace'>
  species: Record<Species, number>
  /** Plant height as a share of the sky (the box above the ground line). */
  heights: Record<Species, readonly [number, number]>
  growth: {
    rootLeadMs: number
    stemMs: number
    rootRate: number
    leafMs: number
    bloomMs: number
    seedDropMs: number
    seedFadeMs: number
    witherMs: number
    staggerMs: readonly [number, number]
    maxConcurrent: number
  }
  pointer: {
    influenceRadiusPx: number
    /** Above 1 holds full influence further out from the plant. */
    falloff: number
    maxLeanDeg: number
    leanEaseMs: number
    growthBoost: number
    steer: number
    maxSteerDeg: number
    steerEaseMs: number
  }
  idle: {
    afterMs: number
    swayDeg: number
    swayPeriodMs: readonly [number, number]
    gustEveryMs: number
    gustDeg: number
    gustMs: number
    selfSeedEveryMs: number
    selfSeedMax: number
    settleAfterMs: number
    settleMs: number
    rustleDeg: number
  }
  lines: {
    stemPx: number
    stoutPx: number
    leafPx: number
    petalPx: number
    hatchPx: number
    hatchGapPx: number
    hatchAlpha: number
  }
  /** Work per idle slice when building models and sprites off the main frame, in ms. */
  sliceMs: number
  /** The still's ceiling, gzipped, per breakpoint file (it is only fetched without JavaScript or if the engine fails). */
  stillMaxGzipBytes: number
}

export const GARDEN: GardenConfig = {
  seed: 20261005,
  palette: {
    paper: '#f6f1e7',
    grey: '#ece3d3',
    ink: '#1c1c1e',
    inkSoft: '#4d4740',
    teal: '#00919d',
    tealDeep: '#007a85',
    onTeal: '#031011',
    tide: '#0d4a50',
    clay: '#e07a55',
  },
  colours: { line: 'ink', hatch: 'inkSoft', petal: 'paper', root: 'paper', seed: 'ink' },
  // Garden only. A hand-tinted plate: muted, desaturated washes that sit with
  // the paper, the teal and the clay. Nothing else on the site uses these.
  botanical: {
    sage: '#8e9f7e', // leaves and stems: a dusty grey-green
    sageGrey: '#a3ada2', // lavender foliage and stems: greyer and cooler
    saffron: '#d9ae4e', // chamomile disc: muted yellow
    marigold: '#dc9b4c', // calendula rays: muted orange-yellow, yellower than clay
    ochre: '#b9873f', // calendula disc
    roseClay: '#c98b80', // echinacea rays, and a faint pink on yarrow
    russet: '#9e6640', // echinacea cone
    dustyLavender: '#9b8eb5', // lavender calyces and corollas
    creamWhite: '#fdfbf4', // chamomile rays: lighter than the paper, so they read as white
  },
  washes: {
    offsetPx: 0.45,
    jitterPx: 0.75,
    alphaJitter: 0.08,
    lineWashPx: 1.6,
    base: { stem: ['sage', 0.5], leaf: ['sage', 0.6] },
    species: {
      chamomile: { petal: ['creamWhite', 0.9], disc: ['saffron', 0.85] },
      echinacea: { petal: ['roseClay', 0.75], disc: ['russet', 0.7] },
      calendula: { petal: ['marigold', 0.78], disc: ['ochre', 0.85] },
      lavender: { stem: ['sageGrey', 0.5], leaf: ['sageGrey', 0.6], calyx: ['dustyLavender', 0.6], petal: ['dustyLavender', 0.85] },
      yarrow: { petal: ['roseClay', 0.35] },
    },
  },
  dprCap: { fine: 2, coarse: 1.5 },
  fps: { fine: 60, coarse: 30 },
  breakpoints: { md: 768, lg: 1024 },
  aspect: { sm: 4 / 3, md: 4 / 3, lg: 3 },
  groundAt: 0.66,
  insetPx: 24,
  maxHeightMarginPx: 16,
  initialPlants: { lg: 7, md: 5, sm: 4 },
  maxPlants: { lg: 14, md: 10, sm: 6 },
  minSpacingPx: { lg: 44, md: 36, sm: 64 },
  crowded: { lg: 'rustle', md: 'rustle', sm: 'replace' },
  species: { chamomile: 1, echinacea: 1, calendula: 1, lavender: 1, yarrow: 1 },
  heights: {
    chamomile: [0.56, 0.68],
    echinacea: [0.86, 0.96],
    calendula: [0.5, 0.6],
    lavender: [0.7, 0.82],
    yarrow: [0.78, 0.9],
  },
  growth: {
    rootLeadMs: 300,
    stemMs: 3700,
    rootRate: 0.8,
    leafMs: 870,
    bloomMs: 1400,
    seedDropMs: 500,
    seedFadeMs: 300,
    witherMs: 2000,
    staggerMs: [0, 1500],
    maxConcurrent: 3,
  },
  pointer: {
    influenceRadiusPx: 240,
    falloff: 1.7,
    maxLeanDeg: 5,
    leanEaseMs: 900,
    growthBoost: 1.6,
    steer: 0.6,
    maxSteerDeg: 14,
    steerEaseMs: 850,
  },
  idle: {
    afterMs: 6000,
    swayDeg: 1.1,
    swayPeriodMs: [7000, 11000],
    gustEveryMs: 20000,
    gustDeg: 1.6,
    gustMs: 6000,
    selfSeedEveryMs: 25000,
    selfSeedMax: 2,
    settleAfterMs: 90000,
    settleMs: 4000,
    rustleDeg: 2.2,
  },
  lines: { stemPx: 1.2, stoutPx: 1.5, leafPx: 0.85, petalPx: 0.8, hatchPx: 0.55, hatchGapPx: 2.4, hatchAlpha: 0.8 },
  sliceMs: 8,
  stillMaxGzipBytes: 130_000,
}

/** The five herbs, for the garden's accessible name. Names only: no claims. */
export const HERBS: readonly { species: Species; common: string; latin: string }[] = [
  { species: 'chamomile', common: 'chamomile', latin: 'Matricaria chamomilla' },
  { species: 'echinacea', common: 'echinacea', latin: 'Echinacea purpurea' },
  { species: 'calendula', common: 'calendula', latin: 'Calendula officinalis' },
  { species: 'lavender', common: 'lavender', latin: 'Lavandula angustifolia' },
  { species: 'yarrow', common: 'yarrow', latin: 'Achillea millefolium' },
]

/** What a screen reader hears for the whole garden. */
export function gardenLabel(): string {
  return `An illustrated herb garden: ${HERBS.map((h) => `${h.common}, ${h.latin}`).join('; ')}.`
}

const HEX = /^#[0-9a-f]{6}$/

/** Everything wrong with a config, as plain sentences; empty when it is sound. */
export function validateGardenConfig(c: GardenConfig): string[] {
  const out: string[] = []
  const ordered = (r: readonly [number, number], name: string) => {
    if (!(r[0] <= r[1])) out.push(`${name} is not ordered`)
  }
  for (const [k, v] of Object.entries(c.palette)) if (!HEX.test(v)) out.push(`palette.${k} is not a lowercase hex colour`)
  for (const [k, v] of Object.entries(c.botanical)) if (!HEX.test(v)) out.push(`botanical.${k} is not a lowercase hex colour`)
  for (const [role, token] of Object.entries(c.colours)) if (!(token in c.palette)) out.push(`colours.${role} names no token`)
  const entries = [...Object.entries(c.washes.base), ...SPECIES.flatMap((s) => Object.entries(c.washes.species[s] ?? {}))]
  for (const [key, e] of entries) {
    if (!e) continue
    if (!(e[0] in c.botanical)) out.push(`wash ${key} names no botanical colour`)
    if (!(e[1] > 0 && e[1] <= 1)) out.push(`wash ${key} alpha is out of range`)
  }
  if (!SPECIES.some((s) => c.species[s] > 0)) out.push('no species has a weight')
  for (const s of SPECIES) {
    if (c.species[s] < 0) out.push(`species.${s} weight is negative`)
    const h = c.heights[s]
    ordered(h, `heights.${s}`)
    if (!(h[0] > 0 && h[1] <= 1)) out.push(`heights.${s} is out of range`)
  }
  for (const bp of BREAKPOINTS) {
    if (!(c.initialPlants[bp] >= 1)) out.push(`initialPlants.${bp} is below one`)
    if (!(c.maxPlants[bp] >= c.initialPlants[bp])) out.push(`maxPlants.${bp} is below initialPlants`)
    if (!(c.minSpacingPx[bp] > 0)) out.push(`minSpacingPx.${bp} is not positive`)
    if (!(c.aspect[bp] > 0)) out.push(`aspect.${bp} is not positive`)
  }
  if (!(c.groundAt > 0.3 && c.groundAt < 0.9)) out.push('groundAt is out of range')
  const g = c.growth
  for (const k of ['rootLeadMs', 'stemMs', 'rootRate', 'leafMs', 'bloomMs', 'seedDropMs', 'seedFadeMs', 'witherMs'] as const) {
    if (!(g[k] > 0)) out.push(`growth.${k} is not positive`)
  }
  ordered(g.staggerMs, 'growth.staggerMs')
  if (!(g.maxConcurrent >= 1)) out.push('growth.maxConcurrent is below one')
  ordered(c.idle.swayPeriodMs, 'idle.swayPeriodMs')
  if (!(c.idle.settleAfterMs > c.idle.afterMs)) out.push('idle.settleAfterMs is not after idle.afterMs')
  for (const k of ['fine', 'coarse'] as const) {
    if (!(c.fps[k] > 0)) out.push(`fps.${k} is not positive`)
    if (!(c.dprCap[k] >= 1)) out.push(`dprCap.${k} is below one`)
  }
  if (!(c.breakpoints.md < c.breakpoints.lg)) out.push('breakpoints are not ordered')
  if (!(c.sliceMs > 0 && c.sliceMs < 50)) out.push('sliceMs must stay under a long task')
  return out
}
