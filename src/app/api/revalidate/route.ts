import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { tags } from '@/lib/wp/client'

/**
 * WordPress save_post webhook.
 *
 * Note the second argument to revalidateTag — Next 16 made the cacheLife
 * profile required and the one-arg form is a type error. 'max' gives
 * stale-while-revalidate, so an editor who hits Publish sees the change on
 * the next request or the one after, not instantly. updateTag would be
 * immediate but it's Server-Actions-only, so it can't be used here.
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

  let payload: { post_type?: string; slug?: string }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { post_type: postType, slug } = payload
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

    // The options page isn't a post type; revalidate.php sends this literal.
    // Named here so the constant is what both sides agree on, rather than the
    // string happening to fall through to tags.type() and match.
    case tags.siteSettings:
      bust(tags.siteSettings)
      break

    default:
      bust(tags.type(postType))
      if (slug) bust(tags.typeSlug(postType, slug))
  }

  return NextResponse.json({ revalidated: busted })
}
