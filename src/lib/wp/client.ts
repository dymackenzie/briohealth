import type { WPCollection, WPPagination } from './types'

/**
 * WordPress reads. The wp/v2 endpoints are public, so no auth and everything
 * is cacheable.
 *
 * Nothing in here throws — callers get null or an empty collection. A blank
 * section beats a build that dies because the clinic's host had a bad minute.
 */

const WP_BASE = (
  process.env.WP_API_URL ?? 'https://yourbriohealth.com/wp-json/wp/v2'
).replace(/\/$/, '')

/** Media lives wherever the API does, so content URLs get pointed here. */
export const WP_HOST = new URL(WP_BASE).host

// Backstop only; the save_post webhook is what normally busts the cache.
const DEFAULT_REVALIDATE = 3600

export interface WPFetchOptions {
  tags?: string[]
  revalidate?: number
  query?: Record<string, string | number | boolean | undefined>
}

function buildUrl(path: string, query: WPFetchOptions['query']): string {
  const url = new URL(`${WP_BASE}/${path.replace(/^\//, '')}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url.toString()
}

function readPagination(response: Response): WPPagination {
  return {
    total: Number(response.headers.get('x-wp-total') ?? 0),
    totalPages: Number(response.headers.get('x-wp-totalpages') ?? 0),
  }
}

async function request(
  path: string,
  options: WPFetchOptions = {},
): Promise<Response | null> {
  const url = buildUrl(path, options.query)

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: {
        tags: options.tags ?? [],
        revalidate: options.revalidate ?? DEFAULT_REVALIDATE,
      },
    })

    // An unknown slug is normal, not an incident.
    if (response.status === 404) return null

    if (!response.ok) {
      console.error(`[wp] ${response.status} ${response.statusText} — ${url}`)
      return null
    }

    return response
  } catch (error) {
    console.error(`[wp] request failed — ${url}`, error)
    return null
  }
}

export async function wpFetchMany<T>(
  path: string,
  options: WPFetchOptions = {},
): Promise<WPCollection<T>> {
  const response = await request(path, options)
  if (!response) return { items: [], total: 0, totalPages: 0 }

  try {
    const items = (await response.json()) as T[]
    return { items, ...readPagination(response) }
  } catch (error) {
    console.error(`[wp] could not parse collection — ${path}`, error)
    return { items: [], total: 0, totalPages: 0 }
  }
}

export async function wpFetchOne<T>(
  path: string,
  options: WPFetchOptions = {},
): Promise<T | null> {
  const response = await request(path, options)
  if (!response) return null

  try {
    return (await response.json()) as T
  } catch (error) {
    console.error(`[wp] could not parse resource — ${path}`, error)
    return null
  }
}

/** WordPress has no /posts/<slug> route, so slug lookups go through ?slug=. */
export async function wpFetchBySlug<T>(
  path: string,
  slug: string,
  options: WPFetchOptions = {},
): Promise<T | null> {
  const { items } = await wpFetchMany<T>(path, {
    ...options,
    query: { ...options.query, slug, per_page: 1 },
  })
  return items[0] ?? null
}

/**
 * Every page of a collection, for generateStaticParams and the sitemap.
 * Sequential on purpose — this runs at build time against a shared host and
 * saving two seconds isn't worth hammering it.
 */
export async function wpFetchAll<T>(
  path: string,
  options: WPFetchOptions = {},
): Promise<T[]> {
  const first = await wpFetchMany<T>(path, {
    ...options,
    query: { ...options.query, per_page: 100, page: 1 },
  })

  const all = [...first.items]
  for (let page = 2; page <= first.totalPages; page++) {
    const next = await wpFetchMany<T>(path, {
      ...options,
      query: { ...options.query, per_page: 100, page },
    })
    if (!next.items.length) break
    all.push(...next.items)
  }

  return all
}

// Shared by the readers and the revalidate webhook so they can't drift.
export const tags = {
  posts: 'posts',
  post: (slug: string) => `post:${slug}`,
  categories: 'categories',
  pages: 'pages',
  page: (slug: string) => `page:${slug}`,
  siteSettings: 'site-settings',
  type: (type: string) => type,
  typeSlug: (type: string, slug: string) => `${type}:${slug}`,
} as const
