import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

import { PageHero } from '@/components/layout/PageHero'
import { Close } from '@/components/sections/Close'
import { Reveal } from '@/components/ui/Reveal'
import { initialAssessmentFee, services } from '@/lib/content/services'
import { buildMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/wp/queries'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Services',
  description: 'Naturopathic medicine, acupuncture and I.V. therapy at Brio Health in Richmond, BC.',
  path: '/services',
})

/**
 * Three large rows: name, who it is for, the fee every patient starts with.
 * Then the close. The fee is the initial assessment, found by kind rather
 * than position, and labelled as what it is: "From" would undersell the I.V.
 * treatments that start below it.
 */
export default async function ServicesPage() {
  const settings = await getSiteSettings()

  return (
    <main id="main">
      <PageHero
        title="How we help"
        lead="Three ways in, all built on the same idea: find what is actually driving the problem, then treat that."
      />

      <section aria-label="Services" className="container-x pb-24">
        <ul className="border-t border-grey">
          {services.map((service, i) => {
            const fee = initialAssessmentFee(service.slug)

            return (
              <Reveal as="li" key={service.slug} delay={i * 80} className="border-b border-grey">
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid gap-x-8 gap-y-3 py-10 lg:grid-cols-12 lg:items-baseline"
                >
                  <span className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-none font-medium tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none lg:col-span-5">
                    {service.title}
                  </span>
                  <span className="max-w-[40ch] text-ink-soft lg:col-span-4">{service.whoFor}</span>
                  <span className="flex items-end justify-between gap-4 lg:col-span-3">
                    {fee ? (
                      <span className="flex flex-col">
                        <span className="text-small text-ink-soft">{fee.label}</span>
                        <span className="font-display text-3xl leading-tight font-semibold">{fee.amount}</span>
                      </span>
                    ) : (
                      <span />
                    )}
                    <ArrowRight
                      size={28}
                      aria-hidden
                      className="mb-1 shrink-0 text-teal transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </ul>
        {[...new Set(services.map((s) => s.feesNote))].map((note) => (
          <p key={note} className="mt-4 text-small text-ink-soft">
            {note}
          </p>
        ))}
      </section>

      <Close
        settings={settings}
        heading="Not sure where to start?"
        sentence="That is what the first appointment is for. We will work out together what makes sense for you."
      />
    </main>
  )
}
