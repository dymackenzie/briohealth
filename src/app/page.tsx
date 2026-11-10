import { Explain } from '@/components/sections/Explain'
import { HomeHero } from '@/components/sections/HomeHero'
import { Plan } from '@/components/sections/Plan'
import { ServiceList } from '@/components/sections/ServiceList'
import { Stakes } from '@/components/sections/Stakes'
import { Trust } from '@/components/sections/Trust'
import { Value } from '@/components/sections/Value'
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

/**
 * Wireframe order: hero, stakes, value, trust, plan, explanatory paragraph,
 * then the services (Dr. Jeff moved them under it, 2026-11-10, with no top
 * padding so Explain's is the gap); the footer is the junk drawer. Stakes and Value pair up from lg,
 * problem then answer.
 */
export default async function HomePage() {
  const settings = await getSiteSettings()

  return (
    <main id="main">
      <JsonLd data={clinicJsonLd(settings)} />
      <HomeHero content={home.hero} cta={settings.ctaLabel} />
      <div className="container-edge lg:grid lg:grid-cols-2">
        <Stakes content={home.stakes} cta={settings.ctaLabel} />
        <Value content={home.value} cta={settings.ctaLabel} />
      </div>
      <Trust content={home.trust} cta={settings.ctaLabel} />
      <Plan content={home.plan} cta={settings.ctaLabel} />
      <Explain content={home.explain} cta={settings.ctaLabel} />
      <div className="container-x pb-[var(--section-y)]">
        <ServiceList order={home.services.order} />
      </div>
    </main>
  )
}
