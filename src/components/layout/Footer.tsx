import Link from 'next/link'

import { Logo } from './Logo'
import { DotRule } from '@/components/brand/DotBurst'
import { socialIcons } from '@/components/brand/SocialIcons'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { addressLine, footerLegal, formatDays, formatTime, site } from '@/lib/site'
import { services } from '@/lib/content/services'

const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pickleball', href: '/pickleball' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Now', href: site.bookingUrl },
]

export function Footer() {
  return (
    <footer className="band-teal-deep">
      <div className="container-x py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />

            {/* Live links — on mobile this is the main conversion path. */}
            <address className="mt-5 space-y-1.5 text-[0.95rem] not-italic opacity-80">
              <p>{site.legalName}</p>
              <p>{addressLine}</p>
              <p>
                <a href={site.phoneHref} className="hover:underline">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="hover:underline">
                  {site.email}
                </a>
              </p>
            </address>

            <div className="mt-5 space-y-1.5 text-[0.95rem] opacity-80">
              {site.hours.map((row) => (
                <p key={row.days.join()}>
                  {formatDays(row.days)}, {formatTime(row.opens)} –{' '}
                  {formatTime(row.closes)}
                </p>
              ))}
              <p className="opacity-75">{site.hoursNote}</p>
            </div>

            <ul className="mt-5 flex items-center gap-2">
              {site.social.map((channel) => {
                const Icon = socialIcons[channel.label]
                return (
                  <li key={channel.href}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Brio Health on ${channel.label}`}
                      className="flex h-10 w-10 items-center justify-center rounded-pill border border-current/25 transition-colors hover:border-current/60 hover:bg-current/10"
                    >
                      <Icon className="h-[1.15rem] w-[1.15rem]" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <nav aria-label="Services">
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.2em] uppercase opacity-55">
              Services
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="opacity-80 hover:opacity-100"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Quick links">
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.2em] uppercase opacity-55">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="opacity-80 hover:opacity-100">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-11 border-t border-current/15 pt-8">
          <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div>
              <h2 className="text-base">Stay in touch</h2>
              <p className="mt-2 text-[0.95rem] opacity-70">
                Occasional notes on health, recipes and what&rsquo;s happening at the
                clinic. No spam.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <DotRule className="mt-11 h-2 w-28 opacity-30" />

        <div className="mt-4 flex flex-col gap-4 text-[0.85rem] opacity-60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}
          </p>
          <ul className="flex gap-4">
            {footerLegal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
