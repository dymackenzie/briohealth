import Image from 'next/image'
import Link from 'next/link'

import { Figure } from '@/components/ui/Figure'
import { decodeTitle, plainExcerpt } from '@/lib/wp/renderContent'
import { featuredImage, postCategories } from '@/lib/wp/queries'
import type { WPPost } from '@/lib/wp/types'

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function Meta({ post }: { post: WPPost }) {
  const category = postCategories(post)[0]

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-ink-500">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {category && (
        <>
          <span aria-hidden className="opacity-50">
            ·
          </span>
          <span>{decodeTitle(category.name)}</span>
        </>
      )}
    </div>
  )
}

function Cover({
  post,
  aspect,
  sizes,
  load,
}: {
  post: WPPost
  aspect: '4 / 3' | '3 / 2'
  sizes: string
  /** The featured cover is the LCP and gets a preload; the first row of cards
   * only needs to skip lazy loading. */
  load: 'preload' | 'eager' | 'lazy'
}) {
  const image = featuredImage(post)

  if (!image) {
    return (
      <Figure
        subject={decodeTitle(post.title.rendered)}
        tone="sandLight"
        aspect={aspect}
        compact
      />
    )
  }

  return (
    <div style={{ aspectRatio: aspect }} className="relative overflow-hidden rounded-photo bg-sand-200">
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={load === 'preload'}
        loading={load === 'eager' ? 'eager' : undefined}
        className="media-zoom object-cover"
      />
    </div>
  )
}

/**
 * `featured` is the newest post on the first page: a wide row with the title
 * set as a headline, and the one place the index breaks its grid.
 */
export function PostCard({
  post,
  eager = false,
  featured = false,
}: {
  post: WPPost
  eager?: boolean
  featured?: boolean
}) {
  const title = decodeTitle(post.title.rendered)

  if (featured) {
    return (
      <article className="media-hover group">
        <Link
          href={`/blog/${post.slug}`}
          className="grid gap-7 lg:grid-cols-12 lg:items-center lg:gap-12"
        >
          <div className="lg:col-span-7">
            <Cover
              post={post}
              aspect="3 / 2"
              load={eager ? 'preload' : 'lazy'}
              sizes="(min-width: 1200px) 680px, (min-width: 1024px) 58vw, 100vw"
            />
          </div>

          <div className="lg:col-span-5">
            <Meta post={post} />
            <h2 className="mt-4 text-h2 transition-colors duration-300 group-hover:text-clay-600">
              {title}
            </h2>
            <p className="mt-5 text-ink-700">{plainExcerpt(post.excerpt.rendered, 200)}</p>
            <span className="link-draw mt-6 inline-block font-medium text-teal-700">
              Read the post
            </span>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="media-hover group">
      <Link href={`/blog/${post.slug}`} className="block">
        <Cover
          post={post}
          aspect="4 / 3"
          load={eager ? 'eager' : 'lazy'}
          sizes="(min-width: 1200px) 370px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"
        />

        <div className="mt-5">
          <Meta post={post} />
        </div>

        <h3 className="mt-2 text-h3 transition-colors duration-300 group-hover:text-clay-600">
          {title}
        </h3>

        <p className="mt-3 text-ink-700">{plainExcerpt(post.excerpt.rendered, 140)}</p>
      </Link>
    </article>
  )
}
