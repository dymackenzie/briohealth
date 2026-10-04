import Image from 'next/image'
import type { Icon } from '@phosphor-icons/react'
import { Certificate, MapPin, UsersThree } from '@phosphor-icons/react/dist/ssr'

import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent, TrustIcon } from '@/lib/content/home'
import type { Testimonial } from '@/lib/content/testimonials'

const icons: Record<TrustIcon, Icon> = {
  certificate: Certificate,
  'map-pin': MapPin,
  users: UsersThree,
}

/**
 * Wireframe sections 3 and 4 (spec 4.3, mockups editorial-d1-final.html
 * and scroll-three.html): three stat lines in the serif, each with a
 * Phosphor icon and a clay mark (not a big-number template: the phrases
 * are the content); the Best of Richmond 2025 badge with the live caption;
 * the two testimonials verbatim in serif italic at the quote size, each
 * with a hanging teal quotation mark in the margin column (column 1) and
 * the name in small Funnel Sans. Stats and badge share a row at lg.
 */
export function Trust({ content, items }: { content: HomeContent['trust']; items: Testimonial[] }) {
  return (
    <section aria-label="Why Brio Health" className="border-t border-grey">
      <div className="container-x section-y">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-7">
          <ul className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
            {content.stats.map((stat, i) => {
              const StatIcon = icons[stat.icon]
              return (
                <Reveal as="li" key={stat.text} delay={i * 70}>
                  <StatIcon size={28} aria-hidden className="text-teal" />
                  <p className="text-stat mt-3 max-w-[12ch]">{stat.text}</p>
                  <span aria-hidden className="mt-3 block h-1 w-10 bg-clay" />
                </Reveal>
              )
            })}
          </ul>

          <Reveal delay={200} className="flex items-center gap-5 lg:col-span-5 lg:col-start-8">
            <Image
              src={content.badge.src}
              alt={content.badge.alt}
              width={content.badge.width}
              height={content.badge.height}
              sizes="160px"
              className="h-auto w-40 shrink-0 rounded-brand"
            />
            <div>
              <p className="font-medium">{content.badgeHeading}</p>
              <p className="mt-1 text-ink-soft">{content.badgeThanks}</p>
            </div>
          </Reveal>
        </div>

        {items.length > 0 && (
          <ul className="mt-12 grid gap-y-10 border-t border-grey pt-10">
            {items.map((item, i) => (
              <Reveal as="li" key={item.name} delay={i * 80} className="grid-12 gap-y-3">
                <figure className="contents">
                  {/* The hanging mark: serif, teal, in the margin column; inline on phones. */}
                  <span
                    aria-hidden
                    className="col-span-12 font-serif text-[clamp(3.5rem,5.2vw,4.75rem)] leading-[0.75] font-medium text-teal lg:col-span-1 lg:text-right"
                  >
                    {'“'}
                  </span>
                  <blockquote className="text-quote col-span-12 lg:col-span-10 lg:col-start-2">{item.quote}</blockquote>
                  <figcaption className="col-span-12 text-small text-ink-soft lg:col-span-10 lg:col-start-2">{item.name}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
