import type { CSSProperties, ReactNode } from 'react'

/**
 * A teal field: the logo colour at full saturation as a large flat area.
 * `data-surface` switches the base rules (on-teal body, paper display text,
 * paper focus rings). Straight edges, no radius: the radius token is for
 * photos and buttons. At most three per page.
 */
export function Field({
  as: Tag = 'div',
  className = '',
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
}: {
  as?: 'div' | 'section' | 'aside'
  className?: string
  style?: CSSProperties
  'aria-label'?: string
  'aria-labelledby'?: string
  children: ReactNode
}) {
  return (
    <Tag
      data-surface="teal"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={`bg-teal text-on-teal ${className}`}
      style={style}
    >
      {children}
    </Tag>
  )
}
