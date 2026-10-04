import Image from 'next/image'
import Link from 'next/link'

import { featuredImage, postCategories } from '@/lib/wp/queries'
import { decodeTitle, postSummary } from '@/lib/wp/renderContent'
import type { WPPost } from '@/lib/wp/types'

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * An editorial list, not a card grid: date and category, title, excerpt,
 * and the featured image as a 1/1 thumbnail on the right, small on phones
 * so a row stays one glance. Posts without an image take the full width.
 */
export function PostList({ posts }: { posts: WPPost[] }) {
  return (
    <ul className="border-t border-grey">
      {posts.map((post) => {
        const image = featuredImage(post)
        const category = postCategories(post)[0]
        const title = decodeTitle(post.title.rendered)

        return (
          <li key={post.id} className="border-b border-grey">
            <Link
              href={`/blog/${post.slug}`}
              className={`group grid items-start gap-x-5 py-6 sm:gap-x-8 ${image ? 'grid-cols-[1fr_4.5rem] sm:grid-cols-[1fr_9rem]' : ''}`}
            >
              <div>
                <p className="text-small text-ink-soft">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  {category && <span className="ml-3">{decodeTitle(category.name)}</span>}
                </p>
                <h2 className="mt-2 font-sans text-h3 group-hover:text-teal-deep">{title}</h2>
                <p className="mt-2 max-w-[60ch] text-ink-soft">{postSummary(post, 150)}</p>
              </div>
              {image && (
                <div className="relative mt-1 aspect-square overflow-hidden rounded-brand bg-grey">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 640px) 144px, 72px"
                    className="object-cover"
                  />
                </div>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
