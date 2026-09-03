import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { programBySlugQuery, programsQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import SanityImage from '@/components/media/SanityImage'
import Placeholder from '@/components/media/Placeholder'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Accordion from '@/components/ui/Accordion'
import { PortableText } from '@portabletext/react'
import VideoEmbed from '@/components/media/VideoEmbed'
import CtaBandSection from '@/components/sections/CtaBandSection'
import SectionRenderer from '@/components/sections/SectionRenderer'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const programs = await client.fetch(programsQuery).catch(() => [])
  return (programs || []).map((p: any) => ({ slug: p.slug?.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [program, site] = await Promise.all([
    client.fetch(programBySlugQuery, { slug }, { next: { tags: ['program'] } }),
    client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } }),
  ])
  return buildMetadata(program?.seo, site, program?.title)
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params
  const program = await client.fetch(programBySlugQuery, { slug }, { next: { tags: ['program'] } })
  if (!program) notFound()

  if (program.sections?.length) {
    return <SectionRenderer sections={program.sections} />
  }

  return (
    <>
      <section className="bg-sand-200 py-[clamp(4rem,9vw,8rem)]">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-teal-500 mb-3">Program</p>
              <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] text-ink-900 leading-[1.02] mb-4">{program.title}</h1>
              {program.format && <p className="text-coral-500 font-semibold text-lg mb-3">{program.format}</p>}
              {program.shortDescription && <p className="text-ink-500 text-[1.1875rem] leading-relaxed mb-7">{program.shortDescription}</p>}
              <div className="flex flex-wrap gap-3">
                {program.registrationUrl ? (
                  <Button href={program.registrationUrl} external variant="primary" size="lg">Register Now</Button>
                ) : (
                  <Button href="https://yourbriohealth.janeapp.com" external variant="primary" size="lg">Book Consultation</Button>
                )}
                <Button href="/contact" variant="secondary" size="lg">Contact Us</Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-[var(--r-xl)]">
              {program.heroImage ? (
                <SanityImage image={program.heroImage} alt={program.title} sizes="(max-width: 768px) 100vw, 50vw" priority />
              ) : (
                <Placeholder label={`${program.title}`} ratio="4/3" />
              )}
            </div>
          </div>
        </Container>
      </section>

      {program.videoUrl && (
        <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <VideoEmbed url={program.videoUrl} />
            </div>
          </Container>
        </section>
      )}

      {program.intro && (
        <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
          <Container size="prose">
            <div className="prose"><PortableText value={program.intro} /></div>
          </Container>
        </section>
      )}

      {program.faqs?.length > 0 && (
        <section className="bg-sand-200 py-[clamp(4rem,9vw,8rem)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-8">Frequently Asked Questions</h2>
              <Accordion items={program.faqs} />
            </div>
          </Container>
        </section>
      )}

      <CtaBandSection section={{
        heading: `Ready to join ${program.title}?`,
        primaryCta: {
          label: program.registrationUrl ? 'Register Now' : 'Book a Consultation',
          style: 'accent',
          link: { kind: program.registrationUrl ? 'external' : 'booking', href: program.registrationUrl },
        },
        background: 'teal',
      }} />
    </>
  )
}
