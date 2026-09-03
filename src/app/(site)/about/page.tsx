import { client } from '@/sanity/lib/client'
import { aboutPageQuery, siteSettingsQuery, teamMembersQuery } from '@/sanity/lib/queries'
import SectionRenderer from '@/components/sections/SectionRenderer'
import HeroSection from '@/components/sections/HeroSection'
import ImageWithTextSection from '@/components/sections/ImageWithTextSection'
import StatBandSection from '@/components/sections/StatBandSection'
import TeamGridSection from '@/components/sections/TeamGridSection'
import CtaBandSection from '@/components/sections/CtaBandSection'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const [about, site] = await Promise.all([
    client.fetch(aboutPageQuery, {}, { next: { tags: ['aboutPage'] } }),
    client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } }),
  ])
  return buildMetadata(about?.seo, site, 'About Brio Health')
}

export default async function AboutPage() {
  const [aboutPage, members] = await Promise.all([
    client.fetch(aboutPageQuery, {}, { next: { tags: ['aboutPage'] } }),
    client.fetch(teamMembersQuery, {}, { next: { tags: ['teamMember'] } }),
  ])

  if (!aboutPage?.sections?.length) {
    return (
      <>
        <HeroSection section={{
          eyebrow: 'About Brio Health',
          heading: 'Integrative care rooted in whole-person health.',
          subtext: 'Brio Health has been serving the Richmond community since 2006, guided by a simple mission: help people reclaim their natural vitality through evidence-based integrative medicine.',
          variant: 'split',
          background: 'sand',
          imageArched: true,
        }} />

        <ImageWithTextSection section={{
          imagePosition: 'right',
          eyebrow: 'Dr. Jeffrey Lee, N.D., R.Ac.',
          heading: 'Your guide to whole-person health.',
          body: [
            { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Hello, my name is Dr. Jeffrey Lee. I have been serving the community of Richmond as a Naturopathic Doctor and Registered Acupuncturist since 2006. I value collaboration, a growth mindset, generosity and laughter.' }] },
            { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'My personal mission is to encourage and empower people to take charge of their own health, so that they can regain their natural vitality. My patients experience pain relief, improved sleep, healthier skin, strong digestive systems, mental clarity and abundant energy!' }] },
          ],
          cta: { label: 'Book with Dr. Lee', style: 'primary', link: { kind: 'booking' } },
          background: 'canvas',
        }} />

        <StatBandSection section={{
          items: [
            { value: '18+', label: 'Years in practice' },
            { value: '1000s', label: 'Patients served' },
            { value: '2025', label: 'Best Naturopath Richmond' },
          ],
        }} />

        <TeamGridSection section={{
          eyebrow: 'Our Team',
          heading: 'Meet the practitioners',
          members: members || [],
          background: 'sand',
        }} />

        <CtaBandSection section={{
          eyebrow: 'Ready to begin?',
          heading: 'Start your health transformation today.',
          primaryCta: { label: 'Book Now', style: 'accent', link: { kind: 'booking' } },
          background: 'teal',
        }} />
      </>
    )
  }

  return <SectionRenderer sections={aboutPage.sections} />
}
