import { client } from '@/sanity/lib/client'
import { teamMembersQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import HeroSection from '@/components/sections/HeroSection'
import TeamGridSection from '@/components/sections/TeamGridSection'
import CtaBandSection from '@/components/sections/CtaBandSection'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const site = await client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } })
  return buildMetadata(null, site, 'Our Team')
}

export default async function TeamPage() {
  const members = await client.fetch(teamMembersQuery, {}, { next: { tags: ['teamMember'] } })

  return (
    <>
      <HeroSection section={{
        eyebrow: 'Our Team',
        heading: 'The practitioners behind your care.',
        subtext: 'Our team brings together naturopathic medicine, acupuncture, registered massage therapy, and nutritional counselling — all under one roof.',
        variant: 'centered',
        background: 'sand',
      }} />

      <TeamGridSection section={{
        members: members || [],
        background: 'canvas',
      }} />

      <CtaBandSection section={{
        heading: 'Ready to meet your practitioner?',
        primaryCta: { label: 'Book Now', style: 'accent', link: { kind: 'booking' } },
        background: 'teal',
      }} />
    </>
  )
}
