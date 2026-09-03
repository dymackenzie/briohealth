'use client'

import React from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { resolveHref } from '@/lib/resolveHref'

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  )
}

type IconComponent = ({ size }: { size?: number }) => React.ReactElement

const SOCIAL_ICONS: Record<string, IconComponent> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
}

interface FooterProps {
  navigation: any
  settings: any
}

export default function Footer({ navigation, settings }: FooterProps) {
  const janeUrl = settings?.janeUrl || 'https://yourbriohealth.janeapp.com'
  const phone = settings?.phone || '(604) 271-9355'
  const email = settings?.email || 'info@yourbriohealth.com'
  const address = settings?.addressLine || '2168 – 3779 Sexsmith Road'
  const city = settings?.city || 'Richmond, BC'
  const blurb = settings?.footerBlurb || 'Integrative health care for your whole self. Serving Richmond BC since 2006.'
  const social = settings?.social || []
  const footerColumns = navigation?.footerColumns || []

  return (
    <footer className="bg-teal-700 text-white" role="contentinfo">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,3rem)] py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1 — Brand */}
          <div>
            <div className="mb-4">
              <span className="font-display text-2xl font-semibold text-white">Brio Health</span>
              <p className="text-teal-100 text-[0.875rem] mt-1">Inc.</p>
            </div>
            <p className="text-teal-100/80 text-[0.9375rem] leading-relaxed mb-5">{blurb}</p>

            <div className="space-y-2.5 text-[0.9rem] text-teal-100">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="shrink-0 mt-0.5 text-teal-300" />
                <div>
                  <div>{address}</div>
                  <div>{city}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-teal-300" />
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-teal-300" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </div>
            </div>

            {/* Social */}
            {social.length > 0 && (
              <div className="flex gap-3 mt-5">
                {social.map((s: any) => {
                  const Icon = SOCIAL_ICONS[s.platform?.toLowerCase()] || null
                  return (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="w-9 h-9 rounded-full bg-teal-600 hover:bg-teal-500 flex items-center justify-center transition-colors"
                    >
                      {Icon && <Icon size={16} />}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Dynamic footer columns */}
          {footerColumns.map((col: any) => (
            <div key={col.heading}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-teal-300 mb-4">{col.heading}</h3>
              <ul className="space-y-2.5">
                {col.items?.map((item: any) => (
                  <li key={item.label}>
                    <Link
                      href={resolveHref(item.link) || '#'}
                      className="text-teal-100/80 hover:text-white transition-colors text-[0.9375rem]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter CTA in footer */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-teal-300 mb-4">
              {settings?.newsletterHeading || 'Stay Well'}
            </h3>
            <p className="text-teal-100/80 text-[0.9375rem] mb-4">
              {settings?.newsletterSubtext || 'Health tips, recipes, and clinic news — right to your inbox.'}
            </p>
            <FooterNewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-teal-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-teal-100/60 text-[0.8125rem]">
          <p>© {new Date().getFullYear()} Brio Health Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterNewsletterForm() {
  return (
    <form
      action="/api/newsletter"
      method="POST"
      className="flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        const form = e.currentTarget
        const data = new FormData(form)
        await fetch('/api/newsletter', {
          method: 'POST',
          body: JSON.stringify({ email: data.get('email') }),
          headers: { 'Content-Type': 'application/json' },
        })
      }}
    >
      <input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="flex-1 px-3 py-2 rounded-[var(--r-md)] bg-teal-600/50 border border-teal-500 text-white placeholder-teal-300/60 text-[0.875rem] focus:outline-none focus:border-teal-300 min-w-0"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-coral-500 hover:bg-coral-500/90 text-white text-[0.875rem] font-semibold rounded-[var(--r-pill)] shrink-0 cursor-pointer transition-colors"
      >
        Join
      </button>
    </form>
  )
}
