import type { Breakpoint } from './config'
import { initialComposition, modelAt, stillLayout } from './layout'
import { svgParts } from './pen'

/**
 * The finished garden for one breakpoint as a standalone SVG: the same
 * seeds and composition the engine grows. Served as a static file
 * (src/app/garden/[file]/route.ts) for visitors without JavaScript and as
 * the fallback if the engine cannot load; at 0.5 to 1MB raw it is far too
 * big to inline in every page, and a visitor with JavaScript never fetches
 * it.
 */
export function stillSvg(bp: Breakpoint): string {
  const L = stillLayout(bp)
  const plants = initialComposition(bp, L.W).map((s) => modelAt(s.species, s.seed, s.hFrac, s.x, L))
  const ids = { next: 0 }
  let defs = ''
  let roots = ''
  let tops = ''
  const at = (x: number) => `<g transform="translate(${Math.round(x * 10) / 10} ${L.groundY})">`
  for (const { x, model } of plants) {
    const r = svgParts(model.roots, ids)
    defs += r.defs
    roots += `${at(x)}${r.body}</g>`
  }
  for (const { x, model } of plants) {
    const t = svgParts(model.top, ids)
    defs += t.defs
    tops += `${at(x)}${t.body}</g>`
  }
  const h = Math.round(L.Hb * 100) / 100
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.W} ${h}" width="${L.W}" height="${h}" fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    `<defs>${defs}</defs>${roots}${tops}</svg>`
  )
}
