import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import type { HomeContent } from '@/lib/content/home'
import { BOOKING_PATH, type SiteSettings } from '@/lib/site'
import { displayClass } from '@/lib/typography'

/**
 * Layout "H2" in the editorial direction (spec 4.1 and 3.6, mockup
 * editorial-d1-final.html). A bottom-aligned 12-column row: the serif
 * headline in columns 1-8 (two lines at 1440), the serif-italic tagline
 * with the coral button in columns 9-12, on paper, left-aligned. Below it
 * the photo strip (3/1 at lg, 4/3 below) standing on a teal floor, a band
 * that runs edge to edge behind the photo's lower half. Two solid layers,
 * no gradient. Teal field 1 of 2 on the page.
 *
 * motion.css wipes `.hero-field` in from the left and rises the two
 * children of `.hero-copy`; the photo is the LCP image and never moves.
 */
export function HomeHero({ content, settings }: { content: HomeContent['hero']; settings: SiteSettings }) {
  return (
    <section aria-labelledby="hero-heading" className="container-edge relative overflow-x-clip">
      <div className="container-x pt-8 lg:pt-9">
        <div className="hero-copy grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-7">
          <h1 id="hero-heading" className={`${displayClass(content.heading)} lg:col-span-8`}>
            {content.heading}
          </h1>
          <div className="lg:col-span-4 lg:pb-1.5">
            <p className="text-tagline max-w-[26ch]">{content.sentence}</p>
            <div className="mt-4">
              <Button href={BOOKING_PATH}>{settings.ctaLabel}</Button>
            </div>
          </div>
        </div>

        {/* The floor: absolutely behind the photo's lower half, bleeding to
            both viewport edges with --edge (container-edge sets it). */}
        <div className="relative mt-7 pb-8 lg:pb-11">
          <div
            aria-hidden
            className="hero-field absolute inset-x-[calc(-1*var(--edge))] top-[48%] bottom-0 bg-teal"
          />
          <div className="relative">
            <Figure
              subject={content.image.subject}
              photo={content.image.photo}
              aspect="3/1"
              preload
              sizes="(min-width: 1360px) 1200px, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
