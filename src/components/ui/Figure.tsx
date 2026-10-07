import Image from 'next/image'
import { Camera, VideoCamera } from '@phosphor-icons/react/dist/ssr'
import type { Photo } from '@/lib/content/photos'

/**
 * A photo slot. Every photo on the site is a rectangle on --radius-brand at 4/5 or
 * 1/1 (the pickleball court is 4/3); `position` is
 * how a shoot photo of Dr. Lee becomes a slot about the patient. The
 * portrait of him on /about is 2/3 and shown whole, uncropped. The one
 * 16/9 is a service loop's still, a frame of the client's own horizontal
 * video, never a shoot crop. Without a photo it renders the brief as a
 * designed placeholder, so an empty slot still tells the visitor, and the
 * photographer or videographer (`kind="video"`), what belongs there, and
 * the layout never breaks.
 */

export const ASPECTS = {
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  // The /about portrait, whole (the file is a 2:3 portrait).
  '2/3': 'aspect-[2/3]',
  // A service loop's still (the client's horizontal video).
  '16/9': 'aspect-video',
} as const

export function Figure({
  subject,
  photo,
  aspect = '4/5',
  preload = false,
  sizes = '(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 100vw',
  kind = 'photo',
  className = '',
}: {
  subject: string
  photo: Photo | null
  aspect?: keyof typeof ASPECTS
  preload?: boolean
  sizes?: string
  /** What the empty slot is waiting for: it sets the placeholder's label and icon. */
  kind?: 'photo' | 'video'
  className?: string
}) {
  if (photo) {
    return (
      <div className={`relative overflow-hidden rounded-brand bg-grey ${ASPECTS[aspect]} ${className}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          preload={preload}
          fetchPriority={preload ? 'high' : undefined}
          className="object-cover"
          style={{ objectPosition: photo.position }}
        />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={`${kind === 'video' ? 'Video' : 'Photo'} to come: ${subject}`}
      className={`flex flex-col justify-between rounded-brand border-t-2 border-teal bg-grey p-5 ${ASPECTS[aspect]} ${className}`}
    >
      {kind === 'video' ? (
        <VideoCamera size={24} className="text-teal-deep" aria-hidden />
      ) : (
        <Camera size={24} className="text-teal-deep" aria-hidden />
      )}
      <p className="max-w-[24ch] text-small leading-snug text-ink-soft">{subject}</p>
    </div>
  )
}
