import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { groupByMonth, shortDate } from '@/lib/dates'
import { authorName } from '@/lib/wp/queries'
import { decodeTitle, postSummary } from '@/lib/wp/renderContent'
import type { WPPost } from '@/lib/wp/types'

/**
 * The top of the archive's first page, a front page: the newest post on
 * the tide field, the next two side by side under it. No pictures: half
 * the posts have no featured image and the rest are a mix, so the type
 * carries it.
 */
export function PostLead({ posts }: { posts: WPPost[] }) {
  const [lead, ...next] = posts
  if (!lead) return null
  const href = `/blog/${lead.slug}`

  return (
    <>
      <Field as="section" aria-labelledby="lead-post">
        <div className="container-x grid-12 gap-y-5 py-12 lg:py-16">
          <p className="col-span-12 text-meta text-paper">
            <time dateTime={lead.date}>{shortDate(lead.date, true)}</time>
            <span aria-hidden> • </span>
            <span className="sr-only">, </span>
            {authorName(lead)}
          </p>
          <h2 id="lead-post" className="col-span-12 max-w-[18ch] font-serif text-[clamp(2.25rem,4vw,3.75rem)] leading-none font-medium tracking-[-0.02em] lg:col-span-7">
            <Link href={href} className="hover:underline hover:decoration-1 hover:underline-offset-4">
              {decodeTitle(lead.title.rendered)}
            </Link>
          </h2>
          <div className="col-span-12 self-end lg:col-span-4 lg:col-start-9">
            <p className="line-clamp-4">{postSummary(lead, 240)}</p>
            <Button href={href} on="dark" variant="outline" className="mt-6">
              Read the post
            </Button>
          </div>
        </div>
      </Field>

      {next.length > 0 && (
        <ul className="container-x grid gap-x-8 md:grid-cols-2">
          {next.map((post) => (
            <li key={post.id} className="border-b border-ink">
              <Link href={`/blog/${post.slug}`} className="group block py-7">
                <p className="text-meta">
                  <time dateTime={post.date}>{shortDate(post.date, true)}</time>
                </p>
                <h3 className="mt-2 text-h2 text-balance group-hover:text-teal-deep">{decodeTitle(post.title.rendered)}</h3>
                <p className="mt-2 line-clamp-2 text-base text-ink-soft">{postSummary(post, 200)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

/**
 * The rest of the archive: the month in the left columns, its posts in the
 * right, each row the day as a serif numeral, the title, two lines of
 * excerpt and the author. 1px ink rules between rows (a sand hairline
 * vanishes into the grain); no cards.
 */
export function PostList({ posts }: { posts: WPPost[] }) {
  return (
    <div className="container-x">
      {groupByMonth(posts).map((group) => (
        <section key={group.key} aria-labelledby={`month-${group.key}`} className="grid-12 pt-6">
          <h2 id={`month-${group.key}`} className="col-span-12 text-meta lg:col-span-3 lg:pt-7">
            {group.label}
          </h2>
          <ul className="col-span-12 lg:col-span-8 lg:col-start-4">
            {group.items.map((post) => (
              <li key={post.id} className="border-b border-ink">
                <Link href={`/blog/${post.slug}`} className="group grid grid-cols-[3rem_1fr] gap-x-3 py-5 sm:grid-cols-[3.5rem_1fr]">
                  <time dateTime={post.date} className="font-serif text-[2.25rem] leading-none font-medium tracking-[-0.02em]">
                    <span className="sr-only">{shortDate(post.date, true)}</span>
                    <span aria-hidden>{Number(post.date.slice(8, 10))}</span>
                  </time>
                  <div className="min-w-0">
                    <h3 className="text-stat text-balance group-hover:text-teal-deep">{decodeTitle(post.title.rendered)}</h3>
                    <p className="mt-1 line-clamp-2 text-base text-ink-soft">{postSummary(post, 200)}</p>
                    <p className="mt-2 text-meta">{authorName(post)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
