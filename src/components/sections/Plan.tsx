import { Bud } from '@/components/brand/Bud'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Reveal } from '@/components/ui/Reveal'
import { StepList } from '@/components/ui/StepList'
import type { HomeContent } from '@/lib/content/home'
import { BOOKING_PATH } from '@/lib/site'

/**
 * Wireframe section 6 on a full-width tide field: the heading in the serif
 * with its line in sans, the three steps as a real sequence
 * (Funnel Display numerals, serif titles, sans bodies), the clay booking
 * button. From lg the steps run across under the heading, as in the
 * wireframe. The medium paper bud sits near the field's top right (spec 3.7).
 * The rule along the steps (down their left, across their top from lg) is
 * `.plan-line`, drawn by scroll in motion.css; it is a sibling of the list,
 * never inside it.
 */
export function Plan({ content, cta }: { content: HomeContent['plan']; cta: string }) {
  return (
    <Field as="section" aria-labelledby="plan-heading" className="section-y relative overflow-x-clip">
      <Bud size="medium" colour="paper" hideBelow={false} className="top-10 right-[4%] lg:right-[3%]" />
      <div className="container-x grid gap-8 lg:gap-10">
        <Reveal>
          <h2 id="plan-heading" className="max-w-[14ch] text-h2 lg:max-w-none">
            {content.heading}
          </h2>
          <p className="mt-3 max-w-[30ch] text-lede lg:max-w-none">{content.sentence}</p>
        </Reveal>
        <Reveal delay={80}>
          <div className="relative pl-8 lg:pt-8 lg:pl-0">
            <span aria-hidden className="plan-line absolute top-3 bottom-2 left-0 w-0.5 bg-paper lg:top-0 lg:right-0 lg:bottom-auto lg:h-0.5 lg:w-auto" />
            <StepList steps={content.steps} surface="tide" className="lg:grid-cols-3 lg:gap-x-7" />
          </div>
          <div className="mt-8 pl-8 lg:pl-0">
            <Button href={BOOKING_PATH} on="dark">
              {cta}
            </Button>
          </div>
        </Reveal>
      </div>
    </Field>
  )
}
