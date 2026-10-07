import Image from 'next/image'
import type { Icon } from '@phosphor-icons/react'
import { Certificate, MapPin, UsersThree } from '@phosphor-icons/react/dist/ssr'

import { QuoteList } from '@/components/ui/QuoteList'
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

          <div className="flex items-center gap-5 lg:col-span-5 lg:col-start-8">
            {/* The badge is a white-backed JPG multiplied into the paper. The
             * blend sits on the Reveal: while it fades it is its own stacking
             * context, and a blend inside it would only see that empty group,
             * so the white would show until the fade ended. */}
            <Reveal delay={200} className="w-40 shrink-0 mix-blend-multiply">
              <Image
                src={content.badge.src}
                alt={content.badge.alt}
                width={content.badge.width}
                height={content.badge.height}
                sizes="160px"
                className="h-auto w-full rounded-brand"
              />
            </Reveal>
            <Reveal delay={200}>
              <p className="font-medium">{content.badgeHeading}</p>
              <p className="mt-1 text-ink-soft">{content.badgeThanks}</p>
            </Reveal>
          </div>
        </div>

        {items.length > 0 && (
          <QuoteList items={items} className="mt-12 border-t border-grey pt-10" />
        )}
      </div>
    </section>
  )
}
