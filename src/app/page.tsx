import { HomeHero } from '@/components/sections/HomeHero'
import { Plan } from '@/components/sections/Plan'
import { ServiceTiles } from '@/components/sections/ServiceTiles'
import { Stakes } from '@/components/sections/Stakes'
import { home } from '@/lib/content/home'
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

/** Wireframe order: hero, stakes (with the service tiles), trust, plan, explanatory paragraph; the footer is the junk drawer. */
export default async function HomePage() {
  const settings = await getSiteSettings()

  return (
    <main id="main">
      <JsonLd data={clinicJsonLd(settings)} />
      <HomeHero content={home.hero} settings={settings} />
      <Stakes content={home.stakes}>
        <ServiceTiles order={home.services.order} />
      </Stakes>
      <Plan content={home.plan} settings={settings} />
    </main>
  )
}
