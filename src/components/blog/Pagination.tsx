'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const pageHref = (p: number) => p === 1 ? basePath : `${basePath}?page=${p}`

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      {currentPage > 1 && (
        <Link href={pageHref(currentPage - 1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-sand-300 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-colors">
          <ChevronLeft size={18} />
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={pageHref(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-[0.9375rem] font-semibold transition-colors ${
            p === currentPage
              ? 'bg-teal-500 text-white'
              : 'border border-sand-300 hover:bg-sand-200 text-ink-700'
          }`}
        >
          {p}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={pageHref(currentPage + 1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-sand-300 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-colors">
          <ChevronRight size={18} />
        </Link>
      )}
    </nav>
  )
}
