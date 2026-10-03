import { getService, type ServiceSlug } from '@/lib/content/services'
import { ServiceTile } from './ServiceTile'

/**
 * The three services as equal tiles, in the homepage's order. Three equal
 * tiles are allowed here because they are the three services, not
 * decoration (spec 4.2). Reused on /services. The still is the loop's
 * poster, else the service photo, else the labelled placeholder.
 */
export function ServiceTiles({ order, label = 'Services' }: { order: ServiceSlug[]; label?: string }) {
  return (
    <ul aria-label={label} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {order.flatMap((slug) => {
        const service = getService(slug)
        if (!service) return []
        return [
          <li key={slug}>
            <ServiceTile
              title={service.title}
              href={`/services/${service.slug}`}
              subject={service.image.subject}
              still={service.video.poster ?? service.image.photo}
              loop={service.video.loop}
            />
          </li>,
        ]
      })}
    </ul>
  )
}
