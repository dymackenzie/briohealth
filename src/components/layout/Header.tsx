'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CaretDown, List, X } from '@phosphor-icons/react'

import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { nav, type SiteSettings } from '@/lib/site'

/**
 * 72px, paper, one line at 1024px: logo, four items, the booking button.
 * Dropdowns open on hover and focus-within so keyboard users get the same
 * thing without a focus trap. The dropdown carries the site's only shadow.
 *
 * The logo is the stacked lockup, so its width is only 1.2x its height. At
 * 56px tall it is 67px wide, the HEALTH line is legible, and it leaves 8px
 * above and below inside the 72px bar.
 */
export function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-grey bg-paper">
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Logo height={56} />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-brand px-3.5 py-2 font-medium text-ink hover:text-teal-deep"
                >
                  {item.label}
                  {item.children && (
                    <CaretDown
                      size={14}
                      aria-hidden
                      className="transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180 motion-reduce:transition-none"
                    />
                  )}
                </Link>

                {item.children && (
                  <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition-[opacity,visibility] duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 motion-reduce:transition-none">
                    <ul className="min-w-64 rounded-brand border border-grey bg-paper p-2 shadow-dropdown">
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <Link
                            href={child.href}
                            className="block rounded-brand px-3.5 py-2.5 text-ink hover:bg-grey"
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
          <Button href={settings.bookingUrl} className="hidden md:inline-flex">
            {settings.ctaLabel}
          </Button>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-brand p-2 lg:hidden"
          >
            {open ? <X size={28} aria-hidden /> : <List size={28} aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="container-x border-t border-grey pt-4 pb-6 lg:hidden">
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-2.5 font-medium">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mb-2 ml-4 flex flex-col border-l border-grey pl-4">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>
                        <Link href={child.href} onClick={() => setOpen(false)} className="block py-2 text-ink-soft">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <Button href={settings.bookingUrl} className="mt-4 w-full md:hidden">
            {settings.ctaLabel}
          </Button>
        </nav>
      )}
    </header>
  )
}
