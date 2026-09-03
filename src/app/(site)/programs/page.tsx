import { client } from '@/sanity/lib/client'
import { programsQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import HeroSection from '@/components/sections/HeroSection'
import ProgramGridSection from '@/components/sections/ProgramGridSection'
import CtaBandSection from '@/components/sections/CtaBandSection'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const site = await client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } })
  return buildMetadata(null, site, 'Programs')
}

export default async function ProgramsPage() {
  const programs = await client.fetch(programsQuery, {}, { next: { tags: ['program'] } })

  return (
    <>
      <HeroSection section={{
        eyebrow: 'Programs',
        heading: 'Structured paths to lasting transformation.',
        subtext: 'Our programs go beyond symptom management to address the root causes of your health challenges — with community, structure, and expert guidance.',
        variant: 'centered',
        background: 'sand',
      }} />

      <ProgramGridSection section={{
        programs: programs || [],
        background: 'canvas',
      }} />

      <CtaBandSection section={{
        heading: 'Not sure which program is right for you?',
        subtext: 'Book a consultation with Dr. Lee to discuss your goals and find the best path forward.',
        primaryCta: { label: 'Book a Consultation', style: 'accent', link: { kind: 'booking' } },
        background: 'teal',
      }} />
    </>
  )
}
