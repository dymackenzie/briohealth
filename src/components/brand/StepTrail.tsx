'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'

/**
 * A dotted trail threading the three plan steps, drawn as you scroll past.
 *
 * The anchors have to be inline — the trail is measured off their boxes, and a
 * block-level anchor reports the whole column, which leaves no gap to draw in.
 *
 * The steps are the one genuinely ordered thing on the page, so the sequence
 * is worth showing rather than just numbering. It's built from the logo's
 * radiating dots — same language as DotBurst and DotRule — so it reads as the
 * brand drawing a line between its own steps, not as a decorative squiggle.
 *
 * Anchors are measured from the DOM rather than guessed from the grid. The
 * steps sit at three different vertical offsets that change at every
 * breakpoint, and a connector that misses what it connects looks like a bug.
 */

const DOT_SPACING = 26

// Clearance either side of a numeral. The trail lives in the gaps between the
// steps and never crosses a glyph — a dotted line running through "02" reads
// as a strikethrough, not as a connector.
const CLEARANCE = 18

// Dots finish landing before the section leaves the viewport. At a full 0-1
// spread the last one needs a scroll position the reader never reaches.
const TRAIL_SPAN = 0.78

export function StepTrail({
  anchor = '[data-trail-anchor]',
  className = '',
  children,
}: {
  /** Selector for the points to thread, in order. */
  anchor?: string
  className?: string
  children: ReactNode
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const probe = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()

  const [box, setBox] = useState({ w: 0, h: 0 })
  const [d, setD] = useState('')
  const [dots, setDots] = useState<{ x: number; y: number }[]>([])

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ['start 85%', 'end 65%'],
  })

  useEffect(() => {
    const node = wrap.current
    if (!node) return

    const measure = () => {
      const points = [...node.querySelectorAll<HTMLElement>(anchor)].map((el) => {
        const { x, y } = offsetWithin(el, node)
        return {
          left: x,
          right: x + el.offsetWidth,
          y: y + el.offsetHeight / 2,
        }
      })

      setBox({ w: node.offsetWidth, h: node.offsetHeight })
      setD(points.length < 2 ? '' : gapTrail(points))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [anchor])

  // Sample the finished curve so the dots sit evenly along it whatever shape
  // the breakpoint gave it.
  useEffect(() => {
    const path = probe.current
    if (!path || !d) return setDots([])

    const length = path.getTotalLength()
    const count = Math.max(2, Math.round(length / DOT_SPACING))
    setDots(
      Array.from({ length: count + 1 }, (_, i) => {
        const p = path.getPointAtLength((length / count) * i)
        return { x: p.x, y: p.y }
      }),
    )
  }, [d])

  return (
    <div ref={wrap} className={`relative ${className}`}>
      {d && (
        <svg
          viewBox={`0 0 ${box.w} ${box.h}`}
          width={box.w}
          height={box.h}
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute inset-0 z-0 hidden text-teal-300 md:block"
        >
          <path ref={probe} d={d} fill="none" stroke="none" />
          {dots.map((dot, i) => (
            <TrailDot
              key={i}
              x={dot.x}
              y={dot.y}
              at={(i / Math.max(1, dots.length - 1)) * TRAIL_SPAN}
              progress={scrollYProgress}
              still={!!reduced}
            />
          ))}
        </svg>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function TrailDot({
  x,
  y,
  at,
  progress,
  still,
}: {
  x: number
  y: number
  at: number
  progress: MotionValue<number>
  still: boolean
}) {
  // Each dot lands just after the one before it, so the trail draws rather
  // than fading in all at once.
  const window = 0.12
  const opacity = useTransform(progress, [at, at + window], [0, 0.55])
  const r = useTransform(progress, [at, at + window], [0, 2.6])

  if (still) return <circle cx={x} cy={y} r={2.6} fill="currentColor" opacity={0.55} />

  return <motion.circle cx={x} cy={y} r={r} fill="currentColor" style={{ opacity }} />
}

/**
 * Position of an anchor inside the wrapper, in layout coordinates.
 *
 * getBoundingClientRect would be simpler but it includes transforms, and the
 * steps are wrapped in Reveal — so at mount every anchor is still shifted down
 * by the reveal offset and the trail gets drawn below the numerals it is meant
 * to connect. offsetTop/offsetLeft ignore transforms, so the measurement is
 * the same before and after the reveal runs.
 */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0
  let y = 0

  for (let node: HTMLElement | null = el; node && node !== root; ) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }

  return { x, y }
}

/**
 * One curve per gap, each its own subpath. The moves between subpaths have no
 * length, so sampling by getPointAtLength lays dots along the gaps in order and
 * puts none on the numerals themselves.
 */
function gapTrail(points: { left: number; right: number; y: number }[]): string {
  const segments: string[] = []

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const from = { x: a.right + CLEARANCE, y: a.y }
    const to = { x: b.left - CLEARANCE, y: b.y }
    if (to.x - from.x < DOT_SPACING) continue

    // Enough bow to read as drawn by hand, not enough to climb into the
    // image sitting above the numerals.
    const lift = Math.min(20, (to.x - from.x) * 0.09)
    segments.push(
      `M ${from.x} ${from.y}` +
        ` C ${from.x + (to.x - from.x) * 0.35} ${from.y - lift},` +
        ` ${from.x + (to.x - from.x) * 0.65} ${to.y - lift},` +
        ` ${to.x} ${to.y}`,
    )
  }

  return segments.join(' ')
}
