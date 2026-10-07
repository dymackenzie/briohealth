import { Explain } from '@/components/sections/Explain'
import { HomeHero } from '@/components/sections/HomeHero'
import { Plan } from '@/components/sections/Plan'
import { ServiceList } from '@/components/sections/ServiceList'
import { Stakes } from '@/components/sections/Stakes'
import { Trust } from '@/components/sections/Trust'
import { home } from '@/lib/content/home'
import { testimonials } from '@/lib/content/testimonials'
import { clinicJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'
import { getSiteSettings } from '@/lib/wp/queries'

export const revalidate = 3600

// Absolute, so the layout's `%s | Brio Health` template doesn't repeat the
// name. The description is the site default.
export const metadata = buildMetadata({
  title: { absolute: `${site.name}: ${site.tagline}` },
  path: '/',
})

/** Wireframe order: hero, stakes (with the service list), trust, plan, explanatory paragraph; the footer is the junk drawer. */
export default async function HomePage() {
  const settings = await getSiteSettings()

  return (
    <main id="main">
      <JsonLd data={clinicJsonLd(settings)} />
      <HomeHero content={home.hero} settings={settings} />
      <Stakes content={home.stakes}>
        <ServiceList order={home.services.order} />
      </Stakes>
      <Trust content={home.trust} items={testimonials} />
      <Plan content={home.plan} settings={settings} />
      <Explain content={home.explain} settings={settings} />
    </main>
  )
}
