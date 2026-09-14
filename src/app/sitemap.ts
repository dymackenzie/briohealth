import type { MetadataRoute } from 'next'

import { getAllPostSlugs, getCategories } from '@/lib/wp/queries'
import { services } from '@/lib/content/services'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 86400

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = absoluteUrl

  const staticPages: MetadataRoute.Sitemap = [
    { url: url('/'), priority: 1, changeFrequency: 'monthly' },
    { url: url('/services'), priority: 0.9, changeFrequency: 'monthly' },
    { url: url('/about'), priority: 0.8, changeFrequency: 'yearly' },
    { url: url('/contact'), priority: 0.8, changeFrequency: 'yearly' },
    { url: url('/book'), priority: 0.8, changeFrequency: 'yearly' },
    { url: url('/blog'), priority: 0.7, changeFrequency: 'weekly' },
    { url: url('/pickleball'), priority: 0.5, changeFrequency: 'yearly' },
    { url: url('/privacy-policy'), priority: 0.2, changeFrequency: 'yearly' },
    { url: url('/terms-of-use'), priority: 0.2, changeFrequency: 'yearly' },
  ]

  const [slugs, categories] = await Promise.all([getAllPostSlugs(), getCategories()])

  return [
    ...staticPages,
    ...services.map((s) => ({
      url: url(`/services/${s.slug}`),
      priority: 0.9,
      changeFrequency: 'monthly' as const,
    })),
    ...categories.map((c) => ({
      url: url(`/blog/category/${c.slug}`),
      priority: 0.4,
      changeFrequency: 'weekly' as const,
    })),
    ...slugs.map((slug) => ({
      url: url(`/blog/${slug}`),
      priority: 0.6,
      changeFrequency: 'yearly' as const,
    })),
  ]
}
