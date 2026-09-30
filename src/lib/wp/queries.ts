import { withFallback } from '@/lib/content/merge'
import { site, type Day, type HoursRow, type SiteSettings } from '@/lib/site'
import { tags, wpFetchAll, wpFetchBySlug, wpFetchMany, wpFetchOne } from './client'
import type { WPCategory, WPPage, WPPost, WPSettings } from './types'

export const POSTS_PER_PAGE = 12

/**
 * Service and team content the old site authored as blog posts. Still
 * reachable at /blog/<slug> so inbound links keep working, but noise in the
 * index: the newest is from 2016. See docs/client-inputs.md.
 */
const NOT_REALLY_POSTS = [
  'low-level-laser-therapy',
  'registered-massage-therapy',
  'weight-loss-in-richmond-bc',
  'liver-detox-program',
  'healthy-living-101-event',
  'workshop',
  'about-kyra-sturrock',
  'learn-more-about-linda',
]

const EMBED = { _embed: '1' }

/**
 * brio-health-clinic is on 316 of 418 posts: "uncategorized" wearing a hat.
 * Stated once so the index and the per-post list cannot disagree.
 */
const HIDDEN_CATEGORIES = new Set(['brio-health-clinic', 'uncategorized'])

/** `?page=` from searchParams: a positive integer or 1. */
export function parsePage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value || !/^\d+$/.test(value)) return 1
  const n = Number(value)
  return n >= 1 ? n : 1
}

export async function getPosts({
  page = 1,
  perPage = POSTS_PER_PAGE,
  categoryId,
  search,
  fields,
}: {
  page?: number
  perPage?: number
  categoryId?: number
  search?: string
  /** Narrow the response when the caller only needs a few fields. */
  fields?: string
} = {}) {
  const { items, total, totalPages } = await wpFetchMany<WPPost>('wp/v2/posts', {
    tags: [tags.posts],
    query: {
      ...(fields ? { _fields: fields } : EMBED),
      page,
      per_page: perPage,
      categories: categoryId,
      search,
      exclude: (await notReallyPostIds()).join(',') || undefined,
    },
  })

  return { posts: items, total, totalPages }
}

/** exclude= only takes IDs. Looked up by slug so they survive a re-import. */
async function notReallyPostIds() {
  const { items } = await wpFetchMany<Pick<WPPost, 'id'>>('wp/v2/posts', {
    tags: [tags.posts],
    query: { slug: NOT_REALLY_POSTS.join(','), per_page: 100, _fields: 'id' },
  })
  return items.map((p) => p.id)
}

export function getPost(slug: string) {
  return wpFetchBySlug<WPPost>('wp/v2/posts', slug, {
    tags: [tags.posts, tags.post(slug)],
    query: EMBED,
  })
}

export async function getAllPostSlugs() {
  const posts = await wpFetchAll<Pick<WPPost, 'slug'>>('wp/v2/posts', {
    tags: [tags.posts],
    query: { _fields: 'slug' },
  })
  return posts.map((p) => p.slug)
}

export async function getCategories() {
  const items = await wpFetchAll<WPCategory>('wp/v2/categories', {
    tags: [tags.categories],
    query: { _fields: 'id,name,slug,count,description', hide_empty: true },
  })

  return items.filter((c) => !HIDDEN_CATEGORIES.has(c.slug)).sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
}

export async function getCategory(slug: string) {
  // The full list is already cached under the same tag.
  const all = await getCategories()
  return all.find((c) => c.slug === slug) ?? null
}

export function getPage(slug: string) {
  return wpFetchBySlug<WPPage>('wp/v2/pages', slug, {
    tags: [tags.pages, tags.page(slug)],
    query: EMBED,
  })
}

/* Helpers for the _embed payload. */

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

/* Site settings */

const DAYS: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function isDay(value: string): value is Day {
  return (DAYS as readonly string[]).includes(value)
}

function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`
}

/**
 * SCF answers `false` for an empty image, relationship or group field, and
 * the merge keeps `false` as a real value, so it is cut here before it can
 * overwrite a fallback.
 */
function present<T>(value: T | false | null | undefined): T | undefined {
  return value === false || value === null ? undefined : value
}

/**
 * The options page over the code fallback. Only open rows with real days
 * and both times become hours; anything else would put nonsense in the
 * JSON-LD.
 */
export function mergeSettings(wp: WPSettings | null, fallback: SiteSettings): SiteSettings {
  if (!wp) return fallback

  const hours: HoursRow[] = (present(wp.hours) ?? []).flatMap((row) => {
    const days = (present(row.days) ?? []).filter(isDay)
    const opens = present(row.opens)
    const closes = present(row.closes)
    return !row.closed && opens && closes && days.length ? [{ days, opens, closes }] : []
  })

  const address = present(wp.address)
  const ogImage = present(wp.ogImage)
  const phone = present(wp.phone)

  const merged = withFallback<SiteSettings>(
    {
      phone,
      email: present(wp.email),
      address: address
        ? {
            street: present(address.street),
            locality: present(address.locality),
            region: present(address.region),
            postal: present(address.postal),
            country: present(address.country),
          }
        : undefined,
      mapUrl: present(wp.mapUrl),
      bookingUrl: present(wp.bookingUrl),
      ctaLabel: present(wp.ctaLabel),
      saturdayNote: present(wp.saturdayNote),
      hours,
      social: present(wp.social),
      ogImage: ogImage?.url
        ? {
            url: ogImage.url,
            width: ogImage.width ?? 1200,
            height: ogImage.height ?? 630,
            alt: ogImage.alt || fallback.name,
          }
        : undefined,
    } as Partial<SiteSettings>,
    fallback,
  )

  // null is a real answer here (the bar is off), so it bypasses the merge.
  // false is SCF's empty, which keeps the fallback like any other blank.
  merged.announcement =
    wp.announcement === undefined || wp.announcement === false ? fallback.announcement : wp.announcement
  merged.phoneHref = phone?.trim() ? telHref(phone) : fallback.phoneHref
  return merged
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const wp = await wpFetchOne<WPSettings>('brio/v1/settings', { tags: [tags.siteSettings] })
  return mergeSettings(wp, site)
}
