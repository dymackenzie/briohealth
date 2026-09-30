import { PageHero } from '@/components/layout/PageHero'
import { Address } from '@/components/ui/Address'
import { Button } from '@/components/ui/Button'
import { Hours } from '@/components/ui/Hours'
import { Reveal } from '@/components/ui/Reveal'
import { StepList } from '@/components/ui/StepList'
import { pages } from '@/lib/content/pages'
import { getService, services } from '@/lib/content/services'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'
import { getSiteSettings } from '@/lib/wp/queries'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: site.ctaLabel,
  description: 'Book with Brio Health in Richmond, BC. Online through Jane, or by phone.',
  path: '/book',
})

/**
 * Booking runs on Jane and is never embedded. This page answers what someone
 * wonders just before they commit: what happens first, and what it costs,
 * for all three services. `#fees` is linked from the homepage and the
 * service pages. Every figure is read from services.ts; the note is each
 * service's own, shown once when they agree. No teal field, no burst: it
 * is a page to act on, not to be sold to.
 */
export default async function BookPage() {
  const settings = await getSiteSettings()
  const book = pages.book
  const naturopathic = getService('naturopathic')
  const feesNotes = [...new Set(services.map((s) => s.feesNote))]

  return (
    <main id="main">
      <PageHero title={settings.ctaLabel} lead={book.lead} />

      <div className="container-x pb-24 grid-12 gap-y-16">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <p className="max-w-[46ch] text-lede">{book.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href={settings.bookingUrl}>{settings.ctaLabel}</Button>
              <a href={settings.phoneHref} className="link-quiet font-medium">
                Call {settings.phone}
              </a>
            </div>
          </Reveal>

          {naturopathic && (
            <Reveal className="mt-20">
              <h2 className="text-h2">{book.firstHeading}</h2>
              <p className="mt-4 max-w-[48ch] text-ink-soft">{book.firstNote}</p>
              <StepList steps={naturopathic.steps} className="mt-10" />
            </Reveal>
          )}
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <Reveal delay={80}>
            <h2 id="fees" className="scroll-mt-8 text-h2">
              {book.feesHeading}
            </h2>
            {services.map((service) => (
              <div key={service.slug} className="mt-8">
                <h3 className="text-h3">{service.title}</h3>
                <dl className="mt-2">
                  {service.fees.map((fee) => (
                    <div
                      key={fee.kind}
                      className="flex items-baseline justify-between gap-4 border-t border-grey py-3"
                    >
                      <dt>
                        {fee.label}
                        {fee.note && <span className="block text-small text-ink-soft">{fee.note}</span>}
                      </dt>
                      <dd className="font-display text-2xl font-semibold whitespace-nowrap">{fee.amount}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            {feesNotes.map((note) => (
              <p key={note} className="mt-2 border-t border-grey pt-3 text-small text-ink-soft">
                {note}
              </p>
            ))}
          </Reveal>

          <Reveal delay={160} className="mt-14">
            <h2 className="text-h3">Hours</h2>
            <Hours
              hours={settings.hours}
              note={settings.saturdayNote}
              className="mt-3 border-t border-grey pt-3"
            />

            <h2 className="mt-10 text-h3">Where to find us</h2>
            <div className="mt-3 border-t border-grey pt-3">
              <p className="font-medium">{settings.legalName}</p>
              <Address address={settings.address} />
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet mt-2 inline-block"
              >
                Open in Google Maps
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  )
}
