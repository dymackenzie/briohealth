/**
 * The radiating dots from the logo, reused as the site's ornament.
 * Keep it to two or three per page — it stops working as wallpaper.
 */

interface Ring {
  radius: number
  dot: number
  count: number
  /** Rotates this ring so its dots sit between the previous ring's. */
  offset?: number
  opacity?: number
}

const RINGS: Ring[] = [
  { radius: 22, dot: 4.4, count: 5, opacity: 1 },
  { radius: 38, dot: 3.2, count: 5, offset: 0.5, opacity: 0.85 },
  { radius: 54, dot: 2.2, count: 5, opacity: 0.6 },
]

// The fan opens upward; y grows downward in SVG space.
const ARC_START = 200
const ARC_END = 340

function dots(rings: Ring[]) {
  const out: { x: number; y: number; r: number; opacity: number }[] = []

  for (const ring of rings) {
    const step = (ARC_END - ARC_START) / (ring.count - 1)

    for (let i = 0; i < ring.count; i++) {
      const degrees = ARC_START + step * (i + (ring.offset ?? 0))
      if (degrees > ARC_END) continue

      const radians = (degrees * Math.PI) / 180
      out.push({
        x: 50 + Math.cos(radians) * ring.radius,
        y: 62 + Math.sin(radians) * ring.radius,
        r: ring.dot,
        opacity: ring.opacity ?? 1,
      })
    }
  }

  return out
}

// Same geometry every time, and the burst renders about eleven times a page.
const BURST = dots(RINGS)

export function DotBurst({
  droplet = true,
  className,
  color = 'currentColor',
}: {
  droplet?: boolean
  className?: string
  color?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill={color}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {BURST.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} opacity={d.opacity} />
      ))}
      {droplet && (
        <path d="M50 58 C50 58 42 68 42 74 a8 8 0 0 0 16 0 c0-6-8-16-8-16z" />
      )}
    </svg>
  )
}

/** A row of dots tapering out from the middle. Softer than a rule. */
export function DotRule({
  className,
  color = 'currentColor',
  count = 9,
}: {
  className?: string
  color?: string
  count?: number
}) {
  const mid = (count - 1) / 2

  return (
    <svg
      viewBox={`0 0 ${count * 12} 12`}
      fill={color}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {Array.from({ length: count }, (_, i) => {
        const falloff = 1 - Math.abs(i - mid) / (mid + 1)
        return (
          <circle
            key={i}
            cx={i * 12 + 6}
            cy={6}
            r={1.2 + falloff * 2.2}
            opacity={0.3 + falloff * 0.7}
          />
        )
      })}
    </svg>
  )
}
