import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const step = 'group inline-flex min-h-11 items-center gap-2 font-medium text-teal-700'

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number
  totalPages: number
  basePath: string
}) {
  if (totalPages <= 1) return null

  const href = (n: number) => (n === 1 ? basePath : `${basePath}?page=${n}`)

  // 34 pages of posts, so show a window rather than every number.
  const nearby = new Set([1, totalPages, page - 1, page, page + 1])
  const shown = [...nearby].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b)

  // Newest first, so "next" is older. Named for what you get, not the direction.
  return (
    <nav
      aria-label="Pagination"
      className="mt-20 grid grid-cols-2 items-center gap-y-6 border-t border-ink-900/15 pt-8 sm:flex sm:justify-between"
    >
      <div>
        {page > 1 && (
          <Link href={href(page - 1)} rel="prev" className={step}>
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1"
              aria-hidden
            />
            <span className="link-draw">Newer posts</span>
          </Link>
        )}
      </div>

      <ol className="order-first col-span-2 flex items-center justify-center gap-1 sm:order-none">
        {shown.map((n, i) => (
          <li key={n} className="flex items-center gap-1">
            {i > 0 && shown[i - 1] !== n - 1 && (
              <span className="px-1 text-ink-500" aria-hidden>
                …
              </span>
            )}
            {n === page ? (
              <span
                aria-current="page"
                className="flex h-11 min-w-11 items-center justify-center rounded-pill bg-clay-600 px-3 font-medium text-canvas tabular-nums"
              >
                <span className="sr-only">Page </span>
                {n}
              </span>
            ) : (
              <Link
                href={href(n)}
                className="flex h-11 min-w-11 items-center justify-center rounded-pill px-3 text-ink-700 tabular-nums transition-colors duration-300 hover:bg-clay-100 hover:text-clay-700"
              >
                <span className="sr-only">Page </span>
                {n}
              </Link>
            )}
          </li>
        ))}
      </ol>

      <div className="text-right">
        {page < totalPages && (
          <Link href={href(page + 1)} rel="next" className={step}>
            <span className="link-draw">Older posts</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        )}
      </div>
    </nav>
  )
}
