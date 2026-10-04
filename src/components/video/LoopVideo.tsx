'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from '@phosphor-icons/react'

import { ASPECTS, Figure } from '@/components/ui/Figure'
import type { Photo } from '@/lib/content/photos'
import { shouldPlayLoop } from '@/lib/video'
import { useHydrated, useInView, useMediaQuery } from './hooks'

/**
 * The browser facts every loop is gated on. Reduced motion and save-data
 * mean poster only, with no video element at all (`showVideo` false).
 */
export function useLoopGates() {
  const hydrated = useHydrated()
  const canHover = useMediaQuery('(hover: hover)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const saveData = hydrated && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  return { hydrated, canHover, reducedMotion, saveData, showVideo: hydrated && !reducedMotion && !saveData }
}

/**
 * Pause and play for a loop that moves without being asked to (WCAG
 * 2.2.2): a 44px target, `aria-pressed`, and a label that says what a
 * press does now. The caller places it with `className`.
 */
export function LoopPauseButton({
  paused,
  onToggle,
  label,
  className = '',
}: {
  paused: boolean
  onToggle: () => void
  /** What it controls, after "Pause" or "Play": "background video". */
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={`${paused ? 'Play' : 'Pause'} ${label}`}
      className={`absolute z-30 flex h-11 w-11 items-center justify-center rounded-brand border-2 border-paper bg-ink/60 text-paper focus-visible:outline-paper ${className}`}
    >
      {paused ? <Play size={20} aria-hidden /> : <Pause size={20} aria-hidden />}
    </button>
  )
}

/**
 * A muted loop over its poster. The poster is a normal Figure (next/image),
 * so it is what the server renders, what the LCP candidate is on a service
 * page, and all a visitor without JavaScript gets. After hydration the
 * <video> is layered over it; it has no autoplay attribute, so the only
 * thing that starts it is shouldPlayLoop saying yes. preload="none": the
 * file is not fetched until it plays.
 *
 * Tile mode takes `active` (hover or focus of the whole tile) and `paused`
 * from its parent; on a device without hover it plays while 60% in view,
 * and the tile puts a LoopPauseButton beside its link (a button cannot sit
 * inside a link). Hero mode plays while 25% in view and shows its own
 * pause button, on z-30 so it stays above VideoHero's wash and copy layers.
 * Either way a pause holds until the visitor presses play.
 */
export function LoopVideo({
  src,
  poster,
  mode,
  active = false,
  paused = false,
  aspect = '4/5',
  sizes,
  preload = false,
  className = '',
}: {
  src: string
  poster: Photo
  mode: 'tile' | 'hero'
  active?: boolean
  /** Tile mode only: the state of the tile's pause button. */
  paused?: boolean
  aspect?: keyof typeof ASPECTS
  sizes?: string
  preload?: boolean
  className?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const { hydrated, canHover, reducedMotion, saveData, showVideo } = useLoopGates()
  const inView = useInView(box, mode === 'hero' ? 0.25 : 0.6)
  const [heroPaused, setHeroPaused] = useState(false)
  const [playing, setPlaying] = useState(false)

  const wanted =
    hydrated &&
    shouldPlayLoop({
      mode,
      hovered: active,
      focused: active,
      inView,
      canHover,
      reducedMotion,
      saveData,
      paused: mode === 'hero' ? heroPaused : paused,
    })

  useEffect(() => {
    const el = video.current
    if (!el) return
    if (wanted) el.play().catch(() => {})
    else el.pause()
  }, [wanted])

  return (
    <div ref={box} className={`relative ${className}`}>
      <Figure subject={poster.alt} photo={poster} aspect={aspect} sizes={sizes} preload={preload} className="h-full" />
      {showVideo && (
        <video
          ref={video}
          src={src}
          muted
          playsInline
          loop
          preload="none"
          poster={poster.src}
          aria-hidden
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={`absolute inset-0 h-full w-full rounded-brand object-cover transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition: poster.position }}
        />
      )}
      {showVideo && mode === 'hero' && (
        <LoopPauseButton paused={heroPaused} onToggle={() => setHeroPaused((p) => !p)} label="background video" className="right-4 bottom-4" />
      )}
    </div>
  )
}
