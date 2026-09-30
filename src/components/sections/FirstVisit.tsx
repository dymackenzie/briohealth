import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent } from '@/lib/content/home'
import { initialAssessmentFee } from '@/lib/content/services'
import type { SiteSettings } from '@/lib/site'

/**
 * The decision block. Verified figures as display numerals (the initial
 * assessment fee first, read from services.ts so fees are edited in one
 * place, then the duration), what happens, what you leave with, the fees
 * link and the CTA. Everything here is from the live naturopathic page. If
 * the fee is missing the figure is left out rather than guessed.
 */
export function FirstVisit({ content, settings }: { content: HomeContent['firstVisit']; settings: SiteSettings }) {
  const fee = initialAssessmentFee(content.fee.service)
  const figures = [...(fee ? [{ value: fee.amount, label: fee.label }] : []), ...content.figures]

  return (
    <section aria-labelledby="first-visit-heading" className="container-x section-y grid-12 gap-y-14">
      <div className="col-span-12 lg:col-span-5">
        <Reveal>
          <h2 id="first-visit-heading" className="text-h2">
            {content.heading}
          </h2>
        </Reveal>
        <dl className="mt-10 grid grid-cols-2 gap-6 sm:gap-8">
          {figures.map((figure, i) => (
            <Reveal key={figure.label} delay={i * 80} className="flex flex-col border-t-2 border-teal pt-4">
              <dt className="mt-3 text-small text-ink-soft">{figure.label}</dt>
              <dd className="order-first text-numeral text-teal">{figure.value}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal delay={160}>
          <p className="mt-6 text-small text-ink-soft">
            {content.feesNote}{' '}
            <Link href={content.feesLink.href} className="link-quiet">
              {content.feesLink.label}
            </Link>
          </p>
          <div className="mt-8">
            <Button href={settings.bookingUrl}>{settings.ctaLabel}</Button>
          </div>
        </Reveal>
      </div>

      <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-3">
        <Reveal>
          <h3 className="text-h3">What happens</h3>
          <ol className="mt-5 grid gap-5">
            {content.happens.map((step, i) => (
              <li key={step} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
                <span aria-hidden className="font-display text-2xl leading-[1.1] font-semibold text-teal">
                  {i + 1}
                </span>
                <p className="max-w-[48ch]">{step}</p>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={80}>
          <h3 className="mt-10 text-h3">{content.leaveWithHeading}</h3>
          <p className="mt-3 max-w-[48ch]">{content.leaveWith}</p>
        </Reveal>
      </div>
    </section>
  )
}
