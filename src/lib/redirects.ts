/**
 * Old WordPress permalinks put every post at the site root. Rather than list
 * 418 redirects, anything unrecognised at the root goes to /blog/<slug>.
 * This list must name every real top-level route, including the CMS pages
 * served by src/app/[slug]/page.tsx.
 */
export const TOP_LEVEL_ROUTES = new Set([
  'about',
  'new-patient',
  'services',
  'pickleball',
  'blog',
  'book', // redirect source only (next.config); listed so the proxy never sends it to /blog
  'contact',
  'privacy-policy',
  'terms-of-use',
  'api',
  'sitemap.xml',
  'robots.txt',
])

/** The /blog path for a root-level slug, or null when the request is not one. */
export function blogRedirectFor(pathname: string): string | null {
  const slug = pathname.replace(/^\/+/, '').replace(/\/+$/, '')

  if (!slug || slug.includes('/')) return null
  if (TOP_LEVEL_ROUTES.has(slug)) return null
  // WordPress slugs never contain a dot, so anything with one is a file.
  if (slug.includes('.') || slug.startsWith('_')) return null

  return `/blog/${slug}`
}
