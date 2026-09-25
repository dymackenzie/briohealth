import Link from 'next/link'
import type { ReactNode } from 'react'

// Named for the band they sit on, not by rank — a teal CTA vanishes on teal.
type Variant = 'onCream' | 'onTeal' | 'outline'

// Colour only on hover; no lift. It should feel steady, not springy.
const base =
  'inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3.5 ' +
  'text-body font-medium tracking-tight ' +
  'transition-colors duration-300 ease-[var(--ease-out-expo)]'

// The accent lives on CTAs and almost nowhere else — that's what makes it
// mean "act here". Keep clay off anything that isn't a decision.
const variants: Record<Variant, string> = {
  onCream: 'bg-clay-600 text-canvas hover:bg-clay-700',
  onTeal: 'bg-clay-300 text-ink-900 hover:bg-clay-100',
  outline: 'border border-current/40 hover:border-current hover:bg-current/5',
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
