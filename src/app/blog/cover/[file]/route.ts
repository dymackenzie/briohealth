import sharp from 'sharp'

import { coverSvg } from '@/lib/garden/cover'

/**
 * A post's drawn cover for the archive list, /blog/cover/<post id>.webp:
 * the herb from src/lib/garden/cover.ts at twice the 160px display width.
 * The id alone decides the drawing, so nothing is read from WordPress and
 * the bytes never change; the list adds ?v= to bust caches when the
 * drawing does. Two segments, so it never meets /blog/[slug].
 */
const FILE = /^(\d{1,7})\.webp$/

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const match = FILE.exec((await params).file)
  if (!match) return new Response('Not found', { status: 404 })
  const id = Number(match[1])

  let webp: Buffer
  try {
    webp = await sharp(Buffer.from(coverSvg(id))).resize(320, 213).webp({ quality: 78 }).toBuffer()
  } catch (error) {
    console.error(`[cover] ${id} failed`, error)
    return new Response('Cover failed', { status: 500 })
  }

  return new Response(new Uint8Array(webp), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
