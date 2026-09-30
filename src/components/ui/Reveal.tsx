'use client'

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

/**
 * Fade and rise on scroll. The hidden state lives in motion.css behind the
 * `.js` class, so the page renders complete if JavaScript never runs, and
 * reduced motion turns the transition off in CSS. Sections stagger children
 * with `delay` in 60-80ms steps.
 */
export function Reveal({
  as: Tag = 'div',
  from = 'up',
  delay = 0,
  className = '',
  children,
}: {
  as?: ElementType
  /** `across` is the 24px slide for a photo straddling a field seam. */
  from?: 'up' | 'across'
  delay?: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // If the observer never fires (an odd embed, a zoomed print preview),
    // show it anyway rather than leave a hole.
    const failsafe = window.setTimeout(() => setShown(true), 2500)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal={from}
      data-shown={shown || undefined}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  )
}
