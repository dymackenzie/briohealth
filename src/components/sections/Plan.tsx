import { DotBurst } from '@/components/brand/DotBurst'
import { Field } from '@/components/ui/Field'
import { Reveal } from '@/components/ui/Reveal'
import { StepList } from '@/components/ui/StepList'
import type { HomeContent } from '@/lib/content/home'

/**
 * Heading on the white side, the three steps on a teal field on columns
 * 6-12. The field runs off the right edge of the page, mirroring the hero's
 * field on the left, and fills the section's height so it meets the
 * neighbouring sections on straight edges. The steps are the one real
 * sequence on the page, so they keep their numbers.
 *
 * The rule down the left of the steps is what Task 15 draws as you scroll
 * (`.plan-line`); without support it is simply drawn. It is a sibling of the
 * list, never inside it. Dot burst #2 sits under the heading, in teal.
 *
 * Mobile: heading first, then the field full width.
 */
export function Plan({ content }: { content: HomeContent['plan'] }) {
  return (
    <section aria-labelledby="plan-heading" className="container-edge relative overflow-x-clip">
      <div className="container-x grid-12">
        <Reveal className="col-span-12 pt-[var(--section-y)] pb-12 lg:col-span-4 lg:pb-[var(--section-y)]">
          <h2 id="plan-heading" className="max-w-[12ch] text-h2">
            {content.heading}
          </h2>
          <p className="mt-5 max-w-[30ch] text-ink-soft">{content.intro}</p>
          <DotBurst animate="reveal" className="mt-12 h-auto w-28 text-teal lg:w-36" />
        </Reveal>

        {/* Negative margin to the viewport edge, padded back to the
            container's, so the text stays on the grid. */}
        <Field className="col-span-12 -mx-[var(--edge)] px-[var(--edge)] py-14 lg:col-span-7 lg:col-start-6 lg:ml-0 lg:py-[var(--section-y)] lg:pl-16">
          <div className="relative pl-8 lg:pl-12">
            <span aria-hidden className="plan-line absolute top-3 bottom-2 left-0 w-0.5 origin-top bg-paper" />
            <StepList steps={content.steps} surface="teal" />
          </div>
        </Field>
      </div>
    </section>
  )
}
