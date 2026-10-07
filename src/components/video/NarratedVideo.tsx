'use client'

import { useEffect, useRef, useState } from 'react'

import { captionsPath } from '@/lib/captions'
import type { Photo } from '@/lib/content/photos'
import { byVisitor, narratedAutoplay } from '@/lib/video'
import { usePageIdle, useInView } from './hooks'
import { useLoopGates } from './LoopVideo'

/**
 * A service's narrated video, on the page beside the text rather than
 * behind a button. The server renders a plain player: preload="none"
 * behind the loop's still, no autoplay, no muted attribute, so without
 * JavaScript, under reduced motion and under save-data it fetches nothing
 * until the visitor presses play, and then plays with sound.
 *
 * Otherwise, once the page has loaded and gone idle, it is muted and
 * played while half in view and paused out of view (narratedAutoplay in
 * src/lib/video.ts). The native controls are its pause (WCAG 2.2.2) and
 * how the sound goes on. The visitor's first pause, play or unmute hands
 * it over and the page stops touching it. Captions, when there are any,
 * are on by default and come through /api/captions (src/lib/captions.ts).
 */
export function NarratedVideo({
  src,
  captions,
  poster,
  label,
  className = '',
}: {
  src: string
  /** The .vtt in the media library. */
  captions: string | null
  poster: Photo | null
  label: string
  className?: string
}) {
  const track = captionsPath(captions)
  const video = useRef<HTMLVideoElement>(null)
  // The play or pause the page last asked for, until its event arrives.
  const ours = useRef<'play' | 'pause' | null>(null)
  const { hydrated, reducedMotion, saveData } = useLoopGates()
  const idle = usePageIdle()
  const inView = useInView(video, 0.5)
  const [taken, setTaken] = useState(false)

  const action = narratedAutoplay({ ready: hydrated && idle, inView, reducedMotion, saveData, taken })

  useEffect(() => {
    const el = video.current
    if (!el) return
    if (action === 'play' && el.paused) {
      ours.current = 'play'
      el.muted = true
      el.play().catch(() => {
        if (ours.current === 'play') ours.current = null
      })
    } else if (action === 'pause' && !el.paused) {
      ours.current = 'pause'
      el.pause()
    }
  }, [action])

  const onMedia = (event: 'play' | 'pause' | 'volumechange') => {
    if (byVisitor(event, ours.current, video.current?.muted ?? true)) setTaken(true)
    else if (event === ours.current) ours.current = null
  }

  return (
    <video
      ref={video}
      controls
      playsInline
      preload="none"
      poster={poster?.src}
      width={1280}
      height={720}
      aria-label={label}
      onPlay={() => onMedia('play')}
      onPause={() => onMedia('pause')}
      onVolumeChange={() => onMedia('volumechange')}
      className={`aspect-video w-full rounded-brand bg-grey ${className}`}
    >
      <source src={src} type="video/mp4" />
      {track && <track kind="captions" src={track} srcLang="en" label="English" default />}
    </video>
  )
}
