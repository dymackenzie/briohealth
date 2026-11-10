import Image from 'next/image'

import { Garden } from '@/components/garden/Garden'
import { GardenStill } from '@/components/garden/GardenStill'
import { Button } from '@/components/ui/Button'
import type { HomeContent } from '@/lib/content/home'
import { photos } from '@/lib/content/photos'
import { features } from '@/lib/features'
import { gardenLabel } from '@/lib/garden/config'
import { BOOKING_PATH } from '@/lib/site'
import { displayClass } from '@/lib/typography'

/**
 * Layout "H2" in the editorial direction (spec 4.1 and 3.6, mockup
 * editorial-d1-final.html). A 12-column row on paper, left-aligned: the
 * serif headline in columns 1-8 and the serif-italic tagline in columns
 * 9-12, the two sharing their last baseline; the clay button hangs below
 * the tagline, one size up from the header's. Below them the herb garden
 * (3/1 at lg, 4/3 below; `Garden`): engraved, hand-tinted herbs that grow
 * from seed on a canvas, standing on the teal floor, whose top edge is the
 * ground line and which runs edge to edge. Teal field 1 of 2 on the page.
 *
 * motion.css wipes `.hero-field` in from the left and rises the children
 * of `.hero-copy`. The garden draws nothing the copy waits on.
 *
 * With `features.heroPhoto` on it is the wireframe's photo instead. From lg
 * the photo fills the first screen under the service heroes' ink wash, with
 * the headline, tagline and button on it bottom left; below lg the words sit
 * under the photo. The tagline goes to 24px there so it counts as large text:
 * over the patient's light shirt it only clears 3:1.
 */
export function HomeHero({ content, cta }: { content: HomeContent['hero']; cta: string }) {
  if (features.heroPhoto) {
    return (
      <section aria-labelledby="hero-heading" className="relative lg:h-[clamp(34rem,calc(100svh-7.75rem),56rem)]">
        <div className="relative aspect-[5/4] bg-grey md:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
          <Image
            src={photos.heroPatient.src}
            alt={photos.heroPatient.alt}
            fill
            sizes="100vw"
            preload
            className="object-cover max-md:object-[24%_40%]!"
            style={{ objectPosition: photos.heroPatient.position }}
          />
          <div aria-hidden className="absolute inset-0 hidden bg-ink/50 lg:block" />
        </div>
        <div className="container-x relative pt-6 pb-8 lg:flex lg:h-full lg:items-end lg:pb-12 lg:text-paper lg:[&_:focus-visible]:outline-paper lg:[&_h1]:text-paper">
          <div className="hero-copy max-w-[40rem]">
            <h1 id="hero-heading" className={displayClass(content.heading)}>
              {content.heading}
            </h1>
            {content.sentence && <p className="text-tagline mt-3 lg:mt-4 lg:text-[1.5rem]">{content.sentence}</p>}
            <div className="mt-5 lg:mt-6">
              <Button href={BOOKING_PATH} size="lg">
                {cta}
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="hero-heading" className="container-edge relative overflow-x-clip">
      <div className="container-x pt-8 lg:pt-9">
        <div className="hero-copy grid lg:grid-cols-12 lg:items-baseline-last lg:gap-x-7">
          <h1 id="hero-heading" className={`${displayClass(content.heading)} lg:col-span-8`}>
            {content.heading}
          </h1>
          {content.sentence && <p className="text-tagline mt-6 max-w-[26ch] lg:col-span-4 lg:mt-0">{content.sentence}</p>}
          <div className="mt-5 lg:col-span-4 lg:col-start-9">
            <Button href={BOOKING_PATH} size="lg">
              {cta}
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
