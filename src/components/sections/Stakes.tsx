import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent } from '@/lib/content/home'

/**
 * One oversized statement, then the clinic's five symptoms as short text
 * blocks under teal top rules, 3+2 on desktop, 2 columns on tablet, one on
 * phones. No cards, no icons, no numbers.
 */
export function Stakes({ content }: { content: HomeContent['stakes'] }) {
  return (
    <section aria-labelledby="stakes-heading" className="container-x section-y">
      <Reveal>
        <h2 id="stakes-heading" className="max-w-[16ch] text-h2">
          {content.statement}
        </h2>
      </Reveal>
      <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item, i) => (
          <Reveal as="li" key={item} delay={i * 70} className="border-t-2 border-teal pt-4 text-lede">
            {item}
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
