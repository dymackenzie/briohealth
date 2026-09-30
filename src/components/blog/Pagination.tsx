import Link from 'next/link'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react/dist/ssr'

export function Pagination({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null

  const href = (n: number) => (n === 1 ? basePath : `${basePath}?page=${n}`)
  const nearby = new Set([1, totalPages, page - 1, page, page + 1])
  const shown = [...nearby].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b)

  const cell = 'flex h-11 min-w-11 items-center justify-center rounded-brand px-3 tabular-nums'

  return (
    <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={href(page - 1)}
          rel="prev"
          aria-label="Previous page"
          className={`${cell} border border-grey hover:border-ink`}
        >
          <ArrowLeft size={18} aria-hidden />
        </Link>
      )}
      {shown.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && shown[i - 1] !== n - 1 && (
            <span className="px-1 text-ink-soft" aria-hidden>
              {'…'}
            </span>
          )}
          <Link
            href={href(n)}
            aria-current={n === page ? 'page' : undefined}
            className={`${cell} ${n === page ? 'bg-ink text-paper' : 'border border-grey hover:border-ink'}`}
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
          className={`${cell} border border-grey hover:border-ink`}
        >
          <ArrowRight size={18} aria-hidden />
        </Link>
      )}
    </nav>
  )
}
