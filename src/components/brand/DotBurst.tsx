import type { CSSProperties } from 'react'

/**
 * The logo's radiating dots, drawn from the same geometry: fifteen dots fanning
 * up from the "i" dot at seven radii, up to 56 degrees either side of
 * vertical, shrinking as they go out. It is the site's signature. Placed
 * as a Bud (src/components/brand/Bud.tsx): three per page at most,
 * scattered, varied sizes.
 *
 * Static by itself. With `animate`, the `burst` keyframes in motion.css
 * scale each dot in from the origin at a 40ms stagger, inner ring first;
 * `--i` on each circle is that order. No JavaScript, and without the `.js` class or with reduced motion
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

/**
 * The point the fan radiates from, fitted to the logo. It sits below the
 * droplet, not on it; the 100x72 box hugs the ink with about 2 units spare.
 */
export const BURST_ORIGIN = { x: 50, y: 79 }
const R = 74

/** The logo's own i-dot, mapped into this box with the same origin and R. */
const DROPLET =
  'M49.8 40.6 C50.9 41.6 51.7 42.6 52.4 43.8 C52.7 44.2 52.9 44.6 53.2 44.9 C53.3 45.1 53.4 45.3 53.5 45.5 ' +
  'C53.9 46.0 54.2 46.5 54.6 47.1 C55.8 48.8 56.9 50.5 57.8 52.4 C57.9 52.6 58.0 52.7 58.1 52.9 ' +
  'C59.6 55.9 60.0 59.9 59.0 63.1 C57.7 66.0 55.7 67.7 52.8 68.9 C49.7 69.7 47.3 69.0 44.6 67.5 ' +
  'C42.7 66.3 41.3 64.3 40.7 62.2 C39.5 55.7 43.0 50.5 46.5 45.5 C46.9 44.9 47.3 44.4 47.6 43.8 ' +
  'C48.4 42.7 49.1 41.7 49.8 40.6Z'

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
  /** The teardrop i-dot at the foot of the fan. */
  droplet?: boolean
  animate?: 'load' | 'reveal'
}) {
  return (
    <svg
      viewBox="0 0 100 72"
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
      {droplet && <path d={DROPLET} />}
    </svg>
  )
}
