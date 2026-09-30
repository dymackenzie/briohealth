'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'

import { Figure } from '@/components/ui/Figure'
import type { Photo } from '@/lib/content/photos'

export interface ServiceRowItem {
  slug: string
  title: string
  href: string
  outcome: string
  subject: string
  photo: Photo | null
}

/**
 * The three services as large type rows. On a fine pointer, hovering or
 * focusing a row swaps the 4/5 photo in the panel beside them (feedback,
 * the one job of this motion). On touch, and below lg, the photo sits inline
 * under each row, so nothing depends on hover. The panel stacks every photo
 * in one cell and crossfades to the active one; reduced motion swaps without
 * the fade.
 */
export function ServiceRows({ heading, items }: { heading: string; items: ServiceRowItem[] }) {
  const [active, setActive] = useState(0)

  return (
    <section aria-labelledby="services-heading" className="container-x section-y">
      <h2 id="services-heading" className="text-h2">
        {heading}
      </h2>

      <div className="mt-12 lg:grid-12 lg:items-start">
        <ul className="border-t border-grey lg:col-span-7">
          {items.map((item, i) => (
            <li key={item.slug} className="border-b border-grey">
              <Link
                href={item.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid gap-3 py-8 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <span className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-none font-medium tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none">
                  {item.title}
                </span>
                <ArrowRight
                  size={28}
                  aria-hidden
                  className="hidden text-teal transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none sm:block"
                />
                <span className="max-w-[48ch] text-ink-soft sm:col-span-2">{item.outcome}</span>
                {/* Hidden from the link's name: the title and outcome already say it.
                    4/5, as in the panel: the registry crops are cut for it, and
                    a square reveals Dr. Lee at the edge of the frame. */}
                <div aria-hidden className="mt-2 w-full max-w-64 sm:col-span-2 lg:pointer-fine:hidden">
                  <Figure subject={item.subject} photo={item.photo} aspect="4/5" sizes="256px" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {items.length > 0 && (
          <div
            aria-hidden
            className="hidden lg:sticky lg:top-8 lg:col-span-4 lg:col-start-9 lg:pointer-fine:grid"
          >
            {items.map((item, i) => (
              <Figure
                key={item.slug}
                subject={item.subject}
                photo={item.photo}
                aspect="4/5"
                sizes="(min-width: 1280px) 390px, 32vw"
                className={`[grid-area:1/1] transition-[opacity,scale] duration-300 ease-out-expo motion-reduce:transition-none ${
                  i === active ? 'opacity-100' : 'scale-[0.98] opacity-0'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
