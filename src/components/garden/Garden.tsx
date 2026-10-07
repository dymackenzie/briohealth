'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { LoopPauseButton, useLoopGates } from '@/components/video/LoopVideo'
import { GARDEN } from '@/lib/garden/config'
import { gardenStartMode } from '@/lib/garden/gates'
import type { GardenHandle } from './engine'
import { StillPicture } from './StillPicture'

/** How far the teal floor runs on below the box: room for the pause button, so no root has to avoid it. */
const FLOOR_BELOW = '4.25rem'

/**
 * The homepage hero's herb garden. The box is a 3/1 band at lg (4/3 below)
 * standing on the teal floor: the floor's top edge is the ground line, the
 * plants grow above it, the roots into it. The box is one image to
 * assistive tech (`role="img"`, named by `label`); the canvas is hidden from
 * it, and the pause button (WCAG 2.2.2, the same control the service videos
 * use) sits outside the box in the floor below, where nothing grows.
 *
 * Nothing here blocks the headline: after hydration the engine chunk is
 * fetched only once the box is in view and the browser is idle. Under
 * save-data it is never fetched, and the static still stands in; without
 * JavaScript the server's <noscript> still (`children`) does.
 */
export function Garden({ label, children }: { label: string; children?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const handle = useRef<GardenHandle | null>(null)
  const pausedNow = useRef(false)
  const { hydrated, reducedMotion, saveData } = useLoopGates()
  const mode = hydrated ? gardenStartMode({ saveData, reducedMotion }) : null
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const wantsEngine = mode === 'grow' || mode === 'static'

  useEffect(() => {
    pausedNow.current = paused
    handle.current?.setPaused(paused)
  }, [paused])

  useEffect(() => {
    const el = box.current
    const cv = canvas.current
    if (!wantsEngine || !el || !cv) return
    let cancelled = false
    let idle = 0
    const start = () =>
      import('./engine')
        .then(({ mountGarden }) => {
          if (!cancelled) handle.current = mountGarden(el, cv, { paused: pausedNow.current })
        })
        .catch(() => {
          if (!cancelled) setFailed(true)
        })
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      io.disconnect()
      idle = typeof requestIdleCallback === 'function' ? requestIdleCallback(start, { timeout: 2000 }) : window.setTimeout(start, 200)
    })
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
      if (typeof cancelIdleCallback === 'function') cancelIdleCallback(idle)
      else clearTimeout(idle)
      handle.current?.destroy()
      handle.current = null
    }
  }, [wantsEngine])

  return (
    <div className="relative mt-7" style={{ paddingBottom: FLOOR_BELOW }}>
      <div ref={box} role="img" aria-label={label} className="relative aspect-[4/3] lg:aspect-[3/1]">
        <div
          aria-hidden="true"
          className="hero-field absolute inset-x-[calc(-1*var(--edge))] bg-teal"
          style={{ top: `${GARDEN.groundAt * 100}%`, bottom: `calc(-1 * ${FLOOR_BELOW})` }}
        />
        {children}
        {(mode === 'still' || failed) && <StillPicture />}
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 block h-full w-full touch-pan-y" />
      </div>
      {mode === 'grow' && !failed && (
        <LoopPauseButton paused={paused} onToggle={() => setPaused((p) => !p)} label="garden animation" className="right-0 bottom-3 print:hidden" />
      )}
    </div>
  )
}
