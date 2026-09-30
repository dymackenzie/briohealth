import { DotBurst } from '@/components/brand/DotBurst'
import { Address } from '@/components/ui/Address'
import { Button } from '@/components/ui/Button'
import { Hours } from '@/components/ui/Hours'
import { Reveal } from '@/components/ui/Reveal'
import { home } from '@/lib/content/home'
import type { SiteSettings } from '@/lib/site'

/**
 * Full-width teal field: heading, CTA, hours, address, and dot burst #3 at
 * the top right, level with the hero's (paper, the one place the burst is
 * not teal, because it sits on teal). Reused on /services, the service
 * pages and /about, so the copy defaults to the homepage's.
 *
 * The teal is its own layer (`.close-field`) behind the content, so Task 15
 * can scale it from 7/12 to full width as the section arrives without
 * touching the text. `data-surface` still sets the on-teal colours; the
 * section's own background is cleared so the layer is the only teal.
 */
export function Close({
  settings,
  heading = home.close.heading,
  sentence = home.close.sentence,
}: {
  settings: SiteSettings
  heading?: string
  sentence?: string
}) {
  return (
    <section
      aria-labelledby="close-heading"
      data-surface="teal"
      className="container-edge relative overflow-hidden bg-transparent"
    >
      <div aria-hidden className="close-field absolute inset-0 bg-teal" />

      <DotBurst
        animate="reveal"
        className="absolute top-[calc(var(--section-y)+0.25rem)] right-[var(--edge)] h-auto w-20 text-paper sm:w-32 lg:w-44"
      />

      <div className="relative container-x section-y grid-12 gap-y-12">
        <Reveal className="col-span-12 pr-24 sm:pr-40 lg:pr-0">
          <h2 id="close-heading" className="max-w-[14ch] text-h2">
            {heading}
          </h2>
        </Reveal>

        <Reveal delay={80} className="col-span-12 lg:col-span-5">
          <p className="max-w-[30ch] text-lede">{sentence}</p>
          <div className="mt-8">
            <Button href={settings.bookingUrl} on="teal">
              {settings.ctaLabel}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={160} className="col-span-12 sm:col-span-6 lg:col-span-3 lg:col-start-7">
          <h3 className="text-h3">Hours</h3>
          <Hours hours={settings.hours} note={settings.saturdayNote} className="mt-3" />
        </Reveal>

        <Reveal delay={240} className="col-span-12 sm:col-span-6 lg:col-span-3 lg:col-start-10">
          <h3 className="text-h3">Find us</h3>
          <Address address={settings.address} className="mt-3" />
          <a href={settings.phoneHref} className="mt-2 inline-block underline underline-offset-4">
            {settings.phone}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
