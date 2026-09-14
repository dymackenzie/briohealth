import Image from 'next/image'
import { Camera } from 'lucide-react'

/**
 * An image slot.
 *
 * With a `src` it renders the picture, cropped to the slot's shape. Without
 * one it renders the brief instead, so an empty slot still tells you — and the
 * photographer — what belongs there. `src/lib/content/photos.ts` says which
 * slots have a real photo today and why the rest don't.
 */

const SHAPES = {
  blob: 'rounded-[42%_58%_38%_62%_/_54%_36%_64%_46%]',
  blobAlt: 'rounded-[63%_37%_55%_45%_/_38%_58%_42%_62%]',
  arch: 'rounded-t-[999px] rounded-b-xl',
  archSoft: 'rounded-t-[8rem] rounded-b-lg',
  leaf: 'rounded-tl-[40%] rounded-br-[40%] rounded-tr-2xl rounded-bl-2xl',
  leafAlt: 'rounded-tr-[40%] rounded-bl-[40%] rounded-tl-2xl rounded-br-2xl',
  pill: 'rounded-pill',
  soft: 'rounded-xl',
} as const

const TONES = {
  teal: 'bg-teal-600/35 text-canvas/70',
  sand: 'bg-sand-300 text-ink-700',
  sandLight: 'bg-sand-200 text-ink-700',
  deep: 'bg-teal-900/45 text-canvas/60',
} as const

export function Figure({
  subject,
  src,
  alt,
  shape = 'soft',
  tone = 'sand',
  aspect = '4 / 5',
  className = '',
  sizes = '(min-width: 1200px) 560px, (min-width: 1024px) 50vw, 100vw',
  preload = false,
  compact = false,
}: {
  subject: string
  src?: string
  alt?: string
  shape?: keyof typeof SHAPES
  tone?: keyof typeof TONES
  aspect?: string
  className?: string
  sizes?: string
  preload?: boolean
  /** Drop the label on small slots where it won't fit. */
  compact?: boolean
}) {
  const frame = `overflow-hidden ${SHAPES[shape]} ${className}`

  if (src) {
    return (
      <div style={{ aspectRatio: aspect }} className={`relative ${frame}`}>
        <Image
          src={src}
          alt={alt ?? subject}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={`Placeholder — ${subject}`}
      style={{ aspectRatio: aspect }}
      className={`flex flex-col items-center justify-center gap-3 p-4 text-center ${TONES[tone]} ${frame}`}
    >
      <Camera className={compact ? 'h-5 w-5 opacity-40' : 'h-6 w-6 opacity-50'} aria-hidden />
      {!compact && (
        <span className="max-w-[26ch] text-[0.78rem] leading-snug tracking-wide">
          {subject}
        </span>
      )}
    </div>
  )
}
