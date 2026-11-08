import Image from 'next/image'

import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent } from '@/lib/content/home'
import { BOOKING_PATH } from '@/lib/site'

/**
 * Wireframe section 5, empathy and competency: the serif heading and the
 * italic line, then two stats side by side in columns 1-7 (the line in
 * the serif and its sentence; the reviews sentence links to Google) beside
 * the Best of Richmond badge with its caption, and the booking link.
 */
export function Trust({ content, cta }: { content: HomeContent['trust']; cta: string }) {
  return (
    <section aria-labelledby="trust-heading" className="container-x section-y">
      <Reveal>
        <h2 id="trust-heading" className="text-h2">
          {content.heading}
        </h2>
        <p className="text-tagline mt-3">{content.sentence}</p>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-7">
        <ul className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
          {content.stats.map((stat, i) => (
            <Reveal as="li" key={stat.title} delay={i * 70}>
              <p className="text-stat max-w-[16ch]">{stat.title}</p>
              <p className="mt-2 max-w-[34ch]">
                {stat.link ? (
                  <a href={stat.link} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-4 hover:decoration-2">
                    {stat.body}
                  </a>
                ) : (
                  stat.body
                )}
              </p>
            </Reveal>
          ))}
        </ul>

        <div className="flex items-center gap-5 lg:col-span-5 lg:col-start-8">
          {/* The badge is multiplied into the paper, for a white-backed JPG. The
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

      <Reveal delay={240} className="mt-10">
        <Button href={BOOKING_PATH} variant="quiet">
          {cta}
        </Button>
      </Reveal>
    </section>
  )
}
