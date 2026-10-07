import { GARDEN, SPECIES, type Species } from './config'
import { svgParts } from './pen'
import { buildModel, modelBounds, type Bounds, type Model } from './species'

/**
 * A blog post's cover in the archive list: one herb from the garden's
 * models, whole but without roots or ground, on flat sand, like a
 * herbarium sheet. The post id alone picks the herb and its seed, so a
 * post always gets the same drawing and nothing is read from WordPress.
 * Rendered to WebP by src/app/blog/cover/[file]/route.ts. Decorative:
 * no names, no labels.
 */

export const COVER_W = 480
export const COVER_H = 320
/** The plant's height, about 85% of the box. */
const PLANT_H = 270
/** The invisible base line the plant stands on. */
const BASE_Y = COVER_H - 18
/** The least space between the plant and any edge. */
export const COVER_MARGIN = 10

/** Bump to change every cover's URL after the drawing changes. */
export const COVER_VERSION = 1

const POOL = SPECIES.filter((sp) => GARDEN.species[sp] > 0)

/** A 32-bit integer mix (lowbias32): neighbouring ids land far apart. */
function mix(n: number): number {
  let h = n >>> 0
  h ^= h >>> 16
  h = Math.imul(h, 0x7feb352d)
  h ^= h >>> 15
  h = Math.imul(h, 0x846ca68b)
  h ^= h >>> 16
  return h >>> 0
}

/**
 * Any salt spreads the herbs evenly; this one was picked so the archive's
 * first page (October 2026) shows all five with no two neighbours alike.
 */
const SALT = 0x2b

/** The herb and model seed for a post id. */
export function coverFor(id: number): { species: Species; seed: number } {
  const h = mix(id ^ SALT)
  return { species: POOL[h % POOL.length], seed: mix(h + 0x6d2b79f5) }
}

export interface CoverLayout {
  model: Model
  /** The top's bounds in plant coordinates. */
  bounds: Bounds
  /** Where the plant's base sits in the box, and its scale. */
  x: number
  y: number
  scale: number
}

/** The plant for a post id, centred on its own bounds and shrunk if it would come within the margin. */
export function coverLayout(id: number): CoverLayout {
  const { species, seed } = coverFor(id)
  const half = COVER_W / 2 - COVER_MARGIN
  const model = buildModel(species, seed, PLANT_H, { rootDepth: 10, xMin: -half, xMax: half, maxH: BASE_Y - COVER_MARGIN })
  const b = modelBounds(model.top, 0, model.H)
  const scale = Math.min(
    1,
    (BASE_Y - COVER_MARGIN) / Math.max(1, -b.minY),
    (COVER_W - 2 * COVER_MARGIN) / Math.max(1, b.maxX - b.minX),
    b.maxY > 0 ? (COVER_H - COVER_MARGIN - BASE_Y) / b.maxY : 1,
  )
  return { model, bounds: b, x: COVER_W / 2 - ((b.minX + b.maxX) / 2) * scale, y: BASE_Y, scale }
}

const round = (v: number) => Math.round(v * 100) / 100

/** The cover for a post id as a standalone SVG, 480x320. */
export function coverSvg(id: number): string {
  const { model, x, y, scale } = coverLayout(id)
  const { defs, body } = svgParts(model.top, { next: 0 })
  const transform = `translate(${round(x)} ${round(y)})${scale < 1 ? ` scale(${Math.floor(scale * 1000) / 1000})` : ''}`
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COVER_W} ${COVER_H}" width="${COVER_W}" height="${COVER_H}" fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    `<rect width="${COVER_W}" height="${COVER_H}" fill="${GARDEN.palette.grey}"/>` +
    `<defs>${defs}</defs><g transform="${transform}">${body}</g></svg>`
  )
}

/** The list's image URL for a post id, versioned so a new drawing busts every cache. */
export function coverPath(id: number): string {
  return `/blog/cover/${id}.webp?v=${COVER_VERSION}`
}
