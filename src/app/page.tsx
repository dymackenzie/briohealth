import { Guide } from '@/components/sections/Guide'
import { Hero } from '@/components/sections/Hero'
import { ServiceRows, type ServiceRowItem } from '@/components/sections/ServiceRows'
import { Stakes } from '@/components/sections/Stakes'
import { home } from '@/lib/content/home'
import { getService } from '@/lib/content/services'
import { getSiteSettings } from '@/lib/wp/queries'

export const revalidate = 3600

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
      <Hero content={home.hero} settings={settings} />
      <Stakes content={home.stakes} />
      <Guide content={home.guide} />
      <ServiceRows heading={home.services.heading} items={rows} />
    </main>
  )
}
