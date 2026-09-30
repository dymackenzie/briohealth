import Link from 'next/link'

/**
 * The mark is two-tone (ink wordmark, teal dots), so it is an <img>, not an
 * inline SVG that could be recoloured. It only ever sits on paper or grey.
 */
const ASPECT = 778 / 650

export function Logo({ height = 40, className = '' }: { height?: number; className?: string }) {
  return (
    <Link href="/" aria-label="Brio Health, home" className={`inline-block shrink-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brio-logo.svg"
        alt="Brio Health"
        width={Math.round(height * ASPECT)}
        height={height}
        style={{ height, width: 'auto' }}
      />
    </Link>
  )
}
