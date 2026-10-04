import { Envelope, MapPin, Phone } from '@phosphor-icons/react/dist/ssr'

import { formatPhoneDashed, type SiteSettings } from '@/lib/site'

/**
 * The wireframe's thin strip above the header: "Call Brio Today!" with the
 * number as a tel: link on the left; email and a jump to the footer map on
 * the right. Below md only the phone line shows, centred, and the link
 * fills the bar edge to edge at 44px tall, so a thumb finds it; from md the
 * bar is a 36px strip. Paper on ink; data-surface="ink" gives it the paper
 * focus ring.
 */
export function TopBar({ settings }: { settings: SiteSettings }) {
  return (
    <div data-surface="ink" className="text-small">
      <div className="container-x flex items-center justify-center gap-6 max-md:px-0 md:h-9 md:justify-between">
        <a
          href={settings.phoneHref}
          className="flex min-h-11 w-full items-center justify-center gap-2 px-[var(--gutter)] py-2 font-medium md:inline-flex md:min-h-0 md:w-auto md:px-0 md:py-0"
        >
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
