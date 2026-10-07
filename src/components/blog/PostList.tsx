import Image from 'next/image'
import Link from 'next/link'

import { groupByMonth, shortDate } from '@/lib/dates'
import { coverPath } from '@/lib/garden/cover'
import { authorName } from '@/lib/wp/queries'
import { decodeTitle, postSummary } from '@/lib/wp/renderContent'
import type { WPPost } from '@/lib/wp/types'

/**
 * The archive, Substack's way: posts under month headings, each row a bold
 * title, two lines of excerpt and a date-and-author line, with a drawn
 * herb cover as a 3:2 thumbnail on the right (src/lib/garden/cover.ts; the
 * featured images were too mixed, and half the posts have none). 1px ink
 * rules between rows, as in the service rows (a sand hairline vanishes into
 * the grain); no cards.
 */
export function PostList({ posts }: { posts: WPPost[] }) {
  return (
    <div>
      {groupByMonth(posts).map((group) => (
        <section key={group.key} aria-labelledby={`month-${group.key}`}>
          <h2 id={`month-${group.key}`} className="text-meta pt-8 pb-1">
            {group.label}
          </h2>
          <ul>
            {group.items.map((post) => {
              const title = decodeTitle(post.title.rendered)

              return (
                <li key={post.id} className="border-b border-ink">
                  <Link href={`/blog/${post.slug}`} className="group grid grid-cols-[1fr_auto] items-start gap-x-5 py-6 sm:gap-x-6">
                    <div className="min-w-0">
                      <h3 className="line-clamp-3 text-[length:var(--fs-post)] leading-snug font-bold group-hover:text-teal-deep">{title}</h3>
                      <p className="mt-1 line-clamp-2 text-base leading-normal text-ink-soft">{postSummary(post, 200)}</p>
                      <p className="text-meta mt-2">
                        <time dateTime={post.date}>{shortDate(post.date)}</time>
                        <span aria-hidden> • </span>
                        <span className="sr-only">, </span>
                        {authorName(post)}
                      </p>
                    </div>
                    <div className="relative mt-1 aspect-[3/2] w-24 overflow-hidden rounded-brand bg-grey sm:w-40">
                      <Image src={coverPath(post.id)} alt="" width={320} height={213} unoptimized loading="lazy" className="size-full object-cover" />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
