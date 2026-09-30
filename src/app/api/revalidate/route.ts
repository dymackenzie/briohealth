import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { tags } from '@/lib/wp/client'

/**
 * WordPress save_post webhook (wp/brio-headless/inc/revalidate.php).
 *
 * The second argument to revalidateTag is required in Next 16. 'max' is
 * stale-while-revalidate: an editor who hits Publish sees the change on the
 * next request or the one after. updateTag would be immediate but is
 * Server-Actions-only, so it cannot be used here.
 */
export async function POST(request: Request) {
  const secret = process.env.WP_REVALIDATE_SECRET

  if (!secret) {
    console.error('[revalidate] WP_REVALIDATE_SECRET is not set')
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  if (request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: { post_type?: unknown; slug?: unknown }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  // Valid JSON can still be null or a bare string.
  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json({ error: 'Missing post_type' }, { status: 400 })
  }

  const postType = typeof payload.post_type === 'string' ? payload.post_type : ''
  const slug = typeof payload.slug === 'string' && payload.slug ? payload.slug : null
  if (!postType) {
    return NextResponse.json({ error: 'Missing post_type' }, { status: 400 })
  }

  const busted: string[] = []
  const bust = (tag: string) => {
    revalidateTag(tag, 'max')
    busted.push(tag)
  }

  switch (postType) {
    case 'post':
      bust(tags.posts)
      bust(tags.categories)
      if (slug) bust(tags.post(slug))
      break

    case 'page':
      bust(tags.pages)
      if (slug) bust(tags.page(slug))
      break

    // The options page is not a post type; revalidate.php sends this literal.
    case tags.siteSettings:
      bust(tags.siteSettings)
      break

    default:
      bust(tags.type(postType))
      if (slug) bust(tags.typeSlug(postType, slug))
  }

  return NextResponse.json({ revalidated: busted })
}
