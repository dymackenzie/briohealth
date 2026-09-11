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

export function PostCard({ post, priority = false }: { post: WPPost; priority?: boolean }) {
  const image = featuredImage(post)
  const category = postCategories(post)[0]

  return (
    <article className="media-hover group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="overflow-hidden rounded-lg">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt}
              width={image.width ?? 800}
              height={image.height ?? 600}
              priority={priority}
              sizes="(min-width: 1200px) 360px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="media-zoom aspect-[4/3] w-full object-cover"
            />
          ) : (
            <Figure
              subject={decodeTitle(post.title.rendered)}
              shape="soft"
              tone="sandLight"
              aspect="4 / 3"
              compact
            />
          )}
        </div>

        <div className="mt-4 flex items-center gap-3 text-[0.8rem] text-ink-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {category && (
            <>
              <span className="opacity-40">·</span>
              <span>{decodeTitle(category.name)}</span>
            </>
          )}
        </div>

        <h3 className="mt-2 text-[1.2rem] leading-snug transition-colors group-hover:text-teal-700">
          {decodeTitle(post.title.rendered)}
        </h3>

        <p className="mt-3 text-[0.95rem] text-ink-500">
          {plainExcerpt(post.excerpt.rendered, 140)}
        </p>
      </Link>
    </article>
  )
}
