import { DotBurst } from '@/components/brand/DotBurst'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import type { HomeContent } from '@/lib/content/home'
import type { SiteSettings } from '@/lib/site'
import { displayClass } from '@/lib/typography'

/**
 * Teal field on columns 1-7, bleeding to the left edge of the viewport. The
 * 4:5 patient photo straddles the field's right edge and hangs off its
 * bottom; the award line and the first dot burst sit on the white side.
 * Three text elements: heading, sentence, CTA. No eyebrow, no tagline.
 *
 * The photo starts under the heading, beside the sentence, so a two-line
 * headline at 92px never runs beneath it. `--hang` is how far the photo
 * drops below the field, and the field ends that far above the bottom of
 * the copy block. Widths are in `cqw` (the section is the query container),
 * so the geometry follows the viewport without the scrollbar skewing it,
 * and `--edge` (from the `container-edge` utility) lines the copy up with
 * the header's container.
 *
 * Mobile: the field is full width and the photo hangs off its bottom edge.
 *
 * motion.css animates `.hero-field` (wipe from the left), `.hero-copy > *`
 * (rise), the photo inside `.hero-drift` (slide on load) and `.hero-drift`
 * itself (the scroll-linked drift). Without them the layout is the final
 * state. The photo is the LCP image, so it is never behind a Reveal.
 */
export function Hero({ content, settings }: { content: HomeContent['hero']; settings: SiteSettings }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="container-edge relative overflow-x-clip [--hang:min(40cqw,17rem)] lg:[--hang:10cqw]"
    >
      <div className="relative lg:grid lg:grid-cols-12">
        {/* The field: columns 1-7. `hero-field` is the layer that wipes in. */}
        <div className="relative lg:col-span-7">
          <div aria-hidden className="hero-field absolute inset-x-0 top-0 bottom-[var(--hang)] bg-teal" />

          {/* On lg the copy's children join this grid (`contents`), so the
              heading spans both columns and the photo sits beside the
              sentence and CTA. The second column is the photo's overlap with
              the field; the photo is wider and runs out past the field. */}
          <div className="relative container-x pt-14 lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-[minmax(0,1fr)_calc(10cqw-3rem)] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-8 lg:pt-20 lg:pr-12 lg:pl-[var(--edge)]">
            <div data-surface="teal" className="hero-copy bg-transparent lg:contents">
              <h1 id="hero-heading" className={`${displayClass(content.heading)} max-w-[12ch] lg:col-span-2`}>
                {content.heading}
              </h1>
              <p className="mt-6 max-w-[32ch] text-lede lg:col-start-1">{content.sentence}</p>
              <div className="mt-9 lg:col-start-1 lg:pb-[calc(var(--hang)+2.5rem)]">
                <Button href={settings.bookingUrl} on="teal">
                  {settings.ctaLabel}
                </Button>
              </div>
            </div>

            <div className="hero-drift relative z-10 mt-10 w-[78%] max-w-md lg:col-start-2 lg:row-span-3 lg:row-start-2 lg:mt-6 lg:w-[28cqw] lg:max-w-none">
              <Figure
                subject={content.image.subject}
                photo={content.image.photo}
                aspect="4/5"
                preload
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 448px, 78vw"
              />
            </div>
          </div>
        </div>

        {/* The white side: dot burst at the top, award line level with the
            photo's foot. Both line up with the header's container edge. */}
        <div className="relative lg:col-span-5">
          <DotBurst
            animate="load"
            className="absolute top-10 right-[var(--edge)] hidden h-auto w-36 text-teal lg:block xl:w-44"
          />
          <div className="container-x lg:contents">
            <p className="mt-6 max-w-[26ch] text-small text-ink-soft lg:absolute lg:right-[var(--edge)] lg:bottom-0 lg:mt-0 lg:max-w-[20ch]">
              {content.award}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
