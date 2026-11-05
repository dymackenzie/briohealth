import { Bud } from '@/components/brand/Bud'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent } from '@/lib/content/home'
import { BOOKING_PATH } from '@/lib/site'

/**
 * Wireframe section 7 (the wireframe numbers it 6 twice), one readable
 * column (68ch) set left of centre (columns 2-10 at lg, as in
 * scroll-three.html): the serif heading and its italic line, the
 * paragraphs in order and the booking button. The small teal bud sits low
 * in the open right-hand column.
 */
export function Explain({ content, cta }: { content: HomeContent['explain']; cta: string }) {
  return (
    <section aria-labelledby="explain-heading" className="container-x section-y relative">
      <Bud size="small" colour="teal" hideBelow="lg" className="right-[8%] bottom-[22%] lg:right-[7%]" />
      <div className="max-w-[68ch] lg:ml-[8.333%]">
        <Reveal>
          <h2 id="explain-heading" className="text-h2">
            {content.heading}
          </h2>
          <p className="text-tagline mt-3">{content.sentence}</p>
        </Reveal>
        <Reveal delay={80} className="mt-6 grid gap-4 text-body">
          {content.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
        <Reveal delay={160} className="mt-8">
          <Button href={BOOKING_PATH}>{cta}</Button>
        </Reveal>
      </div>
    </section>
  )
}
