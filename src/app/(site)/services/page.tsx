import { client } from '@/sanity/lib/client'
import { servicesQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import HeroSection from '@/components/sections/HeroSection'
import ServiceGridSection from '@/components/sections/ServiceGridSection'
import CtaBandSection from '@/components/sections/CtaBandSection'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const site = await client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } })
  return buildMetadata(null, site, 'Our Services')
}

export default async function ServicesPage() {
  const services = await client.fetch(servicesQuery, {}, { next: { tags: ['service'] } })

  return (
    <>
      <HeroSection section={{
        eyebrow: 'Our Services',
        heading: 'Integrative care for every aspect of your health.',
        subtext: 'From naturopathic medicine to acupuncture, IV therapy, laser, and massage — we offer a full spectrum of evidence-based integrative health services in Richmond BC.',
        variant: 'centered',
        background: 'sand',
      }} />

      <ServiceGridSection section={{
        services: services || [],
        background: 'canvas',
      }} />

      <CtaBandSection section={{
        heading: 'Ready to start your health journey?',
        subtext: 'Book a virtual assessment consultation with Dr. Lee to find the right services for you.',
        primaryCta: { label: 'Book Now', style: 'accent', link: { kind: 'booking' } },
        background: 'teal',
      }} />
    </>
  )
}
