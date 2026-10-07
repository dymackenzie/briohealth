import Image from 'next/image'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { LoopVideo } from '@/components/video/LoopVideo'
import type { Photo } from '@/lib/content/photos'
import { BOOKING_PATH } from '@/lib/site'
import { displayClass } from '@/lib/typography'

/**
 * The service page opener (spec 5.1). Full width, at most about 70vh on
 * desktop, 4/5 on phones. The loop plays muted behind a flat ink wash at
 * 45% (no gradient); over it the title in paper (display size, so the
 * 24px+ white rule holds) and the clay booking button. The narrated video
 * is on the page beside the text, not here. No loop: the still under the
 * same wash. No still: a teal field with the same text (counts as a teal
 * field), even with a loop, because the loop needs its poster. With
 * nothing to show, the field is sized to its text on the section rhythm,
 * not the media's box. The still is the video poster, never the service's
 * 4/5 shoot crop (Dr. Lee shows at full width).
 *
 * Layers, bottom to top: the video, the wash (z-10), the copy (z-20), the
 * loop's pause button (z-30, set in LoopVideo) so the copy layer, which
 * covers the hero, never sits over it.
 */
export function VideoHero({
  title,
  still,
  loop,
  ctaLabel,
}: {
  title: string
  still: Photo | null
  loop: string | null
  ctaLabel: string
}) {
  const copy = (surface: 'teal' | 'dark') => (
    <div className={`container-x relative flex h-full flex-col justify-end ${surface === 'dark' ? 'pb-10 lg:pb-14' : ''}`}>
      <h1 className={`${displayClass(title)} max-w-[14ch] ${surface === 'dark' ? 'text-paper' : ''}`}>{title}</h1>
      <div className="mt-6">
        <Button href={BOOKING_PATH}>{ctaLabel}</Button>
      </div>
    </div>
  )

  if (!still) {
    return (
      <Field as="section" aria-label={title} className="section-y">
        {copy('teal')}
      </Field>
    )
  }

  return (
    <section aria-label={title} className="relative aspect-[4/5] max-h-[70vh] w-full overflow-hidden sm:aspect-[16/9]">
      {loop ? (
        // The wrapper places the loop; the variants make its 4/5 poster box fill the hero with square corners.
        <div className="absolute inset-0">
          <LoopVideo
            src={loop}
            poster={still}
            mode="hero"
            aspect="4/5"
            sizes="100vw"
            preload
            className="h-full [&_video]:rounded-none [&>div:first-child]:aspect-auto [&>div:first-child]:rounded-none"
          />
        </div>
      ) : (
        <Image
          src={still.src}
          alt={still.alt}
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: still.position }}
        />
      )}
      <div aria-hidden className="absolute inset-0 z-10 bg-ink/45" />
      {/* Paper title and a paper focus ring over the wash; data-surface="tide" would paint the layer tide. */}
      <div className="absolute inset-0 z-20 [&_:focus-visible]:outline-paper [&_h1]:text-paper">{copy('dark')}</div>
    </section>
  )
}
