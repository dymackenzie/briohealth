import Link from 'next/link'

import { Logo } from './Logo'
import { DotRule } from '@/components/brand/DotBurst'
import { socialIcons } from '@/components/brand/SocialIcons'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { addressLine, footerLegal, formatDays, formatTime, site } from '@/lib/site'
import { services } from '@/lib/content/services'

const quickLinks = [
  { label: 'About Dr. Lee', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pickleball & Community', href: '/pickleball' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book an appointment', href: site.bookingUrl },
]

const link = 'link-draw text-canvas/80 hover:text-canvas'

// Column headings in the body face at body size — weight and colour carry the
// hierarchy, so no tracked caps.
const heading = 'font-body text-base font-semibold'

export function Footer() {
  return (
    <footer className="band-teal-deep">
      <div className="container-x pt-16 pb-10 lg:pt-24 lg:pb-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-10">
          <div className="md:col-span-2 lg:col-span-1">
            <Logo height={44} />
            <p className="mt-5 max-w-[30ch] text-canvas/80">{site.tagline}</p>

            {/* Live links — on mobile this is the main conversion path. */}
            <address className="mt-8 space-y-1 not-italic">
              <p>{addressLine}</p>
              <p>
                <a href={site.phoneHref} className={link}>
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </p>
            </address>

            <div className="mt-6 space-y-1">
              {site.hours.map((row) => (
                <p key={row.days.join()}>
                  {formatDays(row.days)}
                  <span className="block text-canvas/80">
                    {formatTime(row.opens)} – {formatTime(row.closes)}
                  </span>
                </p>
              ))}
              <p className="pt-2 text-small text-canvas/70">{site.hoursNote}</p>
            </div>

            <ul className="mt-8 flex items-center gap-2">
              {site.social.map((channel) => {
                const Icon = socialIcons[channel.label]
                return (
                  <li key={channel.href}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Brio Health on ${channel.label}`}
                      className="flex h-11 w-11 items-center justify-center rounded-pill border border-canvas/25 transition-colors duration-300 hover:border-canvas/70 hover:bg-canvas/10"
                    >
                      <Icon className="h-[1.15rem] w-[1.15rem]" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <nav aria-label="Services">
            <h2 className={heading}>Services</h2>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className={link}>
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className={link}>
                  All services
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="The clinic">
            <h2 className={heading}>The clinic</h2>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  {/^https?:\/\//.test(item.href) ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={link}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 grid gap-8 border-t border-canvas/15 pt-12 lg:mt-20 lg:grid-cols-[1fr_1.15fr] lg:items-end lg:gap-16">
          <div>
            <h2 className="text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)]">Stay in touch</h2>
            <p className="mt-3 max-w-[44ch] text-canvas/80">
              Occasional notes on health, recipes and what&rsquo;s happening at the
              clinic. No spam.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-canvas/15 pt-8 text-small text-canvas/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <DotRule className="h-2.5 w-24 shrink-0 text-clay-300" />
            <p>
              &copy; {new Date().getFullYear()} {site.legalName}
            </p>
          </div>
          <ul className="flex gap-6">
            {footerLegal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw hover:text-canvas">
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
