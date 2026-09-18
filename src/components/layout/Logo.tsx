import Link from 'next/link'

/**
 * Two files because the mark is two-tone and can't be recoloured with CSS.
 *
 * Both were derived from the social tiles we were given: those are traced SVGs
 * with the tile background baked in, and the letter counters painted in that
 * same background colour instead of left as holes. Here the background is gone
 * and the counters of the b, o and A are cut out with a mask, so whatever band
 * the logo sits on shows through. Replace outright if a clean vector original
 * ever turns up.
 */

const ASPECT = 778 / 650

export function Logo({
  variant = 'white',
  height = 38,
  className = '',
}: {
  variant?: 'white' | 'colour'
  height?: number
  className?: string
}) {
  return (
    <Link
      href="/"
      aria-label="Brio Health — home"
      className={`inline-block shrink-0 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={variant === 'white' ? '/brio-logo-white.svg' : '/brio-logo.svg'}
        alt="Brio Health"
        width={Math.round(height * ASPECT)}
        height={height}
        style={{ height, width: 'auto' }}
      />
    </Link>
  )
}
