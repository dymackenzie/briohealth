import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { BandDivider } from '@/components/ui/BandDivider'
import { Reveal } from '@/components/ui/Reveal'
import { DotBurst } from '@/components/brand/DotBurst'
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
        <Band tone="cream" className="pt-4">
          <Container>
            <ul className="flex flex-col gap-12 lg:gap-16">
              {services.map((service, i) => (
                <Reveal as="li" key={service.slug}>
                  <div className="grid items-center gap-7 md:grid-cols-2 md:gap-11">
                    <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                      <Figure
                        subject={service.image}
                        {...servicePhotos[service.slug].wide}
                        shape={i % 2 === 1 ? 'leafAlt' : 'leaf'}
                        tone={i % 2 === 1 ? 'sandLight' : 'sand'}
                        aspect="3 / 2"
                      />
                    </div>

                    <div className={i % 2 === 1 ? 'md:order-1 md:pr-6' : 'md:pl-4'}>
                      <h2 className="text-[clamp(1.35rem,2.3vw,1.7rem)]">
                        {service.title}
                      </h2>
                      <p className="mt-4 max-w-[42ch] text-base text-ink-500">
                        {service.summary}
                      </p>

                      <ul className="mt-5 flex flex-wrap gap-2">
                        {service.treats.slice(0, 4).map((item) => (
                          <li
                            key={item}
                            className="rounded-pill bg-sand-200 px-3.5 py-1.5 text-[0.85rem] text-ink-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/services/${service.slug}`}
                        className="group mt-6 inline-flex items-center gap-2 font-medium text-teal-700"
                      >
                        More about {service.title.toLowerCase()}
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
                          aria-hidden
                        />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Band>

        <div className="relative">
          <BandDivider curve="swell" fill="text-teal-900" className="bg-canvas -mb-px" />

          <Band tone="teal-deep" className="relative overflow-hidden pt-4">
            <DotBurst
              droplet={false}
              className="drift pointer-events-none absolute -right-40 -bottom-64 h-[40rem] w-[40rem] text-teal-400/8"
            />
            <Container prose className="relative text-center">
              <Reveal from="scale">
                <DotBurst className="mx-auto h-11 w-11 text-teal-300" />
                <h2 className="mt-6 text-[clamp(1.6rem,3.2vw,2.15rem)]">
                  Not sure where to start?
                </h2>
                <p className="mx-auto mt-4 max-w-[44ch] text-base opacity-80">
                  That&rsquo;s what the first appointment is for. We&rsquo;ll work out
                  together what makes sense for you.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-4">
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
        </div>
      </main>

      <Footer />
    </>
  )
}
