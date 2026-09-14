import Link from 'next/link'
import type { ReactNode } from 'react'

// Named for the band they sit on, not by rank — a teal CTA vanishes on teal.
type Variant = 'onCream' | 'onTeal' | 'outline'

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3.5 ' +
  'font-medium tracking-tight transition-colors duration-200 ' +
  'motion-safe:transition-transform motion-safe:hover:-translate-y-px'

const variants: Record<Variant, string> = {
  onCream: 'bg-teal-700 text-canvas hover:bg-teal-800',
  onTeal: 'bg-canvas text-teal-900 hover:bg-paper',
  outline: 'border border-current/35 hover:border-current/70 hover:bg-current/5',
}

export function Button({
  href,
  variant = 'onCream',
  className = '',
  children,
}: {
  href: string
  variant?: Variant
  className?: string
  children: ReactNode
}) {
  const classes = `${base} ${variants[variant]} ${className}`

  // Booking lives on Jane, so plenty of CTAs leave the site.
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
