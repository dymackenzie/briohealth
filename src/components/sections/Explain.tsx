import { Bud } from '@/components/brand/Bud'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent } from '@/lib/content/home'
import { BOOKING_PATH, type SiteSettings } from '@/lib/site'

/**
 * Wireframe section 6, one readable column (68ch) set left of centre
 * (columns 2-10 at lg, as in scroll-three.html): the serif heading, the
 * paragraphs in order, "Here are the steps to transform your health:" with
 * Step 1-3, the closing line and the booking button. The small teal bud
 * sits low in the open right-hand column.
 */
export function Explain({ content, settings }: { content: HomeContent['explain']; settings: SiteSettings }) {
  return (
    <section aria-labelledby="explain-heading" className="container-x section-y relative">
      <Bud size="small" colour="teal" className="right-[8%] bottom-[22%] lg:right-[7%]" />
      <div className="max-w-[68ch] lg:ml-[8.333%]">
        <Reveal>
          <h2 id="explain-heading" className="text-h2">
            {content.heading}
          </h2>
        </Reveal>
        <Reveal delay={80} className="mt-6 grid gap-4 text-body">
          {content.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="mt-2 font-medium">{content.stepsIntro}</p>
          <ol className="grid gap-4">
            {content.steps.map((step, i) => (
              <li key={step.title}>
                <strong className="font-semibold">
                  Step {i + 1}: {step.title}
                </strong>
                <br />
                {step.body}
              </li>
            ))}
          </ol>
          <p className="mt-2">{content.closing}</p>
        </Reveal>
        <Reveal delay={160} className="mt-8">
          <Button href={BOOKING_PATH}>{settings.ctaLabel}</Button>
        </Reveal>
      </div>
    </section>
  )
}
