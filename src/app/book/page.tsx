import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { DotBurst } from '@/components/brand/DotBurst'
import { buildMetadata } from '@/lib/seo'
import { addressLine, site } from '@/lib/site'

export const metadata = buildMetadata({
  title: 'Book an appointment',
  description: `Book with Brio Health in Richmond, BC. Call ${site.phone} or book online.`,
  path: '/book',
})

/**
 * Booking runs on Jane and we don't embed it — their own flow handles
 * intake, reschedules and reminders better than an iframe would. This page
 * exists because /book-now/ is an old URL people still have.
 */
export default function BookPage() {
  return (
    <>
      <PageHero
        title="Book an appointment"
        lead="New patients welcome. Appointments are handled through Jane, our booking system."
      />

      <main id="main">
        <Band tone="cream" className="pt-4">
          <Container prose className="text-center">
            <Reveal from="scale">
              <DotBurst className="mx-auto h-11 w-11 text-teal-500" />
              <h2 className="mt-6 text-[clamp(1.5rem,2.9vw,1.9rem)]">
                Ready when you are
              </h2>
              <p className="mx-auto mt-4 max-w-[44ch] text-base text-ink-500">
                Choose a time that works for you. If you&rsquo;re not sure what to
                book, call us and we&rsquo;ll point you in the right direction.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <Button href={site.bookingUrl}>Book online</Button>
                <Button href={site.phoneHref} variant="outline">
                  Call {site.phone}
                </Button>
              </div>

              <div className="mt-10 rounded-lg bg-sand-200 px-6 py-6 text-left">
                <h3 className="text-base">Where to find us</h3>
                <address className="mt-4 space-y-1 text-ink-500 not-italic">
                  <p>{site.legalName}</p>
                  <p>{addressLine}</p>
                  <p>
                    <a href={site.phoneHref} className="hover:underline">
                      {site.phone}
                    </a>
                  </p>
                  <p>
                    <a href={`mailto:${site.email}`} className="hover:underline">
                      {site.email}
                    </a>
                  </p>
                </address>
              </div>
            </Reveal>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
