import { GARDEN } from '@/lib/garden/config'
import { rr, ri, rng32, type Rng } from '@/lib/garden/rng'

/**
 * The flowers that open on selected text (`SelectionFlowers`). Flat 2D
 * heads in the garden's washes, no ink line, so a long selection is a few
 * dozen small SVGs and nothing else. Cream rays are left out: without the
 * garden's ink line they vanish into the paper.
 */
const { saffron, marigold, ochre, roseClay, russet, dustyLavender } = GARDEN.botanical
const PETALS = [saffron, marigold, roseClay, dustyLavender]
const DISCS = [ochre, russet, saffron]

/** About one letter in five plants something. Fixed per letter, so stretching a selection keeps what is already up. */
export const PLANT_CHANCE = 0.2

/** A hash of the key, so a letter's yes or no never changes between updates. */
export function plants(key: string): boolean {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193)
  // FNV alone clusters on neighbouring keys ("0:12", "0:13"), so mix it like murmur3's finish
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b)
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296 < PLANT_CHANCE
}

const f = (n: number) => n.toFixed(1)

/**
 * One flower head as SVG markup, floating a little above (0, 0) and sized to
 * the text it comes out of: five petals and a centre, nothing else. Parts
 * carry the classes motion.css opens them by: `petal` with `--i` so they
 * open one at a time, and `disc`. The CSS scale sits on a wrapper
 * because it would replace a petal's own rotate.
 */
export function flowerSvg(size: number, rng: Rng = rng32((Math.random() * 2 ** 32) >>> 0)): string {
  const hx = rr(rng, -0.15, 0.15) * size
  const hy = -rr(rng, 0.25, 0.6) * size
  const n = 5
  const pl = size * rr(rng, 0.2, 0.28)
  const pw = pl * rr(rng, 0.45, 0.7)
  const petal = PETALS[ri(rng, 0, PETALS.length - 1)]
  const disc = DISCS.filter((c) => c !== petal)[ri(rng, 0, 1)]
  const turn = rr(rng, 0, 360)
  const origin = `transform-origin:${f(hx)}px ${f(hy)}px`
  const petals = Array.from(
    { length: n },
    (_, i) =>
      `<g class="petal" style="--i:${i};${origin}"><ellipse cx="${f(hx)}" cy="${f(hy - pl / 2)}" rx="${f(pw / 2)}" ry="${f(pl / 2)}" fill="${petal}" transform="rotate(${f(turn + (360 / n) * i)} ${f(hx)} ${f(hy)})"/></g>`,
  ).join('')

  return (
    `<svg class="flower" width="1" height="1" overflow="visible" aria-hidden="true" style="--n:${n}">` +
    petals +
    `<circle class="disc" style="${origin}" cx="${f(hx)}" cy="${f(hy)}" r="${f(pl * 0.42)}" fill="${disc}"/>` +
    `</svg>`
  )
}
