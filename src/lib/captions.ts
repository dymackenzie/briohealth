import { WP_UPLOADS_URL } from '@/lib/wp/client'

/**
 * A narrated video's captions are a .vtt in the WordPress media library.
 * A <track> from another origin needs CORS headers, which the host does not
 * send, so the page asks /api/captions/<path under uploads> and that route
 * fetches the file. Both directions accept only a .vtt under uploads, so
 * the route can't be used to fetch anything else.
 */

// No leading dot, so no `..` and no hidden files.
const SEGMENT = /^[\w-][\w.-]*$/

/** The media library file for the route's path segments, or null. */
export function captionsSource(segments: string[]): string | null {
  if (!segments.length || !segments.every((s) => SEGMENT.test(s))) return null
  if (!segments[segments.length - 1].endsWith('.vtt')) return null
  return `${WP_UPLOADS_URL}/${segments.join('/')}`
}

/** The same-origin path for a captions URL from the media library, or null. */
export function captionsPath(url: string | null | undefined): string | null {
  const trimmed = url?.trim()
  const prefix = `${WP_UPLOADS_URL}/`
  if (!trimmed?.startsWith(prefix)) return null
  const segments = trimmed.slice(prefix.length).split('/')
  return captionsSource(segments) ? `/api/captions/${segments.join('/')}` : null
}
