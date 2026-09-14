import { getPosts } from '@/lib/wp/queries'
import { decodeTitle, plainExcerpt } from '@/lib/wp/renderContent'
import { absoluteUrl, site } from '@/lib/site'

export const revalidate = 3600

function escape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET() {
  // Titles and excerpts only. With _embed the same call drags every post's
  // full HTML body across the wire — about a megabyte to build 15KB of feed.
  const { posts } = await getPosts({
    perPage: 30,
    fields: 'id,slug,date_gmt,title,excerpt',
  })

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`)
      // WordPress dates carry no offset. `date` is clinic-local and would be
      // read as UTC, so use the GMT one.
      return `    <item>
      <title>${escape(decodeTitle(post.title.rendered))}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.date_gmt}Z`).toUTCString()}</pubDate>
      <description>${escape(plainExcerpt(post.excerpt.rendered, 300))}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${site.url}</link>
    <description>${escape(site.tagline)}</description>
    <language>en-CA</language>
    <atom:link href="${site.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
