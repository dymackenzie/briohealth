import { captionsPath } from '@/lib/captions'
import type { Photo } from '@/lib/content/photos'

/**
 * A service's narrated video, on the page beside the text rather than
 * behind a button. A plain player that never plays by itself:
 * preload="none" behind the loop's still, so the page fetches none of the
 * video until the visitor presses play. Captions, when there are any, are
 * on by default and come through /api/captions (src/lib/captions.ts).
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

  return (
    <video
      controls
      playsInline
      preload="none"
      poster={poster?.src}
      width={1280}
      height={720}
      aria-label={label}
      className={`aspect-video w-full rounded-brand bg-grey ${className}`}
    >
      <source src={src} type="video/mp4" />
      {track && <track kind="captions" src={track} srcLang="en" label="English" default />}
    </video>
  )
}
