import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder'
import { Reveal } from '@/components/ui/Reveal'
import { DotBurst } from '@/components/brand/DotBurst'
import { ForYouList } from '@/components/services/ForYouList'
import { FeeList, VisitSteps } from '@/components/services/VisitSteps'
import { getService, services } from '@/lib/content/services'
import { servicePhotos } from '@/lib/content/photos'
import { getPage } from '@/lib/wp/queries'
import { renderContent } from '@/lib/wp/renderContent'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const revalidate = 3600

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const service = getService(slug)
  if (!service) return buildMetadata({ title: 'Not found', path: `/services/${slug}` })

  return buildMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
  })
}

export default async function ServicePage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const service = getService(slug)
  if (!service) notFound()

  // Copy still lives on the WordPress page. Absent or empty is fine — the
  // summary, the list and the steps carry the page on their own.
  const page = await getPage(service.wpSlug)
  // Passed the hero so the WordPress copy doesn't open by repeating it.
  const body = page
    ? renderContent(page.content.rendered, {
        title: service.title,
        lead: service.lead,
      })
    : null

  const others = services.filter((s) => s.slug !== service.slug)

  return (
    <>
      <PageHero
        parent={{ label: 'All services', href: '/services' }}
        title={service.title}
        lead={service.lead}
      />

      <main id="main">
        {/* Who it's for and the way in, before any of the detail. The photo
            hangs over the hero's edge — the page's one grid break. */}
        <Band tone="cream">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <Reveal className="lg:col-span-7 lg:pr-8">
                <p className="max-w-[40ch] text-lede text-ink-700">{service.summary}</p>

                <h2 className="mt-10 font-body text-h3 font-semibold tracking-[-0.01em]">
                  This is for you if&hellip;
                </h2>
                <ForYouList items={service.forYou} className="mt-4" />

                <div className="mt-9 flex flex-wrap gap-3">
                  <Button href={site.bookingUrl}>Book an appointment</Button>
                  <Button href="/contact" variant="outline">
                    Ask a question
                  </Button>
                </div>
              </Reveal>

              <Reveal from="right" delay={120} className="lg:col-span-5 lg:-mt-44">
                <Figure
                  subject={service.tallImage}
                  {...(servicePhotos[service.slug].tall ?? {})}
                  aspect="4 / 5"
                  offset="teal"
                  sizes="(min-width: 1200px) 460px, (min-width: 1024px) 38vw, 100vw"
                  preload
                  className="mr-4 lg:mr-0"
                />
              </Reveal>
            </div>
          </Container>
        </Band>

        <Band tone="paper">
          <Container>
            <Reveal>
              <h2 className="text-h2">What to expect</h2>
            </Reveal>
            <div className="mt-10 lg:mt-12">
              <VisitSteps steps={service.steps} />
            </div>
            <Reveal>
              <FeeList fees={service.fees} note={service.feesNote} className="mt-14 lg:mt-16" />
            </Reveal>
          </Container>
        </Band>

        {/* The clinic's own long copy, FAQs included. The video is a slot
            beside it, not a hero: an empty frame above the fold was the
            weakest thing on the page. */}
        <Band tone="tint">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <aside className="lg:order-2 lg:col-span-4">
                <div className="lg:sticky lg:top-8">
                  <h3 className="text-h3">Hear it from Dr. Lee</h3>
                  <VideoPlaceholder subject={service.video} className="mt-4" />
                </div>
              </aside>

              {body && (
                <div className="post-body max-w-[68ch] lg:order-1 lg:col-span-8">{body}</div>
              )}
            </div>
          </Container>
        </Band>

        <Band tone="teal" className="relative overflow-hidden">
          <DotBurst
            droplet={false}
            className="pointer-events-none absolute -right-28 -bottom-44 h-[30rem] w-[30rem] text-teal-500"
          />
          <Container className="relative">
            <Reveal className="max-w-2xl">
              <h2 className="text-h2">Ready to book your first {service.short} visit?</h2>
              <p className="mt-5 max-w-[44ch] text-lede opacity-90">
                It starts with a 30-minute virtual assessment with Dr. Lee. Book
                online, or call and we&rsquo;ll find you a time.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={site.bookingUrl} variant="onTeal">
                  Book an appointment
                </Button>
                <Button href={site.phoneHref} variant="outline">
                  Call {site.phone}
                </Button>
              </div>
            </Reveal>
          </Container>
        </Band>

        <Band tone="cream">
          <Container>
            <h2 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)]">Other services</h2>
            <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
              {others.map((other) => (
                <li key={other.slug} className="border-t border-ink-900/12 py-7">
                  <h3 className="text-h3">{other.title}</h3>
                  <p className="mt-2 max-w-[44ch] text-ink-700">{other.summary}</p>
                  <Link
                    href={`/services/${other.slug}`}
                    className="mt-4 inline-flex items-center gap-2 font-medium text-teal-700"
                  >
                    <span className="link-draw">More about {other.title}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
