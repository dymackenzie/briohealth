import { addressNote, type SiteSettings } from '@/lib/site'

/** The postal address, one line for the street and one for the locality, then where to find the door. */
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
      <span className="block">{addressNote}</span>
    </address>
  )
}
