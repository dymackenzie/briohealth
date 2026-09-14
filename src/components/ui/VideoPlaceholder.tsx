import { Play } from 'lucide-react'

/**
 * Same idea as Figure — holds the slot and describes the shot — but
 * for the service videos, which are being filmed later.
 *
 * Sized 16/9 by default so swapping in the real embed doesn't move anything
 * below it on the page.
 */

const TONES = {
  teal: 'bg-teal-900/75 text-canvas/80 ring-canvas/15',
  deep: 'bg-teal-700/70 text-canvas/80 ring-canvas/15',
  sand: 'bg-sand-300 text-ink-500 ring-ink-900/10',
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
      className={`flex flex-col items-center justify-center gap-4 overflow-hidden rounded-xl p-6 text-center ring-1 ring-inset ${TONES[tone]} ${className}`}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-pill ring-1 ring-current/40">
        <Play className="ml-0.5 h-6 w-6" aria-hidden />
      </span>

      <span className="max-w-[38ch] text-[0.8rem] leading-snug tracking-wide">
        {subject}
      </span>
    </div>
  )
}
