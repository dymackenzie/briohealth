import { Envelope, MapPin, Phone } from '@phosphor-icons/react/dist/ssr'

import { formatPhoneDashed, type SiteSettings } from '@/lib/site'

/**
 * The wireframe's thin strip above the header: "Call Brio Today!" with the
 * number as a tel: link on the left; email and a jump to the footer map on
 * the right. Below md only the phone line shows, centred, so a thumb finds
 * it. Paper on ink; data-surface="ink" gives it the paper focus ring.
 */
export function TopBar({ settings }: { settings: SiteSettings }) {
  return (
    <div data-surface="ink" className="text-small">
      <div className="container-x flex h-9 items-center justify-center gap-6 md:justify-between">
        <a href={settings.phoneHref} className="inline-flex items-center gap-2 font-medium">
          <Phone size={16} aria-hidden />
          <span>
            Call Brio Today! <strong className="font-semibold">{formatPhoneDashed(settings.phone)}</strong>
          </span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2">
            <Envelope size={16} aria-hidden />
            {settings.email}
          </a>
          <a href="#map" className="inline-flex items-center gap-2">
            <MapPin size={16} aria-hidden />
            Map
          </a>
        </div>
      </div>
    </div>
  )
}
