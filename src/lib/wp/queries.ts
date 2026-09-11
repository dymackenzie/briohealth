import { tags, wpFetchAll, wpFetchBySlug, wpFetchMany } from './client'
import type { WPCategory, WPPage, WPPost } from './types'

export const POSTS_PER_PAGE = 12

/**
 * Service and team content the old site authored as blog posts. They're still
 * reachable at /blog/<slug> so the inbound links keep working, but they'd be
 * noise in the index — the newest is from 2016. See docs/client-inputs.md.
 */
const NOT_REALLY_POSTS = new Set([
  'low-level-laser-therapy',
  'registered-massage-therapy',
  'weight-loss-in-richmond-bc',
  'liver-detox-program',
  'healthy-living-101-event',
  'workshop',
  'about-kyra-sturrock',
  'learn-more-about-linda',
])

const EMBED = { _embed: '1' }

/**
 * brio-health-clinic is on 316 of 418 posts — it's "uncategorized" wearing a
 * hat, and surfacing it would just mirror the full index. Stated once so the
 * index and the per-post category list can't disagree about what's visible.
 */
const HIDDEN_CATEGORIES = new Set(['brio-health-clinic', 'uncategorized'])

export async function getPosts({
  page = 1,
  perPage = POSTS_PER_PAGE,
  categoryId,
  fields,
}: {
  page?: number
  perPage?: number
  categoryId?: number
  /** Narrow the response when the caller only needs a few fields. */
  fields?: string
} = {}) {
  // Over-fetch a little so filtering the strays doesn't leave a short page.
  const { items, total, totalPages } = await wpFetchMany<WPPost>('posts', {
    tags: [tags.posts],
    query: {
      ...(fields ? { _fields: fields } : EMBED),
      page,
      per_page: perPage + NOT_REALLY_POSTS.size,
      categories: categoryId,
    },
  })

  return {
    posts: items.filter((p) => !NOT_REALLY_POSTS.has(p.slug)).slice(0, perPage),
    total,
    totalPages,
  }
}

export function getPost(slug: string) {
  return wpFetchBySlug<WPPost>('posts', slug, {
    tags: [tags.posts, tags.post(slug)],
    query: EMBED,
  })
}

export async function getAllPostSlugs() {
  const posts = await wpFetchAll<Pick<WPPost, 'slug'>>('posts', {
    tags: [tags.posts],
    query: { _fields: 'slug' },
  })
  return posts.map((p) => p.slug)
}

export async function getCategories() {
  const items = await wpFetchAll<WPCategory>('categories', {
    tags: [tags.categories],
    query: { _fields: 'id,name,slug,count,description', hide_empty: true },
  })

  return items
    .filter((c) => !HIDDEN_CATEGORIES.has(c.slug))
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
}

export async function getCategory(slug: string) {
  // The full list is already cached under the same tag, and there are only 13.
  // A per-slug request is a different URL, so it misses that cache entirely.
  const all = await getCategories()
  return all.find((c) => c.slug === slug) ?? null
}

export function getPage(slug: string) {
  return wpFetchBySlug<WPPage>('pages', slug, {
    tags: [tags.pages, tags.page(slug)],
    query: EMBED,
  })
}

/* Helpers for the _embed payload, which is awkward to read inline. */

export function featuredImage(post: WPPost | WPPage) {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media?.source_url) return null

  return {
    url: media.source_url,
    alt: media.alt_text || '',
    width: media.media_details?.width,
    height: media.media_details?.height,
  }
}

export function postCategories(post: WPPost) {
  return (post._embedded?.['wp:term'] ?? [])
    .flat()
    .filter((t) => t.taxonomy === 'category' && !HIDDEN_CATEGORIES.has(t.slug))
}

export function authorName(post: WPPost) {
  return post._embedded?.author?.[0]?.name ?? 'Brio Health'
}
