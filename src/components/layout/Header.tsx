'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { resolveHref } from '@/lib/resolveHref'
import Button from '@/components/ui/Button'

interface HeaderProps {
  navigation: any
  settings: any
}

export default function Header({ navigation, settings }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const janeUrl = settings?.janeUrl || 'https://yourbriohealth.janeapp.com'
  const bookLabel = settings?.bookingLabel || 'Book Now'
  const phone = settings?.phone || '(604) 271-9355'
  const primaryNav = navigation?.primary || []
  const ctaLink = navigation?.ctaButton?.link
    ? resolveHref(navigation.ctaButton.link)
    : janeUrl

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-canvas/95 backdrop-blur-md shadow-sm border-b border-sand-300'
          : 'bg-canvas/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,3rem)]">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-xl font-semibold text-ink-900 tracking-tight">
              Brio Health
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
            {primaryNav.map((item: any) => {
              if (item.type === 'dropdown') {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-3 py-2 font-body text-[0.9375rem] text-ink-700 hover:text-teal-500 transition-colors rounded-[var(--r-md)] cursor-pointer">
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 pt-2 z-50">
                        <div className="bg-paper rounded-[var(--r-lg)] shadow-lg border border-sand-300 p-4 min-w-[220px]">
                          {item.columns?.map((col: any) => (
                            <div key={col.heading}>
                              {col.heading && (
                                <p className="text-[0.75rem] font-semibold uppercase tracking-widest text-ink-300 px-2 mb-2">{col.heading}</p>
                              )}
                              {col.items?.map((subItem: any) => (
                                <Link
                                  key={subItem.label}
                                  href={resolveHref(subItem.link) || '#'}
                                  className="flex items-start gap-3 px-2 py-2 rounded-[var(--r-md)] hover:bg-sand-200 transition-colors group"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <div>
                                    <p className="font-body font-medium text-ink-900 text-[0.9375rem] group-hover:text-teal-500 transition-colors">
                                      {subItem.label}
                                    </p>
                                    {subItem.description && (
                                      <p className="text-ink-500 text-[0.8125rem] mt-0.5">{subItem.description}</p>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={resolveHref(item.link) || '#'}
                  className="px-3 py-2 font-body text-[0.9375rem] text-ink-700 hover:text-teal-500 transition-colors rounded-[var(--r-md)]"
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: phone + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="text-[0.875rem] font-body text-ink-500 hover:text-teal-500 transition-colors"
            >
              {phone}
            </a>
            <Button href={ctaLink} external={ctaLink.startsWith('http')} size="sm">
              {bookLabel}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-[var(--r-md)] text-ink-700 hover:bg-sand-200 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-canvas z-40 overflow-y-auto">
          <div className="flex flex-col p-6 gap-1">
            {primaryNav.map((item: any) => {
              if (item.type === 'dropdown') {
                return (
                  <MobileDropdown key={item.label} item={item} onClose={() => setMobileOpen(false)} />
                )
              }
              return (
                <Link
                  key={item.label}
                  href={resolveHref(item.link) || '#'}
                  className="py-3.5 px-4 font-body font-medium text-lg text-ink-900 border-b border-sand-300 hover:text-teal-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="mt-6 flex flex-col gap-3">
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-teal-500 font-body font-semibold text-lg">
                <Phone size={18} /> {phone}
              </a>
              <Button href={ctaLink} external size="lg" className="w-full justify-center">
                {bookLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function MobileDropdown({ item, onClose }: { item: any; onClose: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        className="w-full flex items-center justify-between py-3.5 px-4 font-body font-medium text-lg text-ink-900 border-b border-sand-300 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {item.label}
        <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pl-4 bg-sand-200/50">
          {item.columns?.flatMap((col: any) => col.items || []).map((sub: any) => (
            <Link
              key={sub.label}
              href={resolveHref(sub.link) || '#'}
              className="block py-3 px-4 font-body text-ink-700 hover:text-teal-500 border-b border-sand-300/50"
              onClick={onClose}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
