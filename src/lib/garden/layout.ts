import { GARDEN, SPECIES, type Breakpoint, type Species } from './config'
import { buildModel, modelBounds, type Bounds, type Env, type Model } from './species'
import { clamp } from './path'
import { rng32, rr, type Rng } from './rng'

/** The garden box, measured in CSS px. */
export interface Layout {
  W: number
  Hb: number
  groundY: number
  skyH: number
  soilH: number
  bp: Breakpoint
}

export function breakpointOf(viewportWidth: number): Breakpoint {
  return viewportWidth >= GARDEN.breakpoints.lg ? 'lg' : viewportWidth >= GARDEN.breakpoints.md ? 'md' : 'sm'
}

export function layoutFor(W: number, Hb: number, bp: Breakpoint): Layout {
  const groundY = Math.round(Hb * GARDEN.groundAt)
  return { W, Hb, groundY, skyH: groundY, soilH: Hb - groundY, bp }
}

/** The box the SVG still is drawn at, per breakpoint; it scales to the real box like any SVG. */
export const STILL_WIDTH: Record<Breakpoint, number> = { sm: 358, md: 736, lg: 1200 }

export function stillLayout(bp: Breakpoint): Layout {
  const W = STILL_WIDTH[bp]
  return layoutFor(W, W / GARDEN.aspect[bp], bp)
}

/** A weighted pick, avoiding the given species where possible. */
export function pickSpecies(rng: Rng, avoid: readonly Species[] = []): Species {
  let entries = SPECIES.filter((s) => GARDEN.species[s] > 0 && !avoid.includes(s))
  if (!entries.length) entries = SPECIES.filter((s) => GARDEN.species[s] > 0)
  let r = rng() * entries.reduce((sum, s) => sum + GARDEN.species[s], 0)
  for (const s of entries) if ((r -= GARDEN.species[s]) <= 0) return s
  return entries[entries.length - 1]
}

export interface Seedling {
  species: Species
  x: number
  hFrac: number
  seed: number
  /** How long after the garden starts this plant comes up, in ms; the first comes up at once. */
  delay: number
}

/** The opening composition for a breakpoint: every species once, in a seeded order, spread across the bed. */
export function initialComposition(bp: Breakpoint, W: number): Seedling[] {
  const rng = rng32(GARDEN.seed + { sm: 1, md: 2, lg: 3 }[bp])
  const n = GARDEN.initialPlants[bp]
  const all = SPECIES.filter((s) => GARDEN.species[s] > 0)
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  const order = all.slice(0, n)
  while (order.length < n) order.push(pickSpecies(rng, order.slice(-2)))
  const inset = GARDEN.insetPx + 16
  const span = W - 2 * inset
  const plants = order.map((species, i) => ({
    species,
    x: inset + ((i + 0.5 + rr(rng, -0.16, 0.16)) * span) / n,
    hFrac: rr(rng, ...GARDEN.heights[species]),
    seed: Math.floor(rng() * 2 ** 31),
    delay: rr(rng, ...GARDEN.growth.staggerMs),
  }))
  // The stagger counts from the first plant, which comes up at once.
  const first = Math.min(...plants.map((p) => p.delay))
  return plants.map((p) => ({ ...p, delay: p.delay - first }))
}

export function plantHeight(hFrac: number, L: Layout): number {
  return Math.min(L.skyH * hFrac, L.skyH - GARDEN.maxHeightMarginPx)
}

/** The soil and sky a plant at x may use. */
export function plantEnv(x: number, L: Layout): Env {
  return { rootDepth: Math.max(20, L.soilH - 10), xMin: -x + 2, xMax: L.W - x - 2, maxH: L.skyH - GARDEN.maxHeightMarginPx }
}

/** Where a plant must stand so its drawing stays inside the box. */
export function fitX(x: number, top: Bounds, W: number): number {
  return clamp(x, -top.minX + 4, W - top.maxX - 4)
}

/** A plant's model at x, moved inward (and rebuilt there) if it would stick out of the box. */
export function modelAt(species: Species, seed: number, hFrac: number, x: number, L: Layout): { x: number; model: Model } {
  const H = plantHeight(hFrac, L)
  let model = buildModel(species, seed, H, plantEnv(x, L))
  const fx = fitX(x, modelBounds(model.top, 0, model.H), L.W)
  if (Math.abs(fx - x) > 0.5) {
    x = fx
    model = buildModel(species, seed, H, plantEnv(x, L))
  }
  return { x, model }
}

export interface Occupant {
  id: number
  x: number
  origin: 'initial' | 'visitor' | 'self'
}

export type Planting =
  | { kind: 'plant'; x: number; evict: number | null }
  | { kind: 'rustle'; id: number }
  | { kind: 'replace'; id: number; x: number }
  | { kind: 'none' }

/**
 * What a tap at x does. Far enough from every plant and falling seed, it
 * plants there, and at the cap the oldest visitor's plant (else a
 * self-sown one, else an original) makes way. Too close to a plant, it
 * rustles it, or, on a narrow bed, replaces it: that plant fades and the new
 * seed takes its place, so a tap can never grow a plant into its neighbour.
 * Too close to a seed still falling, nothing happens.
 */
export function decidePlanting(x: number, plants: readonly Occupant[], seedXs: readonly number[], L: Layout): Planting {
  const bp = L.bp
  const at = clamp(x, GARDEN.insetPx, L.W - GARDEN.insetPx)
  const spacing = GARDEN.minSpacingPx[bp]
  let near: Occupant | null = null
  for (const p of plants) if (Math.abs(p.x - at) < spacing && (!near || Math.abs(p.x - at) < Math.abs(near.x - at))) near = p
  if (near) return GARDEN.crowded[bp] === 'replace' ? { kind: 'replace', id: near.id, x: near.x } : { kind: 'rustle', id: near.id }
  if (seedXs.some((s) => Math.abs(s - at) < spacing)) return { kind: 'none' }
  let evict: number | null = null
  if (plants.length + seedXs.length >= GARDEN.maxPlants[bp]) {
    for (const origin of ['visitor', 'self', 'initial'] as const) {
      const p = plants.find((q) => q.origin === origin)
      if (p) {
        evict = p.id
        break
      }
    }
  }
  return { kind: 'plant', x: at, evict }
}
