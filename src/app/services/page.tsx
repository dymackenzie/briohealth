import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { DotBurst } from '@/components/brand/DotBurst'
import { ForYouList } from '@/components/services/ForYouList'
import { services } from '@/lib/content/services'
import { servicePhotos } from '@/lib/content/photos'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = buildMetadata({
  title: 'Services',
  description:
    'Naturopathic medicine, acupuncture and I.V. therapy at Brio Health in Richmond, BC.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="How we can help"
        lead="Three ways in, all built on the same idea: find what's actually driving the problem, then treat that."
      />

      <main id="main">
        <Band tone="cream">
          <Container>
            <ul className="flex flex-col gap-16 lg:gap-24">
              {services.map((service, i) => {
                const flip = i % 2 === 1
                const href = `/services/${service.slug}`

                return (
                  <li
                    key={service.slug}
                    className="grid items-center gap-8 md:grid-cols-12 md:gap-10"
                  >
                    <Reveal
                      className={`md:col-span-5 ${flip ? 'md:order-2 md:col-start-8' : ''}`}
                    >
                      {/* Same destination as the text link, so it stays out of
                          the tab order and away from screen readers. 4/5, not
                          square: any wider and Dr. Lee comes back into frame. */}
                      <Link href={href} tabIndex={-1} aria-hidden className="media-hover block">
                        <Figure
                          subject={service.image}
                          {...(servicePhotos[service.slug].wide ?? {})}
                          aspect="4 / 5"
                          offset={i === 0 ? 'teal' : 'none'}
                          tone={flip ? 'sandLight' : 'sand'}
                          sizes="(min-width: 1200px) 460px, (min-width: 768px) 40vw, 100vw"
                          preload={i === 0}
                          className={i === 0 ? 'mr-4 md:mr-0' : ''}
                        />
                      </Link>
                    </Reveal>

                    <Reveal
                      delay={90}
                      className={`md:col-span-6 ${flip ? 'md:order-1 md:col-start-1' : 'md:col-start-7'}`}
                    >
                      <h2 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)]">
                        {service.title}
                      </h2>
                      <p className="mt-4 max-w-[36ch] text-lede text-ink-700">
                        {service.outcome}
                      </p>

                      <p className="mt-7 font-semibold">This is for you if&hellip;</p>
                      <ForYouList items={service.forYou.slice(0, 3)} className="mt-3" />

                      <Link
                        href={href}
                        className="mt-7 inline-flex items-center gap-2 font-medium text-teal-700"
                      >
                        <span className="link-draw">More about {service.title}</span>
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </Reveal>
                  </li>
                )
              })}
            </ul>
          </Container>
        </Band>

        <Band tone="teal-deep">
          <Container prose className="text-center">
            <Reveal from="scale">
              <DotBurst className="mx-auto h-12 w-12 text-teal-500" />
              <h2 className="mt-6 text-h2">Not sure where to start?</h2>
              <p className="mx-auto mt-5 max-w-[40ch] text-lede opacity-85">
                That&rsquo;s what the first appointment is for. We&rsquo;ll work out
                together what makes sense for you.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href={site.bookingUrl} variant="onTeal">
                  Book an appointment
                </Button>
                <Button href="/contact" variant="outline">
                  Ask us a question
                </Button>
              </div>
            </Reveal>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
