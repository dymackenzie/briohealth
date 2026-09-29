import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
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

const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${site.name}, ${addressLine} ${site.address.postal}`)}`

export default function ContactPage() {
  return (
    <>
      <JsonLd data={clinicJsonLd()} />

      <PageHero
        title="Get in touch"
        lead="Questions about whether we can help? Send a note or give us a call — we're happy to talk it through before you book."
      />

      <main id="main">
        <Band tone="cream">
          <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-6">
              <h2 className="text-h2">Send us a message</h2>
              <div className="mt-8">
                <ContactForm />
              </div>

              {/* Under the form, not the details — the details column is the
                  shorter one, and a square on top of it left the page lopsided. */}
              <Figure
                subject="Reception desk / front door, so people recognise it when they arrive"
                aspect="3 / 2"
                tone="sand"
                className="mt-12"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>

            <Reveal from="right" className="lg:col-span-5 lg:col-start-8">
              <h2 className="text-h2">The clinic</h2>

              {/* Hierarchy by type alone — a hairline between items, no icons. */}
              <dl className="mt-8 border-t border-ink-900/12">
                <div className="border-b border-ink-900/12 py-5">
                  <dt className="text-small text-ink-500">Address</dt>
                  <dd className="mt-1">
                    <address className="not-italic">
                      <span className="block font-semibold">{site.legalName}</span>
                      {addressLine}
                    </address>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw mt-2 inline-block text-small font-semibold text-teal-700"
                    >
                      Get directions &rarr;
                    </a>
                  </dd>
                </div>

                <div className="border-b border-ink-900/12 py-5">
                  <dt className="text-small text-ink-500">Phone</dt>
                  <dd className="mt-1">
                    <a href={site.phoneHref} className="link-draw text-lede">
                      {site.phone}
                    </a>
                  </dd>
                </div>

                <div className="border-b border-ink-900/12 py-5">
                  <dt className="text-small text-ink-500">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${site.email}`} className="link-draw break-all">
                      {site.email}
                    </a>
                  </dd>
                </div>

                <div className="border-b border-ink-900/12 py-5">
                  <dt className="text-small text-ink-500">Hours</dt>
                  <dd className="mt-1">
                    {site.hours.map((row) => (
                      <p key={row.days.join()}>
                        <span className="font-semibold">{formatDays(row.days)}</span>
                        <br />
                        {formatTime(row.opens)} – {formatTime(row.closes)}
                      </p>
                    ))}
                    <p className="mt-2 text-small text-ink-500">{site.hoursNote}</p>
                  </dd>
                </div>
              </dl>

              <p className="mt-8">Ready to book? Appointments go through Jane.</p>
              <Button href={site.bookingUrl} className="mt-4">
                Book an appointment
              </Button>
            </Reveal>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
