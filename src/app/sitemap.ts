import { MetadataRoute } from 'next'
import { client, isSanityConfigured } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yourbriohealth.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isSanityConfigured) {
    return [{ url: SITE_URL, changeFrequency: 'weekly', priority: 1.0 }]
  }

  const [services, programs, teamMembers, posts, categories] = await Promise.all([
    client.fetch(groq`*[_type == "service"]{ slug, _updatedAt }`).catch(() => []),
    client.fetch(groq`*[_type == "program"]{ slug, _updatedAt }`).catch(() => []),
    client.fetch(groq`*[_type == "teamMember"]{ slug, _updatedAt }`).catch(() => []),
    client.fetch(groq`*[_type == "post" && !archived]{ slug, publishedAt, _updatedAt }`).catch(() => []),
    client.fetch(groq`*[_type == "category"]{ slug, _updatedAt }`).catch(() => []),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/about/team`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/programs`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/pickleball`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/book`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const servicePages = (services || []).map((s: any) => ({
    url: `${SITE_URL}/services/${s.slug?.current}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    lastModified: s._updatedAt,
  }))

  const programPages = (programs || []).map((p: any) => ({
    url: `${SITE_URL}/programs/${p.slug?.current}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    lastModified: p._updatedAt,
  }))

  const teamPages = (teamMembers || []).map((m: any) => ({
    url: `${SITE_URL}/about/team/${m.slug?.current}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    lastModified: m._updatedAt,
  }))

  const postPages = (posts || []).map((p: any) => ({
    url: `${SITE_URL}/blog/${p.slug?.current}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    lastModified: p._updatedAt || p.publishedAt,
  }))

  const categoryPages = (categories || []).map((c: any) => ({
    url: `${SITE_URL}/blog/category/${c.slug?.current}`,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...servicePages, ...programPages, ...teamPages, ...postPages, ...categoryPages]
}
