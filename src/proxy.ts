import { type NextRequest, NextResponse } from 'next/server'

/**
 * Old WordPress permalinks put every post at the site root. Rather than list
 * 418 redirects, anything unrecognised at the root goes to /blog/<slug>.
 *
 * Was middleware.ts before Next 16 renamed the convention. Runs on nodejs
 * only — no edge — so keep KNOWN_ROUTES complete: every entry here is a
 * request that skips this hop entirely.
 */
const KNOWN_ROUTES = new Set([
  '',
  'about',
  'services',
  'programs',
  'pickleball',
  'blog',
  'book',
  'contact',
  'privacy-policy',
  'terms-of-use',
  'api',
  'sitemap.xml',
  'robots.txt',
  'favicon.ico',
  '_next',
])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const parts = pathname.replace(/^\//, '').replace(/\/$/, '').split('/')
  if (parts.length !== 1) return NextResponse.next()

  const slug = parts[0]
  if (!slug) return NextResponse.next()
  if (KNOWN_ROUTES.has(slug)) return NextResponse.next()

  // Anything file-shaped is an asset.
  if (/\.\w{2,5}$/.test(slug)) return NextResponse.next()
  if (slug.startsWith('_') || slug.startsWith('.')) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/blog/${slug}`
  return NextResponse.redirect(url, { status: 301 })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
