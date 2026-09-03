import { client, isSanityConfigured } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yourbriohealth.com'

export async function GET() {
  const posts = isSanityConfigured
    ? await client.fetch(
        groq`*[_type == "post" && !archived] | order(publishedAt desc) [0...50] {
          title, slug, excerpt, publishedAt, _updatedAt,
          "authorName": author->name,
          "categories": categories[]->title
        }`
      ).catch(() => [])
    : []

  const items = (posts || []).map((post: any) => {
    const url = `${SITE_URL}/blog/${post.slug?.current}`
    const pubDate = post.publishedAt
      ? new Date(post.publishedAt).toUTCString()
      : new Date().toUTCString()
    const cats = (post.categories || []).map((c: string) => `<category>${escapeXml(c)}</category>`).join('')
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ''}
      ${post.authorName ? `<author>${escapeXml(post.authorName)}</author>` : ''}
      ${cats}
    </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Brio Health Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Health tips, recipes, and clinic news from Brio Health Inc., Richmond BC.</description>
    <language>en-ca</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
