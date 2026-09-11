import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

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
  const window = new Set([1, totalPages, page - 1, page, page + 1])
  const shown = [...window].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b)

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={href(page - 1)}
          rel="prev"
          aria-label="Previous page"
          className="flex h-11 w-11 items-center justify-center rounded-pill border border-ink-900/15 hover:border-ink-900/40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
      )}

      {shown.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && shown[i - 1] !== n - 1 && (
            <span className="px-1 text-ink-300" aria-hidden>
              …
            </span>
          )}
          <Link
            href={href(n)}
            aria-current={n === page ? 'page' : undefined}
            className={`flex h-11 min-w-11 items-center justify-center rounded-pill px-3 tabular-nums ${
              n === page
                ? 'bg-teal-700 text-canvas'
                : 'border border-ink-900/15 hover:border-ink-900/40'
            }`}
          >
            {n}
          </Link>
        </span>
      ))}

      {page < totalPages && (
        <Link
          href={href(page + 1)}
          rel="next"
          aria-label="Next page"
          className="flex h-11 w-11 items-center justify-center rounded-pill border border-ink-900/15 hover:border-ink-900/40"
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </nav>
  )
}
