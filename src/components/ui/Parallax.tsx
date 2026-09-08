'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

/**
 * Only ever moves things. Nothing here can hide content if JS fails —
 * that's what keeps it separate from Reveal.
 */
export function Parallax({
  speed = 0.12,
  className = '',
  children,
}: {
  /** Fraction of the element's height to drift. Negative reverses it. */
  speed?: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 100}%`, `${speed * -100}%`],
  )

  return (
    <motion.div ref={ref} style={reduced ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  )
}

/** Slow zoom-out as the element crosses the viewport. Pairs with masked images. */
export function ScrollZoom({
  from = 1.12,
  to = 1,
  className = '',
  children,
}: {
  from?: number
  to?: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [from, to])

  return (
    <motion.div
      ref={ref}
      style={reduced ? undefined : { scale }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
