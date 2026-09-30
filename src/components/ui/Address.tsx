import type { SiteSettings } from '@/lib/site'

/** The postal address, one line for the street and one for the locality. */
export function Address({
  address,
  className = '',
}: {
  address: SiteSettings['address']
  className?: string
}) {
  return (
    <address className={`not-italic ${className}`}>
      <span className="block">{address.street}</span>
      <span className="block">
        {`${address.locality}, ${address.region} ${address.postal}`}
      </span>
    </address>
  )
}
