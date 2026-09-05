'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

import { Logo } from './Logo'
import { Button } from '@/components/ui/Button'
import { primaryNav, site } from '@/lib/site'

/**
 * Sits inside the teal band rather than on a bar of its own, so the page opens
 * as one field of colour. Dropdowns open on hover and focus-within, which gets
 * keyboard users the same behaviour without a focus trap.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="relative z-40">
      <div className="container-x flex items-center justify-between gap-6 py-4">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-md px-3.5 py-2 text-[0.95rem] opacity-85 transition-opacity hover:opacity-100"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                      aria-hidden
                    />
                  )}
                </Link>

                {item.children && (
                  <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="min-w-60 rounded-lg bg-canvas p-2 shadow-lg">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-md px-3.5 py-2.5 text-[0.925rem] text-ink-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            href={site.bookingUrl}
            variant="onTeal"
            className="hidden px-4 py-3 text-[0.925rem] sm:inline-flex"
          >
            Book Now
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="rounded-md p-2 lg:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-nav" aria-label="Primary" className="container-x pb-6 lg:hidden">
          <ul className="flex flex-col gap-1 border-t border-current/15 pt-4">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-base"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mb-2 ml-4 flex flex-col gap-0.5 border-l border-current/15 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1.5 text-[0.95rem] opacity-80"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <Button href={site.bookingUrl} variant="onTeal" className="mt-4 w-full sm:hidden">
            Book Now
          </Button>
        </nav>
      )}
    </header>
  )
}
