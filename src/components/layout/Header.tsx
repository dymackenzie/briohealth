'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CaretDown, List, X } from '@phosphor-icons/react'

import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { nav, type SiteSettings } from '@/lib/site'

/**
 * 72px, paper, one line at 1024px: logo, four items, the booking button.
 * Dropdowns open on hover and focus-within so keyboard users get the same
 * thing without a focus trap. The dropdown carries the site's only shadow.
 * Escape shuts an open dropdown (it stays shut until the pointer and focus
 * leave that item) or the mobile menu, and puts focus back on its trigger.
 *
 * Below 1024 the menu is always in the markup. With JavaScript it is hidden
 * until the toggle opens it; without JavaScript there is no toggle and the
 * list shows under the header row (rules in globals.css, behind `.js`).
 *
 * The logo is the stacked lockup, so its width is only 1.2x its height. At
 * 56px tall it is 67px wide, the HEALTH line is legible, and it leaves 8px
 * above and below inside the 72px bar.
 */
export function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState<string | null>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // The root layout's inline script sets this before hydration on every
  // server-rendered document. A request-time notFound() is client-rendered
  // from Next's empty shell, where React inserts that script inert.
  useEffect(() => {
    document.documentElement.classList.add('js')
  }, [])

  function closeMenuOnEscape(event: React.KeyboardEvent) {
    if (event.key !== 'Escape' || !open) return
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <header className="border-b border-grey bg-paper" onKeyDown={closeMenuOnEscape}>
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Logo height={56} />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const shut = dismissed === item.href
              return (
                <li
                  key={item.href}
                  className="group relative"
                  onKeyDown={(event) => {
                    if (event.key !== 'Escape' || !item.children) return
                    setDismissed(item.href)
                    event.currentTarget.querySelector('a')?.focus()
                  }}
                  onMouseLeave={() => shut && setDismissed(null)}
                  onBlur={(event) => {
                    if (shut && !event.currentTarget.contains(event.relatedTarget)) setDismissed(null)
                  }}
                >
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 rounded-brand px-3.5 py-2 font-medium text-ink hover:text-teal-deep"
                  >
                    {item.label}
                    {item.children && (
                      <CaretDown
                        size={14}
                        aria-hidden
                        className={`transition-transform duration-200 motion-reduce:transition-none ${shut ? '' : 'group-focus-within:rotate-180 group-hover:rotate-180'}`}
                      />
                    )}
                  </Link>

                  {item.children && (
                    <div
                      className={`invisible absolute top-full left-0 pt-2 opacity-0 transition-[opacity,visibility] duration-200 motion-reduce:transition-none ${shut ? '' : 'group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100'}`}
                    >
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
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* Wrapped: Button's own inline-flex would beat a `hidden` passed to it. */}
          <div className="hidden md:block">
            <Button href={settings.bookingUrl}>{settings.ctaLabel}</Button>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            data-menu-toggle
            className="rounded-brand p-2 lg:hidden"
          >
            {open ? <X size={28} aria-hidden /> : <List size={28} aria-hidden />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary"
        data-mobile-nav
        data-open={open || undefined}
        className="container-x border-t border-grey pt-4 pb-6 lg:hidden"
      >
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
        <div className="mt-4 md:hidden">
          <Button href={settings.bookingUrl} className="w-full">
            {settings.ctaLabel}
          </Button>
        </div>
      </nav>
    </header>
  )
}
