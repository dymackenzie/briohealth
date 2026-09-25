'use client'

import { motion, useScroll, useSpring } from 'motion/react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  // Spring stops the bar twitching on trackpads with momentum.
  const width = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  // clay-300 rather than 600: it starts out over the teal hero, where the
  // darker clay all but disappears.
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-clay-300"
    />
  )
}
