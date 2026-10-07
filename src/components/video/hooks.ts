'use client'

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

const noSubscribe = () => () => {}

/** False on the server and during hydration, true after. No setState in an effect. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  )
}

/** A live media query; false on the server. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Whether at least `threshold` of the node is in the viewport. */
export function useInView(ref: RefObject<Element | null>, threshold: number): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting && entry.intersectionRatio >= threshold)
      },
      { threshold: [0, threshold] },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, threshold])

  return inView
}

/** True once the page has loaded and the browser has gone idle; false on the server. */
export function usePageIdle(): boolean {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let handle = 0
    const done = () => setIdle(true)
    const wait = () => {
      handle = typeof requestIdleCallback === 'function' ? requestIdleCallback(done, { timeout: 2000 }) : window.setTimeout(done, 200)
    }
    if (document.readyState === 'complete') wait()
    else window.addEventListener('load', wait, { once: true })
    return () => {
      window.removeEventListener('load', wait)
      if (typeof cancelIdleCallback === 'function') cancelIdleCallback(handle)
      else clearTimeout(handle)
    }
  }, [])

  return idle
}
