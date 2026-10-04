'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CaretDown, List, X } from '@phosphor-icons/react'

import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { BOOKING_PATH, currentState, nav, type SiteSettings } from '@/lib/site'

/**
 * 88px, no fill of its own so the body's grain runs under it, a 1px ink
 * rule under it (spec 3.6), one line at 1024px: logo (72px), three items,
 * the clay booking button. The dropdown keeps a solid paper fill. The
 * header is `relative z-40`: the homepage hero's transformed layers
 * create stacking contexts painted after the header, and without a
 * z-index the open
 * dropdown sat underneath them (hovering "Acupuncture" hit the hero).
 * Nothing on a page sits above z-40.
 *
 * Hover and the current page are a 3px clay underline under ink text (the
 * only clay in the header besides the button). `currentState` gives the
 * page's own link `aria-current="page"` and its parent "true"; the
 * underline keys on the attribute, so both carry it. Dropdowns open on hover
 * and focus-within; Escape shuts an open dropdown or the mobile menu and
 * returns focus to its trigger.
 *
 * Below 1024 the menu is always in the markup. With JavaScript it is hidden
 * until the toggle opens it; without JavaScript there is no toggle and the
 * list shows under the header row (rules in globals.css, behind `.js`).
 */

const underline =
  'relative after:absolute after:inset-x-3.5 after:bottom-1 after:h-[3px] after:bg-clay after:opacity-0 after:transition-opacity after:duration-200 ' +
  'hover:after:opacity-100 aria-[current]:after:opacity-100 motion-reduce:after:transition-none'

const mobileCurrent =
  'aria-[current]:underline aria-[current]:decoration-clay aria-[current]:decoration-[3px] aria-[current]:underline-offset-4'

export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState<string | null>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // The root layout's inline script sets this before hydration on every
  // server-rendered document. A request-time notFound() is client-rendered
  // from Next's empty shell, where React inserts that script inert.
  useEffect(() => {
    document.documentElement.classList.add('js')
  }, [])

  // On the document, not the header: a dropdown opened by hover has to close
  // on Escape wherever focus happens to be.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return

      if (open) {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }

      const item = document.querySelector<HTMLElement>('[data-dropdown]:is(:hover, :focus-within)')
      if (!item?.dataset.dropdown) return
      setDismissed(item.dataset.dropdown)
      if (item.contains(document.activeElement)) item.querySelector('a')?.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="relative z-40 border-b border-ink bg-paper">
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Logo height={72} />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const shut = dismissed === item.href
              return (
                <li
                  key={item.href}
                  className="group relative"
                  data-dropdown={item.children ? item.href : undefined}
                  onMouseLeave={() => shut && setDismissed(null)}
                  onBlur={(event) => {
                    if (shut && !event.currentTarget.contains(event.relatedTarget)) setDismissed(null)
                  }}
                >
                  <Link
                    href={item.href}
                    aria-current={currentState(item.href, pathname, item.children)}
                    className={`inline-flex items-center gap-1 rounded-brand px-3.5 py-2 font-medium text-ink ${underline}`}
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
                              aria-current={currentState(child.href, pathname)}
                              className="block rounded-brand px-3.5 py-2.5 text-ink hover:bg-grey aria-[current=page]:font-medium"
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
            <Button href={BOOKING_PATH}>{settings.ctaLabel}</Button>
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
              <Link
                href={item.href}
                aria-current={currentState(item.href, pathname, item.children)}
                onClick={() => setOpen(false)}
                className={`block py-2.5 font-medium ${mobileCurrent}`}
              >
                {item.label}
              </Link>
              {item.children && (
                <ul className="mb-2 ml-4 flex flex-col border-l border-grey pl-4">
                  {item.children.map((child) => (
                    <li key={child.href + child.label}>
                      <Link
                        href={child.href}
                        aria-current={currentState(child.href, pathname)}
                        onClick={() => setOpen(false)}
                        className={`block py-2 text-ink-soft aria-[current]:text-ink ${mobileCurrent}`}
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
        <div className="mt-4 md:hidden">
          <Button href={BOOKING_PATH} className="w-full">
            {settings.ctaLabel}
          </Button>
        </div>
      </nav>
    </header>
  )
}
