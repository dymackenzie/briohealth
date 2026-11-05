import type { Icon } from '@phosphor-icons/react'
import { HandHeart, Path, Plant, Scales } from '@phosphor-icons/react/dist/ssr'

import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent, ValueIcon } from '@/lib/content/home'
import { BOOKING_PATH } from '@/lib/site'

const icons: Record<ValueIcon, Icon> = {
  path: Path,
  plant: Plant,
  scales: Scales,
  'hand-heart': HandHeart,
}

/**
 * Wireframe section 3, the value proposition, on a sand panel: the serif
 * heading, the italic line and the button in columns 1-5, the four points
 * in two columns at 6-12, each under a Phosphor icon ("find visual icons").
 * Teal-deep icons, since plain teal is faint on sand.
 */
export function Value({ content, cta }: { content: HomeContent['value']; cta: string }) {
  return (
    <section aria-labelledby="value-heading" className="bg-grey">
      <div className="container-x section-y grid gap-10 lg:grid-cols-12 lg:gap-7">
        <Reveal className="lg:col-span-5">
          <h2 id="value-heading" className="text-h2">
            {content.heading}
          </h2>
          <p className="text-tagline mt-3 max-w-[30ch]">{content.sentence}</p>
          <div className="mt-8">
            <Button href={BOOKING_PATH}>{cta}</Button>
          </div>
        </Reveal>
        <ul className="grid gap-8 sm:grid-cols-2 sm:gap-x-7 lg:col-span-7 lg:col-start-6">
          {content.points.map((point, i) => {
            const PointIcon = icons[point.icon]
            return (
              <Reveal as="li" key={point.text} delay={i * 70}>
                <PointIcon size={32} aria-hidden className="text-teal-deep" />
                <p className="mt-3 max-w-[28ch] text-lede font-medium">{point.text}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
