import { captionsSource } from '@/lib/captions'

/**
 * Serves a narrated video's captions from the media library on this
 * origin, because a cross-origin <track> needs CORS headers the WordPress
 * host does not send (src/lib/captions.ts). Only a .vtt under uploads.
 * The file is cached for an hour here and a day at the edge.
 */
export async function GET(_request: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const source = captionsSource((await ctx.params).path)
  if (!source) return new Response('Not found', { status: 404 })

  let upstream: Response
  try {
    upstream = await fetch(source, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error(`[captions] ${source} failed`, error)
    return new Response('Bad gateway', { status: 502 })
  }
  if (!upstream.ok) {
    console.error(`[captions] ${source} answered ${upstream.status}`)
    return new Response('Not found', { status: 404 })
  }

  return new Response(await upstream.text(), {
    headers: {
      'Content-Type': 'text/vtt; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
