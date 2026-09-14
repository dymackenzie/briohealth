import { type NextRequest, NextResponse } from 'next/server'

/**
 * Old WordPress permalinks put every post at the site root. Rather than list
 * 418 redirects, anything unrecognised at the root goes to /blog/<slug>.
 *
 * Was middleware.ts before Next 16 renamed the convention. The matcher only
 * lets single-segment paths in, so this list just has to name the top-level
 * routes that actually exist.
 */
const KNOWN_ROUTES = new Set([
  'about',
  'services',
  'pickleball',
  'blog',
  'book',
  'contact',
  'privacy-policy',
  'terms-of-use',
  'api',
])

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.slice(1)

  // WordPress slugs never contain a dot, so anything with one is a file
  // (robots.txt, icon.png, the logos in public/).
  if (KNOWN_ROUTES.has(slug) || slug.includes('.') || slug.startsWith('_')) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/blog/${slug}`
  return NextResponse.redirect(url, 301)
}

export const config = {
  matcher: '/:slug',
}
