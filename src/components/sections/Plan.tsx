import { Bud } from '@/components/brand/Bud'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Reveal } from '@/components/ui/Reveal'
import { StepList } from '@/components/ui/StepList'
import type { HomeContent } from '@/lib/content/home'
import { BOOKING_PATH } from '@/lib/site'

/**
 * Wireframe section 6 on a full-width teal field (teal field 2 of 2): the
 * heading in the serif with its line in sans (paper is display-only on
 * teal), the three steps as a real sequence
 * (Funnel Display numerals, serif titles, sans bodies), the clay booking
 * button. The medium paper bud sits near the field's top right (spec 3.7).
 * The rule down the left of the steps is `.plan-line`, drawn by scroll in
 * motion.css; it is a sibling of the list, never inside it.
 */
export function Plan({ content, cta }: { content: HomeContent['plan']; cta: string }) {
  return (
    <Field as="section" aria-labelledby="plan-heading" className="section-y relative overflow-x-clip">
      <Bud size="medium" colour="paper" hideBelow={false} className="top-10 right-[4%] lg:right-[3%]" />
      <div className="container-x grid gap-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <h2 id="plan-heading" className="max-w-[14ch] text-h2">
            {content.heading}
          </h2>
          <p className="mt-3 max-w-[30ch] text-lede">{content.sentence}</p>
        </Reveal>
        <Reveal delay={80} className="lg:col-span-7 lg:col-start-6">
          <div className="relative pl-8 lg:pl-12">
            <span aria-hidden className="plan-line absolute top-3 bottom-2 left-0 w-0.5 origin-top bg-paper" />
            <StepList steps={content.steps} surface="teal" />
          </div>
          <div className="mt-8 pl-8 lg:pl-12">
            <Button href={BOOKING_PATH} on="teal">
              {cta}
            </Button>
          </div>
        </Reveal>
      </div>
    </Field>
  )
}
