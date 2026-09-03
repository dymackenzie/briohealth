import { type NextRequest, NextResponse } from 'next/server'

// Known app routes at root level — do NOT redirect these to /blog
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
  'studio',
  'api',
  'sitemap.xml',
  'robots.txt',
  '_next',
  'favicon.ico',
])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only handle root-level paths like /some-slug or /some-slug/
  const parts = pathname.replace(/^\//, '').replace(/\/$/, '').split('/')
  if (parts.length !== 1) return NextResponse.next()

  const slug = parts[0]
  if (!slug) return NextResponse.next()
  if (KNOWN_ROUTES.has(slug)) return NextResponse.next()

  // Skip file-like paths (.jpg, .png, etc.)
  if (/\.\w{2,5}$/.test(slug)) return NextResponse.next()

  // Skip Next.js internal paths
  if (slug.startsWith('_') || slug.startsWith('.')) return NextResponse.next()

  // Looks like a legacy blog post slug — redirect to /blog/<slug>
  const url = request.nextUrl.clone()
  url.pathname = `/blog/${slug}`
  return NextResponse.redirect(url, { status: 301 })
}

export const config = {
  matcher: [
    // Match all root-level paths except known Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
