import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

/**
 * The primary action is clay with an ink label (about 5.7:1) on every
 * surface, and only "Book Appointment" and "Get Started" are primary;
 * nothing else on the site is clay except the nav underline and the trust
 * marks. The outline button is the secondary (form submits included): a 2px
 * border in the surface's text colour. On light it hovers with an ink tint,
 * which shows on paper and on grey alike. The quiet link is teal-deep on light, on-teal on a
 * field, paper on the ink wash. Pressing moves the button 1px; colour
 * changes are instant, because only transform animates. Labels are three
 * words at most so none wraps at desktop. Buttons stay Funnel Sans.
 */

type Surface = 'light' | 'teal' | 'dark'
type Variant = 'primary' | 'quiet' | 'outline'

const solidBase =
  'inline-flex items-center justify-center gap-2 rounded-brand px-6 py-3.5 font-medium leading-none whitespace-nowrap ' +
  'transition-transform duration-200 active:translate-y-px disabled:opacity-60 disabled:active:translate-y-0'

const primaryFill = 'bg-clay text-ink hover:opacity-90'

const outlineColour: Record<Surface, string> = {
  light: 'border-2 border-ink text-ink hover:bg-ink/5',
  teal: 'border-2 border-on-teal text-on-teal hover:bg-paper/15',
  dark: 'border-2 border-paper text-paper hover:bg-paper/15',
}

const quietBase =
  'group inline-flex items-center gap-1.5 font-medium underline underline-offset-4 decoration-1 hover:decoration-2'

const quietColour: Record<Surface, string> = {
  light: 'text-teal-deep',
  teal: 'text-on-teal',
  dark: 'text-paper',
}

export function Button({
  href,
  on = 'light',
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  children,
}: {
  href?: string
  on?: Surface
  variant?: Variant
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  className?: string
  children: ReactNode
}) {
  const classes =
    variant === 'primary'
      ? `${solidBase} ${primaryFill} ${className}`
      : variant === 'outline'
        ? `${solidBase} ${outlineColour[on]} ${className}`
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
      <button type={type} disabled={disabled} onClick={onClick} className={classes}>
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
