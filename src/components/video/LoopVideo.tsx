'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from '@phosphor-icons/react'

import { ASPECTS, Figure } from '@/components/ui/Figure'
import type { Photo } from '@/lib/content/photos'
import { shouldPlayLoop } from '@/lib/video'
import { useHydrated, useInView, useMediaQuery } from './hooks'

/**
 * A muted loop over its poster. The poster is a normal Figure (next/image),
 * so it is what the server renders, what the LCP candidate is on a service
 * page, and all a visitor without JavaScript gets. After hydration the
 * <video> is layered over it; it has no autoplay attribute, so the only
 * thing that starts it is shouldPlayLoop saying yes. preload="none": the
 * file is not fetched until it plays.
 *
 * Tile mode takes `active` (hover or focus of the whole tile) from its
 * parent; on a device without hover it plays while 60% in view. Hero mode
 * plays while 25% in view and shows a pause button (WCAG 2.2.2).
 */
export function LoopVideo({
  src,
  poster,
  mode,
  active = false,
  aspect = '4/5',
  sizes,
  preload = false,
  className = '',
}: {
  src: string
  poster: Photo
  mode: 'tile' | 'hero'
  active?: boolean
  aspect?: keyof typeof ASPECTS
  sizes?: string
  preload?: boolean
  className?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const hydrated = useHydrated()
  const canHover = useMediaQuery('(hover: hover)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const inView = useInView(box, mode === 'hero' ? 0.25 : 0.6)
  const [userPaused, setUserPaused] = useState(false)
  const [playing, setPlaying] = useState(false)

  const saveData = hydrated && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  const wanted =
    hydrated &&
    !userPaused &&
    shouldPlayLoop({ mode, hovered: active, focused: active, inView, canHover, reducedMotion, saveData })

  useEffect(() => {
    const el = video.current
    if (!el) return
    if (wanted) el.play().catch(() => {})
    else el.pause()
  }, [wanted])

  // Reduced motion and save-data: poster only, no video element at all.
  const showVideo = hydrated && !reducedMotion && !saveData

  return (
    <div ref={box} className={`relative ${className}`}>
      <Figure subject={poster.alt} photo={poster} aspect={aspect} sizes={sizes} preload={preload} />
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
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-pressed={userPaused}
          aria-label={userPaused ? 'Play background video' : 'Pause background video'}
          className="absolute right-4 bottom-4 z-10 flex h-11 w-11 items-center justify-center rounded-brand border-2 border-paper bg-ink/60 text-paper focus-visible:outline-paper"
        >
          {userPaused ? <Play size={20} aria-hidden /> : <Pause size={20} aria-hidden />}
        </button>
      )}
    </div>
  )
}
