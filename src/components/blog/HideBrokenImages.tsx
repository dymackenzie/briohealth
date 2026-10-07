'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * A few old posts link images that 404 on the live host. On `error`
 * (captured, so images inside the server-rendered body count) the image
 * is hidden along with its figure or an otherwise-empty wrapping link;
 * images that failed before hydration are caught on mount. Without
 * JavaScript the alt text shows, which is the browser's own fallback.
 */
export function HideBrokenImages({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const hide = (img: HTMLImageElement) => {
      const figure = img.closest('figure')
      const link = img.closest('a')
      const wrapper = figure ?? (link && link.textContent?.trim() === '' ? link : null)
      ;(wrapper ?? img).hidden = true
    }
    const onError = (event: Event) => {
      if (event.target instanceof HTMLImageElement) hide(event.target)
    }

    root.addEventListener('error', onError, true)
    for (const img of root.querySelectorAll('img')) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) hide(img)
    }
    return () => root.removeEventListener('error', onError, true)
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
