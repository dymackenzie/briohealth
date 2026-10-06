import { Bud } from '@/components/brand/Bud'
import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent } from '@/lib/content/home'
import type { ReactNode } from 'react'

/**
 * Wireframe section 2 in layout "D1" (spec 4.2, mockup
 * editorial-d1-final.html): the heading set small (Funnel Sans 600, about
 * 20px, teal-deep) as the section's real h2, no eyebrow; the four
 * questions as the dominant element in large serif, one per line; the
 * two paragraphs in columns 7-12 below them; the large teal bud in the
 * open space right of the questions. `children` is the service list,
 * which the spec places after the paragraphs inside this section.
 */
export function Stakes({ content, children }: { content: HomeContent['stakes']; children?: ReactNode }) {
  return (
    <section aria-labelledby="stakes-heading" className="container-x section-y relative">
      <Bud size="large" colour="teal" className="top-[calc(var(--section-y)+3rem)] right-[6%] lg:right-[10%]" />
      <Reveal>
        <h2 id="stakes-heading" className="font-sans text-[1.25rem] leading-snug font-semibold tracking-normal text-teal-deep">
          {content.heading}
        </h2>
        <ul className="text-questions mt-4">
          {content.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </Reveal>
      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-7">
        <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
          {content.paragraphs.map((p) => (
            <p key={p} className="mt-4 text-body first:mt-0">
              {p}
            </p>
          ))}
        </Reveal>
      </div>
      {children && <div className="mt-10">{children}</div>}
    </section>
  )
}
