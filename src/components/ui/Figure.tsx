import Image from 'next/image'
import { Camera } from 'lucide-react'

/**
 * An image slot.
 *
 * Every photo on the site is the same shape: a plain rectangle on
 * `--radius-photo`. The blob, leaf and arch masks went because the client
 * said they looked unprofessional, and they did read as page-builder
 * decoration. Depth comes from `offset` instead — a solid slab of logo teal or
 * clay behind the photo, shifted down and right. No shadows.
 *
 * With a `src` it renders the picture, cropped by `position`, which is how a
 * shoot photo of Dr. Lee becomes a slot about the patient. Without one it
 * renders the brief, so an empty slot still tells you — and the photographer —
 * what belongs there. `src/lib/content/photos.ts` has the crops and the rule.
 */

const TONES = {
  sand: 'bg-sand-300 text-ink-700 ring-ink-900/10',
  sandLight: 'bg-sand-200 text-ink-700 ring-ink-900/10',
  tint: 'bg-teal-50 text-ink-500 ring-ink-900/10',
  teal: 'bg-teal-600/35 text-canvas/75 ring-canvas/15',
  deep: 'bg-teal-900/45 text-canvas/70 ring-canvas/15',
} as const

const SLABS = {
  teal: 'bg-teal-500',
  clay: 'bg-clay-300',
} as const

export function Figure({
  subject,
  src,
  alt,
  aspect = '4 / 5',
  position = '50% 50%',
  offset = 'none',
  tone = 'sand',
  className = '',
  sizes = '(min-width: 1200px) 560px, (min-width: 1024px) 50vw, 100vw',
  preload = false,
  compact = false,
}: {
  subject: string
  src?: string
  alt?: string
  aspect?: string
  /** CSS `object-position` — where the crop centres. */
  position?: string
  /** Slab behind the photo. One per section at most, or it stops meaning anything. */
  offset?: 'none' | keyof typeof SLABS
  /** Placeholder colour; ignored once there's a `src`. */
  tone?: keyof typeof TONES
  className?: string
  sizes?: string
  preload?: boolean
  /** Drop the label on small slots where it won't fit. */
  compact?: boolean
}) {
  return (
    <div className={`relative isolate ${className}`}>
      {offset !== 'none' && (
        <span
          aria-hidden
          className={`absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-photo ${SLABS[offset]}`}
        />
      )}

      {src ? (
        <div style={{ aspectRatio: aspect }} className="relative overflow-hidden rounded-photo">
          <Image
            src={src}
            alt={alt ?? subject}
            fill
            sizes={sizes}
            preload={preload}
            className="media-zoom object-cover"
            style={{ objectPosition: position }}
          />
        </div>
      ) : (
        <div
          role="img"
          aria-label={`Placeholder — ${subject}`}
          style={{ aspectRatio: aspect }}
          className={`flex flex-col items-center justify-center gap-3 overflow-hidden rounded-photo p-5 text-center ring-1 ring-inset ${TONES[tone]}`}
        >
          <Camera className={compact ? 'h-5 w-5 opacity-40' : 'h-6 w-6 opacity-50'} aria-hidden />
          {!compact && (
            <span className="max-w-[28ch] text-small leading-snug text-balance">{subject}</span>
          )}
        </div>
      )}
    </div>
  )
}
