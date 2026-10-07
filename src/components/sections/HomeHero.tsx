import { Garden } from '@/components/garden/Garden'
import { GardenStill } from '@/components/garden/GardenStill'
import { Button } from '@/components/ui/Button'
import type { HomeContent } from '@/lib/content/home'
import { gardenLabel } from '@/lib/garden/config'
import { BOOKING_PATH, type SiteSettings } from '@/lib/site'
import { displayClass } from '@/lib/typography'

/**
 * Layout "H2" in the editorial direction (spec 4.1 and 3.6, mockup
 * editorial-d1-final.html). A 12-column row on paper, left-aligned: the
 * serif headline in columns 1-8 (two lines at 1440) and the serif-italic
 * tagline in columns 9-12, the two sharing their last baseline so the
 * headline's colon reads on into the tagline; the clay button hangs below
 * the tagline, one size up from the header's. Below them the herb garden
 * (3/1 at lg, 4/3 below; `Garden`): engraved, hand-tinted herbs that grow
 * from seed on a canvas, standing on the teal floor, whose top edge is the
 * ground line and which runs edge to edge. Teal field 1 of 2 on the page.
 *
 * motion.css wipes `.hero-field` in from the left and rises the children
 * of `.hero-copy`. The garden draws nothing the copy waits on.
 */
export function HomeHero({ content, settings }: { content: HomeContent['hero']; settings: SiteSettings }) {
  return (
    <section aria-labelledby="hero-heading" className="container-edge relative overflow-x-clip">
      <div className="container-x pt-8 lg:pt-9">
        <div className="hero-copy grid lg:grid-cols-12 lg:items-baseline-last lg:gap-x-7">
          <h1 id="hero-heading" className={`${displayClass(content.heading)} lg:col-span-8`}>
            {content.heading}
          </h1>
          <p className="text-tagline mt-6 max-w-[26ch] lg:col-span-4 lg:mt-0">{content.sentence}</p>
          <div className="mt-5 lg:col-span-4 lg:col-start-9">
            <Button href={BOOKING_PATH} size="lg">
              {settings.ctaLabel}
            </Button>
          </div>
        </div>

        <Garden label={gardenLabel()}>
          <GardenStill />
        </Garden>
      </div>
    </section>
  )
}
