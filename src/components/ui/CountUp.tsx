'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The real figure is server-rendered and only gets overwritten once the
 * animation starts, so crawlers and no-JS visitors see the right number.
 */
export function CountUp({
  value,
  suffix = '',
  duration = 1100,
  className = '',
}: {
  value: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
          setDisplay(Math.round(value * eased))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>
        {display.toLocaleString('en-CA')}
        {suffix}
      </span>
      <span className="sr-only">
        {value.toLocaleString('en-CA')}
        {suffix}
      </span>
    </span>
  )
}
