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

/** Full-bleed colour block. Colour separates the sections, so no cards or borders. */
export function Band({
  tone = 'cream',
  as: Tag = 'section',
  flush = false,
  className = '',
  children,
  ...rest
}: {
  tone?: 'cream' | 'sand' | 'teal' | 'teal-deep'
  as?: ElementType
  /** Skip the vertical rhythm when the band handles its own spacing. */
  flush?: boolean
  className?: string
  children: ReactNode
  id?: string
}) {
  const tones = {
    cream: 'band-cream',
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
