import Image from 'next/image'
import { Camera } from '@phosphor-icons/react/dist/ssr'
import type { Photo } from '@/lib/content/photos'

/**
 * A photo slot. Every photo on the site is a rectangle on --radius-brand at 4/5 or
 * 1/1 (the homepage hero strip is the one 3/1, 4/3 below lg); `position` is
 * how a shoot photo of Dr. Lee becomes a slot about the patient. Without a photo it renders the brief as a designed placeholder,
 * so an empty slot still tells the visitor, and the photographer, what
 * belongs there, and the layout never breaks.
 */

export const ASPECTS = {
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
  // The homepage hero strip (spec 4.1): 3/1 on desktop, 4/3 below lg.
  '3/1': 'aspect-[4/3] lg:aspect-[3/1]',
  '4/3': 'aspect-[4/3]',
} as const

export function Figure({
  subject,
  photo,
  aspect = '4/5',
  preload = false,
  sizes = '(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 100vw',
  className = '',
}: {
  subject: string
  photo: Photo | null
  aspect?: keyof typeof ASPECTS
  preload?: boolean
  sizes?: string
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
      aria-label={`Photo to come: ${subject}`}
      className={`flex flex-col justify-between rounded-brand border-t-2 border-teal bg-grey p-5 ${ASPECTS[aspect]} ${className}`}
    >
      <Camera size={24} className="text-teal-deep" aria-hidden />
      <p className="max-w-[24ch] text-small leading-snug text-ink-soft">{subject}</p>
    </div>
  )
}
