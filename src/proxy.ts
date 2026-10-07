import { type NextRequest, NextResponse } from 'next/server'

import { blogRedirectFor } from '@/lib/redirects'

/**
 * Next 16's name for middleware. Runs on the Node.js runtime; that is not
 * configurable. The matcher only lets single-segment paths in.
 */
export function proxy(request: NextRequest) {
  const target = blogRedirectFor(request.nextUrl.pathname)
  if (!target) return NextResponse.next()

  // Clone keeps the query string, so ?utm_source= survives the move.
  const url = request.nextUrl.clone()
  url.pathname = target
  return NextResponse.redirect(url, 301)
}

export const config = {
  matcher: '/:slug',
}
