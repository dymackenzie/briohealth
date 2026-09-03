'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CategoryFilterProps {
  categories: any[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const pathname = usePathname()
  const isAll = pathname === '/blog'

  return (
    <div className="flex flex-wrap gap-2" role="navigation" aria-label="Filter by category">
      <Link
        href="/blog"
        className={`px-4 py-2 rounded-[var(--r-pill)] text-[0.875rem] font-semibold transition-colors ${
          isAll ? 'bg-teal-500 text-white' : 'bg-sand-200 text-ink-700 hover:bg-sand-300'
        }`}
      >
        All
      </Link>
      {categories.map((cat) => {
        const active = pathname === `/blog/category/${cat.slug?.current}`
        return (
          <Link
            key={cat._id}
            href={`/blog/category/${cat.slug?.current}`}
            className={`px-4 py-2 rounded-[var(--r-pill)] text-[0.875rem] font-semibold transition-colors ${
              active ? 'bg-teal-500 text-white' : 'bg-sand-200 text-ink-700 hover:bg-sand-300'
            }`}
          >
            {cat.title}
          </Link>
        )
      })}
    </div>
  )
}
