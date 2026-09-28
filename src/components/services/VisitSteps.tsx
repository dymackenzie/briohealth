import { Reveal } from '@/components/ui/Reveal'

/**
 * What happens from booking to follow-up. A real sequence, so it keeps its
 * numbers — the only place on these pages that does.
 */
export function VisitSteps({
  steps,
}: {
  steps: readonly { readonly title: string; readonly body: string }[]
}) {
  return (
    <ol className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 90} className="border-t border-ink-900/12 pt-6">
          <span
            aria-hidden
            className="block font-display text-[3.25rem] leading-none tracking-[-0.03em] text-clay-600"
          >
            {i + 1}
          </span>
          <h3 className="mt-5 text-h3">{step.title}</h3>
          <p className="mt-3 max-w-[40ch] text-ink-700">{step.body}</p>
        </Reveal>
      ))}
    </ol>
  )
}

/**
 * The prices from each page's cost FAQ. Up front rather than buried in an
 * accordion — not knowing the cost is one of the things that stops people
 * booking.
 */
export function FeeList({
  fees,
  note,
  className = '',
}: {
  fees: readonly { readonly label: string; readonly price: string }[]
  note?: string
  className?: string
}) {
  return (
    <div className={`grid gap-5 lg:grid-cols-12 lg:gap-10 ${className}`}>
      <div className="lg:col-span-4">
        <h3 className="text-h3">Fees</h3>
        {note && <p className="mt-2 text-small text-ink-500">{note}</p>}
      </div>

      <dl className="border-t border-ink-900/12 lg:col-span-8">
        {fees.map((fee) => (
          <div
            key={fee.label}
            className="flex items-baseline justify-between gap-6 border-b border-ink-900/12 py-3.5"
          >
            <dt className="text-ink-700">{fee.label}</dt>
            <dd className="font-semibold whitespace-nowrap tabular-nums">{fee.price}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
