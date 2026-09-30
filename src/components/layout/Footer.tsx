import Link from 'next/link'
import type { Icon } from '@phosphor-icons/react'
import { FacebookLogo, InstagramLogo, XLogo } from '@phosphor-icons/react/dist/ssr'

import { Logo } from '@/components/brand/Logo'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { Address } from '@/components/ui/Address'
import { Hours } from '@/components/ui/Hours'
import { services } from '@/lib/content/services'
import { footerLegal, type SiteSettings } from '@/lib/site'

const socialIcons: Record<string, Icon> = {
  Instagram: InstagramLogo,
  Facebook: FacebookLogo,
  X: XLogo,
}

const pageLinks = [
  { label: 'About Dr. Lee', href: '/about' },
  { label: 'Pickleball & Community', href: '/pickleball' },
  { label: 'Blog', href: '/blog' },
  { label: 'Book', href: '/book' },
  { label: 'Contact', href: '/contact' },
]

/**
 * Teal-deep on grey is 4.34:1, short of AA for body text, so links on this
 * panel stay ink and carry an underline instead of a colour.
 */
const link = 'underline decoration-1 underline-offset-4 hover:decoration-2'

/**
 * The quiet panel. NAP and hours here must match the contact page and the
 * JSON-LD: all three read the same settings object. Not teal: the homepage's
 * three fields are the hero, the plan and the close.
 */
export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-grey">
      <div className="container-x py-16">
        {/* The link columns take their longest label, so none wraps, and the
            newsletter column gets the widest share for its field. Two by two
            until there is room for all four. */}
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-[minmax(0,5fr)_max-content_max-content_minmax(0,6fr)]">
          <div>
            <Logo height={64} />
            <p className="mt-6 font-medium">{settings.legalName}</p>
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
            <Hours hours={settings.hours} note={settings.saturdayNote} className="mt-6" />
          </div>

          <nav aria-label="Services">
            <h2 className="text-h3">Services</h2>
            <ul className="mt-4 space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={link}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Pages">
            <h2 className="text-h3">Clinic</h2>
            <ul className="mt-4 space-y-2">
              {pageLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-h3">Occasional notes</h2>
            <p className="mt-2 text-small text-ink-soft">Health, recipes and clinic news. No spam.</p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
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
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink/15 pt-6 text-small text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {settings.legalName}
          </p>
          <ul className="flex gap-5">
            {footerLegal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
