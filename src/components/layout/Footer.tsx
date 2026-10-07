import Link from 'next/link'
import type { Icon } from '@phosphor-icons/react'
import { FacebookLogo, InstagramLogo, XLogo } from '@phosphor-icons/react/dist/ssr'

import { Logo } from '@/components/brand/Logo'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { Address } from '@/components/ui/Address'
import { Button } from '@/components/ui/Button'
import { Hours } from '@/components/ui/Hours'
import { services } from '@/lib/content/services'
import { features } from '@/lib/features'
import { BOOKING_PATH, footerLegal, mapEmbedUrl, type SiteSettings } from '@/lib/site'

const socialIcons: Record<string, Icon> = {
  Instagram: InstagramLogo,
  Facebook: FacebookLogo,
  X: XLogo,
}

/** Wireframe section 9, "the junk drawer". The line is Dr. Jeff's. */
const MERCY = "Don't be at the Mercy of your symptoms"

const pageLinks = [
  { label: 'Contact', href: '/contact' },
  ...(features.pickleball ? [{ label: 'Pickleball', href: '/pickleball' }] : []),
]

/**
 * Teal-deep on sand is 4.0:1, short of AA for body text, so links on this
 * panel stay ink and carry an underline instead of a colour.
 */
const link = 'underline decoration-1 underline-offset-4 hover:decoration-2'

/**
 * The wireframe's junk drawer, on grey (not a teal field), in its order:
 * the three service buttons, "Don't be at the Mercy of your symptoms" with
 * the booking button, the map (patients get lost; toned into the sand by
 * `map-tone`, with Google's own "Open in Maps" inside it), the clinic's
 * details and hours with the About link, the newsletter, then legal, Contact,
 * Pickleball, socials and the copyright. NAP here must match the contact
 * page and the JSON-LD: all three read the same settings object.
 */
export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-grey">
      <div className="container-x py-12 lg:py-14">
        <nav aria-label="Services" className="flex flex-wrap gap-3">
          {services.map((s) => (
            <Button key={s.slug} href={`/services/${s.slug}`} variant="outline">
              {s.title}
            </Button>
          ))}
        </nav>

        <div className="mt-10 flex flex-col gap-5 border-t border-ink/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="max-w-[18ch] text-h2">{MERCY}</h2>
          <div className="shrink-0">
            <Button href={BOOKING_PATH}>{settings.ctaLabel}</Button>
          </div>
        </div>

        <div className="mt-10 grid gap-10 border-t border-ink/15 pt-10 lg:grid-cols-12">
          <section id="map" aria-label="Map" className="scroll-mt-6 lg:col-span-7">
            <iframe
              src={mapEmbedUrl(settings)}
              title={`Map showing ${settings.legalName} at ${settings.address.street}, ${settings.address.locality}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-tone h-[280px] w-full rounded-brand border-0"
            />
          </section>

          <div className="lg:col-span-5">
            <Logo height={56} />
            <p className="mt-5 font-medium">{settings.legalName}</p>
            <Address address={settings.address} />
            <p className="mt-3">
              <a href={settings.phoneHref} className={link}>
                {settings.phone}
              </a>
              <br />
              <a href={`mailto:${settings.email}`} className={link}>
                {settings.email}
              </a>
            </p>
            <Hours hours={settings.hours} note={settings.saturdayNote} className="mt-5" />
            <p className="mt-5">
              <Link href="/about" className={link}>
                About Dr. Lee
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 border-t border-ink/15 pt-10 lg:grid-cols-12">
          {features.newsletter && (
            <div className="lg:col-span-7">
              <h2 className="text-h3">Newsletter</h2>
              <div className="mt-4 max-w-md">
                <NewsletterForm />
              </div>
            </div>
          )}
          <div className={features.newsletter ? 'lg:col-span-5' : 'lg:col-span-12'}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {[...footerLegal, ...pageLinks].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex gap-2">
              {settings.social.map((channel) => {
                const Icon = socialIcons[channel.label]
                if (!Icon) return null
                return (
                  <li key={channel.href}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Brio Health on ${channel.label}`}
                      className="flex h-11 w-11 items-center justify-center rounded-brand border border-ink-soft text-ink hover:bg-paper"
                    >
                      <Icon size={22} aria-hidden />
                    </a>
                  </li>
                )
              })}
            </ul>
            <p className="mt-6 text-small text-ink-soft">
              &copy; {new Date().getFullYear()} {settings.legalName}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
