import type { ElementType, ReactNode } from 'react'

export function Container({
  as: Tag = 'div',
  prose = false,
  className = '',
  children,
}: {
  as?: ElementType
  prose?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <Tag className={`${prose ? 'container-prose' : 'container-x'} ${className}`}>
      {children}
    </Tag>
  )
}

/**
 * Full-bleed colour block. Colour separates the sections, so no cards or
 * borders. Cream is the ground, with paper and tint to alternate against it;
 * teal is punctuation, for the few bands that should stop you.
 */
export function Band({
  tone = 'cream',
  as: Tag = 'section',
  flush = false,
  className = '',
  children,
  ...rest
}: {
  tone?: 'cream' | 'paper' | 'tint' | 'sand' | 'teal' | 'teal-deep'
  as?: ElementType
  /** Skip the vertical rhythm when the band handles its own spacing. */
  flush?: boolean
  className?: string
  children: ReactNode
  id?: string
}) {
  const tones = {
    cream: 'band-cream',
    paper: 'band-paper',
    tint: 'band-tint',
    sand: 'band-sand',
    teal: 'band-teal',
    'teal-deep': 'band-teal-deep',
  } as const

  return (
    <Tag className={`${tones[tone]} ${flush ? '' : 'section-y'} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
