import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { ContactForm } from '@/components/forms/ContactForm'
import { clinicJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
import { addressLine, formatDays, formatTime, site } from '@/lib/site'

export const metadata = buildMetadata({
  title: 'Contact',
  description: `Get in touch with Brio Health in Richmond, BC. ${site.phone} · ${site.email}`,
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <JsonLd data={clinicJsonLd()} />

      <PageHero
        title="Get in touch"
        lead="Questions about whether we can help? Send a note or give us a call — we're happy to talk it through before you book."
      />

      <main id="main">
        <Band tone="cream" className="pt-4">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <Reveal>
                <h2 className="text-[clamp(1.35rem,2.3vw,1.7rem)]">Send us a message</h2>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </Reveal>

              <Reveal from="right">
                <div className="rounded-lg bg-sand-200 px-6 py-6">
                  <h2 className="text-[clamp(1.25rem,2vw,1.5rem)]">The clinic</h2>

                  <ul className="mt-5 space-y-4">
                    <li className="flex items-start gap-4">
                      <MapPin className="mt-1 h-5 w-5 shrink-0 text-teal-600" aria-hidden />
                      <address className="not-italic">
                        <span className="block font-medium">{site.legalName}</span>
                        <span className="text-ink-500">{addressLine}</span>
                      </address>
                    </li>

                    <li className="flex items-start gap-4">
                      <Phone className="mt-1 h-5 w-5 shrink-0 text-teal-600" aria-hidden />
                      <a href={site.phoneHref} className="hover:underline">
                        {site.phone}
                      </a>
                    </li>

                    <li className="flex items-start gap-4">
                      <Mail className="mt-1 h-5 w-5 shrink-0 text-teal-600" aria-hidden />
                      <a href={`mailto:${site.email}`} className="break-all hover:underline">
                        {site.email}
                      </a>
                    </li>

                    <li className="flex items-start gap-4">
                      <Clock className="mt-1 h-5 w-5 shrink-0 text-teal-600" aria-hidden />
                      <div>
                        {site.hours.map((row) => (
                          <p key={row.days.join()}>
                            <span className="block font-medium">
                              {formatDays(row.days)}
                            </span>
                            <span className="text-ink-500">
                              {formatTime(row.opens)} – {formatTime(row.closes)}
                            </span>
                          </p>
                        ))}
                        <p className="mt-2 text-ink-500">{site.hoursNote}</p>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-6 border-t border-ink-900/10 pt-5">
                    <p className="text-ink-500">
                      Ready to book? Appointments go through Jane.
                    </p>
                    <Button href={site.bookingUrl} className="mt-4">
                      Book an appointment
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
