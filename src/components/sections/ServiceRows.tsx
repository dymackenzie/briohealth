'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
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
 * under each row, so nothing depends on hover. Reduced motion swaps without
 * the fade.
 */
export function ServiceRows({ heading, items }: { heading: string; items: ServiceRowItem[] }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const current = items[active] ?? items[0]

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

        {current && (
          <div
            aria-hidden
            className="hidden lg:sticky lg:top-8 lg:col-span-4 lg:col-start-9 lg:pointer-fine:block"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.slug}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Figure
                  subject={current.subject}
                  photo={current.photo}
                  aspect="4/5"
                  sizes="(min-width: 1280px) 390px, 32vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
