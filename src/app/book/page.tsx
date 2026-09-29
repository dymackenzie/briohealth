import Link from 'next/link'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { buildMetadata } from '@/lib/seo'
import { addressLine, formatDays, formatTime, site } from '@/lib/site'

export const metadata = buildMetadata({
  title: 'Book an appointment',
  description: `Book with Brio Health in Richmond, BC. Call ${site.phone} or book online.`,
  path: '/book',
})

/**
 * The live naturopathic page's first-visit steps. A true sequence, so it keeps
 * its numbers.
 */
const FIRST_STEPS = [
  {
    title: 'Fill in the intake form',
    body: 'Complete the online intake form several days before your appointment, and email us any recent blood tests.',
  },
  {
    title: 'A 30-minute assessment, done virtually',
    body: 'Dr. Lee listens, reviews your intake form and starts your plan.',
  },
  {
    title: 'Your second visit, in person',
    body: 'A physical exam, and any further testing you need.',
  },
] as const

/** As printed on the live naturopathic page, including the caveat. */
const FEES = [
  { label: 'Initial assessment (30 min, virtual)', amount: '$150' },
  { label: 'Follow-up consultation (30 min)', amount: '$110' },
] as const

/**
 * Booking runs on Jane and we don't embed it — their own flow handles
 * intake, reschedules and reminders better than an iframe would. This page
 * exists because /book-now/ is an old URL people still have, so it earns its
 * keep by answering what someone wonders just before they commit: what
 * happens, and what it costs.
 */
export default function BookPage() {
  return (
    <>
      <PageHero
        title="Book an appointment"
        lead="New patients welcome. Appointments are handled through Jane, our booking system."
      />

      <main id="main">
        <Band tone="cream">
          <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="text-h2">Ready when you are</h2>
                <p className="mt-5 max-w-[46ch] text-lede text-ink-700">
                  Choose a time that works for you. If you&rsquo;re not sure what to
                  book, call us and we&rsquo;ll point you in the right direction.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href={site.bookingUrl}>Book online</Button>
                  <Button href={site.phoneHref} variant="outline">
                    Call {site.phone}
                  </Button>
                </div>
              </Reveal>

              <Reveal className="mt-16">
                <h2 className="text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)]">
                  What happens first
                </h2>
                <p className="mt-3 text-ink-500">For naturopathic medicine.</p>

                <ol className="mt-8 space-y-8">
                  {FIRST_STEPS.map((step, i) => (
                    <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-x-4">
                      <span
                        aria-hidden
                        className="font-display text-[2.75rem] leading-[0.9] text-teal-500"
                      >
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-h3">{step.title}</h3>
                        <p className="mt-2 max-w-[48ch] text-ink-700">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <p className="mt-10 max-w-[52ch] border-t border-ink-900/12 pt-6 text-ink-700">
                  Coming for acupuncture or I.V. therapy? Each starts with its own
                  consultation &mdash; see how the first visit works for{' '}
                  <Link href="/services/acupuncture" className="link-draw font-semibold text-teal-700">
                    acupuncture
                  </Link>{' '}
                  and{' '}
                  <Link href="/services/iv-therapy" className="link-draw font-semibold text-teal-700">
                    I.V. therapy
                  </Link>
                  .
                </p>
              </Reveal>
            </div>

            <Reveal from="right" className="lg:col-span-4 lg:col-start-9 lg:pt-3">
              <h3 className="text-h3">Naturopathic fees</h3>
              <dl className="mt-4 border-t border-ink-900/12">
                {FEES.map((fee) => (
                  <div
                    key={fee.label}
                    className="flex items-baseline justify-between gap-6 border-b border-ink-900/12 py-4"
                  >
                    <dt>{fee.label}</dt>
                    <dd className="font-display text-[1.75rem] leading-none">{fee.amount}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-small text-ink-500">Fees subject to change.</p>

              <h3 className="mt-12 text-h3">Hours</h3>
              <div className="mt-4 border-t border-ink-900/12 pt-4">
                {site.hours.map((row) => (
                  <p key={row.days.join()}>
                    <span className="font-semibold">{formatDays(row.days)}</span>
                    <br />
                    {formatTime(row.opens)} – {formatTime(row.closes)}
                  </p>
                ))}
                <p className="mt-2 text-small text-ink-500">{site.hoursNote}</p>
              </div>

              <h3 className="mt-12 text-h3">Where to find us</h3>
              <address className="mt-4 border-t border-ink-900/12 pt-4 not-italic">
                <span className="block font-semibold">{site.legalName}</span>
                {addressLine}
                <span className="mt-3 block">
                  <a href={site.phoneHref} className="link-draw">
                    {site.phone}
                  </a>
                </span>
                <span className="block">
                  <a href={`mailto:${site.email}`} className="link-draw break-all">
                    {site.email}
                  </a>
                </span>
              </address>
            </Reveal>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
