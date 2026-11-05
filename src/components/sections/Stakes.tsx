import { Bud } from '@/components/brand/Bud'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent } from '@/lib/content/home'
import { BOOKING_PATH } from '@/lib/site'

/**
 * Wireframe section 2: the serif heading with the italic question under
 * it, then the eight statements in two columns between 1px ink rules, row
 * by row like the wireframe's table, and the booking button. The large
 * teal bud sits in the open space right of the heading.
 */
export function Stakes({ content, cta }: { content: HomeContent['stakes']; cta: string }) {
  return (
    <section aria-labelledby="stakes-heading" className="container-x section-y relative">
      <Bud size="large" colour="teal" className="top-[var(--section-y)] right-[6%] lg:right-[10%]" />
      <Reveal>
        <h2 id="stakes-heading" className="text-h2">
          {content.heading}
        </h2>
        <p className="text-tagline mt-3">{content.sentence}</p>
      </Reveal>
      <Reveal delay={80}>
        <ul className="mt-8 grid sm:grid-cols-2 sm:gap-x-7">
          {content.points.map((point) => (
            <li key={point} className="text-stat border-b border-ink py-4 first:border-t sm:nth-2:border-t">
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button href={BOOKING_PATH}>{cta}</Button>
        </div>
      </Reveal>
    </section>
  )
}
