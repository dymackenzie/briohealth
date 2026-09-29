import Link from 'next/link'

import { decodeTitle } from '@/lib/wp/renderContent'
import type { WPCategory } from '@/lib/wp/types'

const chip =
  'inline-flex min-h-11 items-center gap-2 rounded-pill px-4 py-2 text-small font-medium'

const idle =
  `${chip} border border-ink-900/20 text-ink-700 transition-colors duration-300 ` +
  'hover:border-teal-700 hover:text-teal-700'

const current = `${chip} bg-teal-700 text-canvas`

/** Shared by the index and the category pages, so "All" and the active topic
 * always sit in the same place. */
export function CategoryNav({
  categories,
  active,
  limit = 10,
}: {
  categories: WPCategory[]
  /** Slug of the category being viewed; none means the full index. */
  active?: string
  limit?: number
}) {
  if (categories.length === 0) return null

  // The busiest topics, plus the one you're on if it's further down the list.
  const shown = categories.filter((c, i) => i < limit || c.slug === active)

  return (
    <nav aria-label="Blog topics">
      <ul className="flex flex-wrap gap-2.5">
        <li>
          {active ? (
            <Link href="/blog" className={idle}>
              All posts
            </Link>
          ) : (
            <span aria-current="page" className={current}>
              All posts
            </span>
          )}
        </li>
        {shown.map((category) => {
          const isActive = category.slug === active
          return (
            <li key={category.id}>
              <Link
                href={`/blog/category/${category.slug}`}
                aria-current={isActive ? 'page' : undefined}
                className={isActive ? current : idle}
              >
                {decodeTitle(category.name)}
                <span className={`tabular-nums ${isActive ? 'text-canvas/75' : 'text-ink-500'}`}>
                  {category.count}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
