import { BREAKPOINTS, type Breakpoint } from '@/lib/garden/config'
import { stillSvg } from '@/lib/garden/still'

/**
 * The herb garden's finished still, one SVG per breakpoint, written at build
 * time from the same models the canvas grows: /garden/sm.svg, md.svg and
 * lg.svg. Only fetched without JavaScript (the hero's <noscript> picture)
 * or if the engine fails to load.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return BREAKPOINTS.map((bp) => ({ file: `${bp}.svg` }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const bp = file.replace(/\.svg$/, '') as Breakpoint
  if (!BREAKPOINTS.includes(bp)) return new Response('Not found', { status: 404 })
  return new Response(stillSvg(bp), { headers: { 'content-type': 'image/svg+xml; charset=utf-8' } })
}
