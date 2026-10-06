import Link from 'next/link'

import { decodeTitle } from '@/lib/wp/renderContent'
import type { WPCategory } from '@/lib/wp/types'

/**
 * Half the categories hold one or two posts. Offered as filters they are
 * dead ends, and their long names wrap the row. The one you are on stays.
 */
const MIN_POSTS = 3

/**
 * The ten biggest categories as Substack-style tabs: plain labels, the
 * current one filled sand. From sm they wrap; on phones the row scrolls
 * sideways inside its own box (touch scrolls it; the page never does), so
 * a mouse never meets a strip it can't scroll.
 */
export function CategoryFilter({ categories, current }: { categories: WPCategory[]; current?: string }) {
  if (categories.length === 0) return null

  const shown = categories.filter((c) => (c.count ?? 0) >= MIN_POSTS || c.slug === current).slice(0, 10)

  const tab = (active: boolean) =>
    `inline-flex rounded-brand px-3 py-1.5 text-small font-medium whitespace-nowrap ${active ? 'bg-grey text-ink' : 'text-ink-soft hover:text-ink'}`

  return (
    <nav aria-label="Categories" className="max-w-full overflow-x-auto [scrollbar-width:none] sm:overflow-visible">
      <ul className="flex gap-1 sm:-ml-3 sm:flex-wrap">
        <li>
          <Link href="/blog" className={tab(!current)} aria-current={!current ? 'page' : undefined}>
            All
          </Link>
        </li>
        {shown.map((category) => (
          <li key={category.id}>
            <Link
              href={`/blog/category/${category.slug}`}
              className={tab(category.slug === current)}
              aria-current={category.slug === current ? 'page' : undefined}
            >
              {decodeTitle(category.name)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
