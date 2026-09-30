import { ContactForm } from '@/components/forms/ContactForm'
import { PageHero } from '@/components/layout/PageHero'
import { Address } from '@/components/ui/Address'
import { Button } from '@/components/ui/Button'
import { Hours } from '@/components/ui/Hours'
import { Reveal } from '@/components/ui/Reveal'
import { pages } from '@/lib/content/pages'
import { clinicJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
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
 * The form on the left, the clinic on a grey panel on the right: address and
 * map, phone and email, hours, and the booking button for anyone who came
 * here to book. No teal field and no burst.
 */
export default async function ContactPage() {
  const settings = await getSiteSettings()
  const contact = pages.contact

  return (
    <main id="main">
      <JsonLd data={clinicJsonLd(settings)} />
      <PageHero title={contact.title} lead={contact.lead} />

      <div className="container-x pb-24 grid-12 gap-y-14">
        <Reveal className="col-span-12 lg:col-span-7">
          <h2 className="text-h3">{contact.formHeading}</h2>
          <div className="mt-6">
            <ContactForm phone={settings.phone} phoneHref={settings.phoneHref} note={contact.privacyNote} />
          </div>
        </Reveal>

        <Reveal delay={80} className="col-span-12 lg:col-span-4 lg:col-start-9">
          <div className="bg-grey px-6 py-8 sm:px-8">
            <h2 className="text-h3">{contact.detailsHeading}</h2>
            <div className="mt-3">
              <p className="font-medium">{settings.legalName}</p>
              <Address address={settings.address} />
              <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className={`mt-2 inline-block ${panelLink}`}>
                Open in Google Maps
              </a>
            </div>

            <ul className="mt-6 grid gap-1 border-t border-paper pt-4">
              <li>
                <a href={settings.phoneHref} className={panelLink}>
                  {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className={`break-all ${panelLink}`}>
                  {settings.email}
                </a>
              </li>
            </ul>

            <h3 className="mt-8 text-h3">Hours</h3>
            <Hours hours={settings.hours} note={settings.saturdayNote} className="mt-3 border-t border-paper pt-3" />

            <div className="mt-8">
              <Button href={settings.bookingUrl}>{settings.ctaLabel}</Button>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
