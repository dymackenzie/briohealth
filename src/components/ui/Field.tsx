import type { CSSProperties, ReactNode } from 'react'

/**
 * A tide field: the deep teal as a large flat area. `data-surface` switches
 * the base rules (paper text, paper focus rings). Straight edges, no radius:
 * the radius token is for photos and buttons. At most three per page.
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
      data-surface="tide"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={`bg-tide text-paper ${className}`}
      style={style}
    >
      {children}
    </Tag>
  )
}
