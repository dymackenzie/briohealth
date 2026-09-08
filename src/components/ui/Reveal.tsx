'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

/**
 * Fade/slide in on scroll. The hidden state lives in CSS behind a `js` class
 * (see globals.css) so the page still renders if JS never runs.
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  from = 'up',
  className = '',
  children,
}: {
  as?: ElementType
  delay?: number
  from?: 'up' | 'left' | 'right' | 'scale'
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Reduced motion is handled in CSS, so the observer can run either way.
    const failsafe = window.setTimeout(() => setShown(true), 2500)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
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
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  )
}
