import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent } from '@/lib/content/home'
import { BOOKING_PATH } from '@/lib/site'

/**
 * Wireframe section 7 (the wireframe numbers it 6 twice): the serif
 * heading, its italic line and the booking button in columns 1-5 on the
 * page's left edge, the paragraphs in order as one readable column at 6-12.
 * The button comes last in the markup, so below lg it follows the text.
 */
export function Explain({ content, cta }: { content: HomeContent['explain']; cta: string }) {
  return (
    <section aria-labelledby="explain-heading" className="container-x section-y grid gap-6 lg:grid-cols-12 lg:gap-x-7 lg:gap-y-8">
      <Reveal className="lg:col-span-5">
        <h2 id="explain-heading" className="max-w-[16ch] text-h2">
          {content.heading}
        </h2>
        <p className="text-tagline mt-3">{content.sentence}</p>
      </Reveal>
      <Reveal delay={80} className="grid max-w-[68ch] gap-4 text-body lg:col-span-7 lg:col-start-6 lg:row-span-2">
        {content.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Reveal>
      <Reveal delay={160} className="mt-2 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:mt-0">
        <Button href={BOOKING_PATH}>{cta}</Button>
      </Reveal>
    </section>
  )
}
