import { Play } from 'lucide-react'

/**
 * Same idea as Figure — holds the slot and describes the shot — but
 * for the service videos, which are being filmed later.
 *
 * Sized 16/9 by default so swapping in the real embed doesn't move anything
 * below it on the page. Kept deliberately modest: an empty frame is the
 * weakest thing a page can lead with, so it sits beside the copy, not above it.
 */

const TONES = {
  teal: 'bg-teal-700 text-canvas/85 ring-canvas/10',
  deep: 'bg-teal-900 text-canvas/80 ring-canvas/10',
  sand: 'bg-sand-200 text-ink-700 ring-ink-900/10',
  paper: 'bg-paper text-ink-700 ring-ink-900/10',
} as const

export function VideoPlaceholder({
  subject,
  tone = 'teal',
  aspect = '16 / 9',
  className = '',
}: {
  subject: string
  tone?: keyof typeof TONES
  aspect?: string
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={`Video placeholder — ${subject}`}
      style={{ aspectRatio: aspect }}
      className={`flex flex-col items-center justify-center gap-3 overflow-hidden rounded-photo p-5 text-center ring-1 ring-inset ${TONES[tone]} ${className}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-pill ring-1 ring-current/40">
        <Play className="ml-0.5 h-5 w-5" aria-hidden />
      </span>

      <span className="max-w-[34ch] text-small leading-snug text-balance">{subject}</span>
    </div>
  )
}
