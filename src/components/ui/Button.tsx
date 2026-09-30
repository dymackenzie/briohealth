import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

/**
 * Named for the surface they sit on. CTA on light grounds is ink with paper
 * text (17:1); on teal it is paper with ink text. Teal never carries a label.
 * The quiet link is teal-deep on light and on-teal on a field: paper is for
 * display type only. Pressing moves it 1px; the hover colour changes
 * instantly, because only transform animates. The primary label is 3 words
 * at most so it never wraps at desktop.
 */

type Surface = 'light' | 'teal'
type Variant = 'primary' | 'quiet'

const primaryBase =
  'inline-flex items-center justify-center gap-2 rounded-brand px-6 py-3.5 font-medium leading-none whitespace-nowrap ' +
  'transition-transform duration-200 active:translate-y-px disabled:opacity-60 disabled:active:translate-y-0'

const primaryFill: Record<Surface, string> = {
  light: 'bg-ink text-paper hover:bg-ink-soft',
  teal: 'bg-paper text-ink hover:bg-grey',
}

const quietBase =
  'group inline-flex items-center gap-1.5 font-medium underline underline-offset-4 decoration-1 hover:decoration-2'

const quietColour: Record<Surface, string> = {
  light: 'text-teal-deep',
  teal: 'text-on-teal',
}

export function Button({
  href,
  on = 'light',
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  children,
}: {
  href?: string
  on?: Surface
  variant?: Variant
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  children: ReactNode
}) {
  const classes =
    variant === 'primary'
      ? `${primaryBase} ${primaryFill[on]} ${className}`
      : `${quietBase} ${quietColour[on]} ${className}`

  const content =
    variant === 'quiet' ? (
      <>
        {children}
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
      </>
    ) : (
      children
    )

  if (!href) {
    return (
      <button type={type} disabled={disabled} className={classes}>
        {content}
      </button>
    )
  }

  // Booking lives on Jane, so plenty of CTAs leave the site.
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
