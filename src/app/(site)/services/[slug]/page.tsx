import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { serviceBySlugQuery, servicesQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import SanityImage from '@/components/media/SanityImage'
import Placeholder from '@/components/media/Placeholder'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import Accordion from '@/components/ui/Accordion'
import { PortableText } from '@portabletext/react'
import StatBandSection from '@/components/sections/StatBandSection'
import CtaBandSection from '@/components/sections/CtaBandSection'
import ProcessStepsSection from '@/components/sections/ProcessStepsSection'
import SectionRenderer from '@/components/sections/SectionRenderer'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const services = await client.fetch(servicesQuery).catch(() => [])
  return (services || []).map((s: any) => ({ slug: s.slug?.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [service, site] = await Promise.all([
    client.fetch(serviceBySlugQuery, { slug }, { next: { tags: ['service'] } }),
    client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } }),
  ])
  return buildMetadata(service?.seo, site, service?.title)
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await client.fetch(serviceBySlugQuery, { slug }, { next: { tags: ['service'] } })
  if (!service) notFound()

  // If there are page-builder sections, render those
  if (service.sections?.length) {
    return <SectionRenderer sections={service.sections} />
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-sand-200 py-[clamp(4rem,9vw,8rem)]">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-teal-500 mb-3">Services</p>
              <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] text-ink-900 leading-[1.02] mb-5">{service.title}</h1>
              {service.shortDescription && (
                <p className="text-ink-500 text-[1.1875rem] leading-relaxed mb-7 max-w-xl">{service.shortDescription}</p>
              )}
              <Button href="https://yourbriohealth.janeapp.com" external variant="primary" size="lg">
                Book {service.title}
              </Button>
            </div>
            <div className="overflow-hidden rounded-t-[999px] rounded-b-[var(--r-xl)]">
              {service.heroImage ? (
                <SanityImage image={service.heroImage} alt={service.title} sizes="(max-width: 768px) 100vw, 50vw" priority />
              ) : (
                <Placeholder label={`${service.title} hero`} ratio="4/5" />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Intro */}
      {service.intro && (
        <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
          <Container size="prose">
            <div className="prose">
              <PortableText value={service.intro} />
            </div>
          </Container>
        </section>
      )}

      {/* What it treats */}
      {service.whatItTreats?.length > 0 && (
        <section className="bg-sand-200 py-[clamp(4rem,9vw,8rem)]">
          <Container>
            <SectionHeading
              eyebrow="Conditions Treated"
              heading={`What ${service.title} can help`}
              className="mb-10"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.whatItTreats.map((item: any) => (
                <div key={item.title} className="bg-paper rounded-[var(--r-lg)] p-5 border border-sand-300">
                  <h3 className="font-display text-[1.125rem] text-ink-900 mb-1">{item.title}</h3>
                  {item.description && <p className="text-ink-500 text-[0.9375rem]">{item.description}</p>}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Process steps */}
      {service.process?.length > 0 && (
        <ProcessStepsSection section={{
          eyebrow: 'The Process',
          heading: 'What to expect',
          steps: service.process,
          background: 'canvas',
        }} />
      )}

      {/* Pricing */}
      {service.pricing?.length > 0 && (
        <section className="bg-sand-200 py-[clamp(4rem,9vw,8rem)]">
          <Container>
            <SectionHeading eyebrow="Pricing" heading="Fees & investment" className="mb-10" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
              {service.pricing.map((p: any) => (
                <div key={p.label} className="bg-paper rounded-[var(--r-lg)] p-5 border border-sand-300">
                  <h3 className="font-display text-[1.125rem] text-ink-900 mb-1">{p.label}</h3>
                  {p.detail && <p className="text-ink-500 text-[0.875rem] mb-2">{p.detail}</p>}
                  {p.price && <p className="text-teal-500 font-semibold text-lg">{p.price}</p>}
                </div>
              ))}
            </div>
            {service.pricingNote && (
              <p className="text-ink-500 text-[0.875rem] mt-4 italic">{service.pricingNote}</p>
            )}
          </Container>
        </section>
      )}

      {/* FAQs */}
      {service.faqs?.length > 0 && (
        <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
          <Container>
            <SectionHeading eyebrow="FAQs" heading="Common questions" align="center" className="mb-10" />
            <div className="max-w-3xl mx-auto">
              <Accordion items={service.faqs} />
            </div>
          </Container>
        </section>
      )}

      <CtaBandSection section={{
        heading: `Ready to book your ${service.title} session?`,
        primaryCta: { label: 'Book Now', style: 'accent', link: { kind: 'booking' } },
        background: 'teal',
      }} />
    </>
  )
}
