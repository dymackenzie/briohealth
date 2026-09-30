import type { CSSProperties } from 'react'

/**
 * The logo's radiating dots, drawn from the same geometry: fifteen dots fanning
 * up from the "i" dot at seven radii, up to 56 degrees either side of
 * vertical, shrinking as they go out. It is the site's signature and appears
 * at most three times on a page.
 *
 * Static by itself. With `animate`, Task 15's CSS scales each dot in from the
 * origin at a 40ms stagger, inner ring first; `--i` on each circle is that
 * order. No JavaScript, and without the `.js` class or with reduced motion
 * the dots are simply there.
 */

/** [degrees from straight up, radius as a fraction of R, dot radius as a fraction of R] */
const DOTS: readonly (readonly [number, number, number])[] = [
  [-28, 0.48, 0.062],
  [28, 0.48, 0.062],
  [-45, 0.59, 0.05],
  [45, 0.59, 0.05],
  [-15, 0.6, 0.063],
  [15, 0.6, 0.063],
  [0, 0.65, 0.063],
  [-56, 0.73, 0.04],
  [56, 0.73, 0.04],
  [-22, 0.77, 0.05],
  [22, 0.77, 0.05],
  [0, 0.83, 0.05],
  [-27, 0.93, 0.04],
  [27, 0.93, 0.04],
  [0, 1, 0.04],
]

/** The i-dot sits near the bottom of a 100x100 box; the fan fills the top. */
export const BURST_ORIGIN = { x: 50, y: 92 }
const R = 74

const POINTS = DOTS.map(([deg, radius, size]) => {
  const angle = ((deg - 90) * Math.PI) / 180
  return {
    x: BURST_ORIGIN.x + Math.cos(angle) * radius * R,
    y: BURST_ORIGIN.y + Math.sin(angle) * radius * R,
    r: size * R,
    radius,
  }
}).sort((a, b) => a.radius - b.radius)

export function DotBurst({
  className = '',
  droplet = true,
  animate,
}: {
  className?: string
  /** The teardrop i-dot at the origin. */
  droplet?: boolean
  animate?: 'load' | 'reveal'
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`dotburst ${className}`}
      data-animate={animate}
    >
      {POINTS.map((p, i) => (
        <circle
          key={i}
          cx={p.x.toFixed(2)}
          cy={p.y.toFixed(2)}
          r={p.r.toFixed(2)}
          style={{ '--i': i } as CSSProperties}
        />
      ))}
      {droplet && (
        <path d="M50 70 C50 70 43.5 80 43.5 86 a6.5 6.5 0 0 0 13 0 c0-6-6.5-16-6.5-16z" />
      )}
    </svg>
  )
}
