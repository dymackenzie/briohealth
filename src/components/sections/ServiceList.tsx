import { getService, type ServiceSlug } from '@/lib/content/services'
import { ServiceRows, type ServiceRowItem } from './ServiceRows'

/**
 * The three services as rows of serif text with their horizontal loops
 * (ServiceRows), in the order given. Used on the homepage and /services.
 * Only these plain fields cross to the client, not the service bodies.
 */
export function ServiceList({ order, label = 'Services' }: { order: ServiceSlug[]; label?: string }) {
  const items: ServiceRowItem[] = order.flatMap((slug) => {
    const service = getService(slug)
    if (!service) return []
    return [
      {
        slug: service.slug,
        title: service.title,
        href: `/services/${service.slug}`,
        brief: service.loopBrief,
        poster: service.video.poster,
        loop: service.video.loop,
      },
    ]
  })

  return <ServiceRows items={items} label={label} />
}
