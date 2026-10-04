import { Bud } from '@/components/brand/Bud'
import { ContactForm } from '@/components/forms/ContactForm'
import { PageHero } from '@/components/layout/PageHero'
import { Address } from '@/components/ui/Address'
import { Button } from '@/components/ui/Button'
import { Hours } from '@/components/ui/Hours'
import { Reveal } from '@/components/ui/Reveal'
import { pages } from '@/lib/content/pages'
import { clinicJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
import { BOOKING_PATH, mapSearchUrl } from '@/lib/site'
import { getSiteSettings } from '@/lib/wp/queries'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Contact',
  description: 'Get in touch with Brio Health in Richmond, BC, by phone, email or the contact form.',
  path: '/contact',
})

// On grey, teal-deep is 4.34:1, under AA for body text, so links there are
// ink with an underline.
const panelLink = 'underline underline-offset-4 decoration-1 hover:decoration-2'

/**
 * The live Contact page: "Contact Us", "Call or email us if you have any
 * questions", the booking line and button, then the form beside the
 * phone, email, address and hours on a grey panel. Linked from the footer
 * only; not in the main nav or the top bar.
 */
export default async function ContactPage() {
  const settings = await getSiteSettings()
  const contact = pages.contact

  return (
    <main id="main">
      <JsonLd data={clinicJsonLd(settings)} />
      <PageHero title={contact.title} lead={contact.lead} bud={<Bud size="large" colour="teal" className="top-10 right-[10%]" />}>
        <p className="mt-6 max-w-[42ch]">{contact.bookLine}</p>
        <div className="mt-4">
          <Button href={BOOKING_PATH}>{settings.ctaLabel}</Button>
        </div>
      </PageHero>

      <div className="container-x pb-[var(--section-y)] grid-12 gap-y-10">
        <Reveal className="col-span-12 lg:col-span-7">
          <ContactForm phone={settings.phone} phoneHref={settings.phoneHref} />
        </Reveal>

        <Reveal delay={80} className="col-span-12 lg:col-span-4 lg:col-start-9">
          <div className="bg-grey px-6 py-8 sm:px-8">
            <ul className="grid gap-1">
              <li>
                <a href={settings.phoneHref} className={`text-h3 ${panelLink}`}>
                  {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className={`break-all ${panelLink}`}>
                  {settings.email}
                </a>
              </li>
            </ul>
            <div className="mt-5 border-t border-paper pt-4">
              <p className="font-medium">{settings.legalName}</p>
              <Address address={settings.address} />
              <a href={mapSearchUrl(settings)} target="_blank" rel="noopener noreferrer" className={`mt-2 inline-block ${panelLink}`}>
                Open in Google Maps
              </a>
            </div>
            <Hours hours={settings.hours} note={settings.saturdayNote} className="mt-5 border-t border-paper pt-4" />
          </div>
        </Reveal>
      </div>
    </main>
  )
}
