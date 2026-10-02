'use client'

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

const FAILSAFE_MS = 2500

/**
 * Calls `show` once `node` scrolls into view and returns the cleanup.
 * An observer always calls back once on observe(), even for an element
 * below the fold, so that first delivery cancels the failsafe: the timer
 * only rescues an observer that never calls back at all (an odd embed, a
 * zoomed print preview). Without IntersectionObserver it shows at once.
 */
export function watchReveal(node: Element, show: () => void): () => void {
  if (!('IntersectionObserver' in globalThis)) {
    show()
    return () => {}
  }

  let failsafe: ReturnType<typeof setTimeout> | undefined = setTimeout(show, FAILSAFE_MS)
  const cancelFailsafe = () => {
    clearTimeout(failsafe)
    failsafe = undefined
  }

  const observer = new IntersectionObserver(
    (entries) => {
      cancelFailsafe()
      if (entries.some((entry) => entry.isIntersecting)) {
        show()
        observer.disconnect()
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  )
  observer.observe(node)

  return () => {
    observer.disconnect()
    cancelFailsafe()
  }
}

/**
 * Fade and rise on scroll. The hidden state lives in motion.css behind the
 * `.js` class, so the page renders complete if JavaScript never runs, and
 * reduced motion turns the transition off in CSS. Sections stagger children
 * with `delay` in 60-80ms steps.
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  'aria-hidden': ariaHidden,
  children,
}: {
  as?: ElementType
  delay?: number
  className?: string
  'aria-hidden'?: boolean | 'true'
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    return watchReveal(node, () => setShown(true))
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal="up"
      data-shown={shown || undefined}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
      className={className}
      aria-hidden={ariaHidden}
    >
      {children}
    </Tag>
  )
}
