import Link from 'next/link'

import { decodeTitle } from '@/lib/wp/renderContent'
import type { WPCategory } from '@/lib/wp/types'

/**
 * Half the categories hold one or two posts. Offered as filters they are
 * dead ends, and their long names wrap the row. The one you are on stays.
 */
const MIN_POSTS = 3

/** The ten biggest categories as links. The current one is filled ink. */
export function CategoryFilter({ categories, current }: { categories: WPCategory[]; current?: string }) {
  if (categories.length === 0) return null

  const shown = categories.filter((c) => (c.count ?? 0) >= MIN_POSTS || c.slug === current).slice(0, 10)

  const link = (active: boolean) =>
    `inline-flex rounded-brand px-4 py-2 text-small font-medium ${active ? 'bg-ink text-paper' : 'border border-grey hover:border-ink'}`

  return (
    <nav aria-label="Categories">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href="/blog" className={link(!current)} aria-current={!current ? 'page' : undefined}>
            All
          </Link>
        </li>
        {shown.map((category) => (
          <li key={category.id}>
            <Link
              href={`/blog/category/${category.slug}`}
              className={link(category.slug === current)}
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
