import { client } from '@/sanity/lib/client'
import { homePageQuery, siteSettingsQuery, servicesQuery, programsQuery, teamMembersQuery } from '@/sanity/lib/queries'
import SectionRenderer from '@/components/sections/SectionRenderer'
import HeroSection from '@/components/sections/HeroSection'
import ServiceGridSection from '@/components/sections/ServiceGridSection'
import ImageWithTextSection from '@/components/sections/ImageWithTextSection'
import StatBandSection from '@/components/sections/StatBandSection'
import ProgramGridSection from '@/components/sections/ProgramGridSection'
import QuoteBandSection from '@/components/sections/QuoteBandSection'
import CtaBandSection from '@/components/sections/CtaBandSection'
import NewsletterSignupSection from '@/components/sections/NewsletterSignupSection'
import BlogTeaserSection from '@/components/sections/BlogTeaserSection'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const [home, site] = await Promise.all([
    client.fetch(homePageQuery, {}, { next: { tags: ['homePage'] } }),
    client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } }),
  ])
  return buildMetadata(home?.seo, site, 'Integrative Health Clinic in Richmond BC')
}

export default async function HomePage() {
  const [homePage, settings, services, programs] = await Promise.all([
    client.fetch(homePageQuery, {}, { next: { tags: ['homePage'] } }),
    client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } }),
    client.fetch(servicesQuery, {}, { next: { tags: ['service'] } }),
    client.fetch(programsQuery, {}, { next: { tags: ['program'] } }),
  ])

  // If no Sanity sections, render default static structure
  if (!homePage?.sections?.length) {
    return (
      <>
        <HeroSection section={{
          eyebrow: 'Integrative Health • Richmond BC',
          heading: 'Whole-person care that helps you feel alive again.',
          emphasisWord: 'alive',
          subtext: 'Naturopathic medicine, acupuncture, IV therapy, laser, massage, and more — guided by Dr. Jeffrey Lee, N.D., R.Ac.',
          ctas: [
            { label: 'Book Now', style: 'primary', link: { kind: 'booking' } },
            { label: 'Explore Services', style: 'secondary', link: { kind: 'internal', reference: null } },
          ],
          variant: 'split',
          background: 'canvas',
          imageArched: true,
        }} />

        <ServiceGridSection section={{
          eyebrow: 'Our Services',
          heading: 'How we can help',
          services: services || [],
          background: 'sand',
        }} />

        <ImageWithTextSection section={{
          imagePosition: 'left',
          eyebrow: 'Our Philosophy',
          heading: 'We need a shift in our health paradigm.',
          body: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'When the principles of Naturopathic Medicine are followed, the body can restore balance and begin to thrive. Dr. Lee has been serving the community of Richmond as a Naturopathic Doctor and Registered Acupuncturist since 2006.' }] }],
          cta: { label: 'About Dr. Lee', style: 'secondary', link: { kind: 'internal', reference: null } },
          background: 'canvas',
        }} />

        <StatBandSection section={{
          items: [
            { value: '18+', label: 'Years Serving Richmond' },
            { value: '1000s', label: 'Patients Helped' },
            { value: '2025', label: 'Richmond\'s Best Naturopath' },
          ],
        }} />

        <ProgramGridSection section={{
          eyebrow: 'Programs',
          heading: 'Transform your health',
          programs: programs || [],
          background: 'canvas',
        }} />

        <QuoteBandSection section={{
          quote: 'My mission is to encourage and empower people to take charge of their own health, so that they can regain their natural vitality.',
          attribution: 'Dr. Jeffrey Lee, N.D., R.Ac.',
          background: 'teal',
        }} />

        <BlogTeaserSection section={{
          eyebrow: 'From the blog',
          heading: 'Health insights & tips',
          count: 3,
          background: 'sand',
        }} />

        <NewsletterSignupSection section={{
          heading: 'Stay well',
          subtext: 'Health tips, recipes, and clinic news — delivered to your inbox.',
          background: 'teal-100',
        }} />

        <CtaBandSection section={{
          eyebrow: 'Ready to start?',
          heading: 'Book your assessment with Dr. Lee.',
          subtext: 'All new patients begin with a virtual consultation to assess your needs and create a personalized plan.',
          primaryCta: { label: 'Book Now', style: 'accent', link: { kind: 'booking' } },
          secondaryCta: { label: 'Learn more', style: 'ghost', link: { kind: 'internal', reference: null } },
          background: 'teal',
        }} />
      </>
    )
  }

  return <SectionRenderer sections={homePage.sections} />
}
