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
import { Parallax } from '@/components/ui/Parallax'
import { DotRule } from '@/components/brand/DotBurst'
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
  // summary and treats list carry the page on their own.
  const page = await getPage(service.wpSlug)
  const body = page ? renderContent(page.content.rendered) : null

  const others = services.filter((s) => s.slug !== service.slug)

  return (
    <>
      {/* The video sits in the hero rather than at the foot of the page.
          Someone deciding whether to book wants to hear what the appointment
          involves before they read the detail, not after. */}
      <PageHero
        parent={{ label: 'All services', href: '/services' }}
        title={service.title}
        lead={service.lead}
      >
        <div className="rise-in mt-8 max-w-3xl" style={{ animationDelay: '240ms' }}>
          <h2 className="font-body text-[0.95rem] font-semibold opacity-80">
            What to expect
          </h2>
          <VideoPlaceholder subject={service.video} className="mt-4" />
        </div>
      </PageHero>

      <main id="main">
        <Band tone="cream" className="pt-4">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <Reveal>
                <p className="max-w-[46ch] text-base text-ink-500">{service.summary}</p>

                {body && <div className="post-body mt-7">{body}</div>}

                <DotRule className="mt-8 h-2.5 w-28 text-teal-500/40" />

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href={site.bookingUrl}>Book an appointment</Button>
                  <Button href="/contact" variant="outline">
                    Ask a question
                  </Button>
                </div>
              </Reveal>

              <Reveal from="right" className="lg:pt-4">
                <Parallax speed={0.06}>
                  <Figure
                    subject={service.image}
                    {...servicePhotos[service.slug].tall}
                    shape="archSoft"
                    tone="sand"
                    aspect="4 / 5"
                  />
                </Parallax>

                <div className="mt-7">
                  <h2 className="font-body text-[0.95rem] font-semibold text-ink-500">
                    Commonly helps with
                  </h2>
                  <ul className="mt-4">
                    {service.treats.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-4 border-b border-ink-900/10 py-3.5"
                      >
                        <span
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-teal-500"
                          aria-hidden
                        />
                        <span className="text-ink-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </Container>
        </Band>

        <Band tone="sand">
          <Container>
            <h2 className="text-[clamp(1.35rem,2.3vw,1.7rem)]">Other services</h2>
            <ul className="mt-7 grid gap-6 sm:grid-cols-2">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/services/${other.slug}`}
                    className="group flex h-full flex-col rounded-lg bg-canvas p-6 transition-colors hover:bg-paper"
                  >
                    <h3 className="text-base">{other.title}</h3>
                    <p className="mt-3 grow text-ink-500">{other.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-2 font-medium text-teal-700">
                      Learn more
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
                        aria-hidden
                      />
                    </span>
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
