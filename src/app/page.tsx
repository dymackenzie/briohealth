import { Close } from '@/components/sections/Close'
import { FirstVisit } from '@/components/sections/FirstVisit'
import { Guide } from '@/components/sections/Guide'
import { Hero } from '@/components/sections/Hero'
import { Plan } from '@/components/sections/Plan'
import { Proof } from '@/components/sections/Proof'
import { Questions } from '@/components/sections/Questions'
import { ServiceRows, type ServiceRowItem } from '@/components/sections/ServiceRows'
import { Stakes } from '@/components/sections/Stakes'
import { faqsFor } from '@/lib/content/faqs'
import { home } from '@/lib/content/home'
import { getService } from '@/lib/content/services'
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

export default async function HomePage() {
  const settings = await getSiteSettings()

  const rows: ServiceRowItem[] = home.services.order.flatMap((slug) => {
    const service = getService(slug)
    if (!service) return []
    return [
      {
        slug: service.slug,
        title: service.title,
        href: `/services/${service.slug}`,
        outcome: service.whoFor,
        subject: service.image.subject,
        photo: service.image.photo,
      },
    ]
  })

  return (
    <main id="main">
      <JsonLd data={clinicJsonLd(settings)} />
      <Hero content={home.hero} settings={settings} />
      <Stakes content={home.stakes} />
      <Guide content={home.guide} />
      <ServiceRows heading={home.services.heading} items={rows} />
      <Plan content={home.plan} />
      <FirstVisit content={home.firstVisit} settings={settings} />
      <Proof heading={home.proof.heading} items={testimonials} />
      <Questions content={home.questions} items={faqsFor('general')} settings={settings} />
      <Close settings={settings} widen />
    </main>
  )
}
