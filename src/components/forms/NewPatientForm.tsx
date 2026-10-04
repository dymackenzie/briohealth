import { Button } from '@/components/ui/Button'

/**
 * The live site's screening, as a plain form: three required checkboxes
 * with no `name`, so a GET to Jane carries nothing, and the browser's own
 * validation blocks "Get Started" until all three are ticked, with or
 * without JavaScript. No noValidate: the native bubble is the point here.
 * The returning-patient link skips the screening, in the same tab as
 * "Get Started".
 */
export function NewPatientForm({
  bookingUrl,
  statements,
  heading,
  returningLabel,
}: {
  bookingUrl: string
  statements: readonly string[]
  heading: string
  returningLabel: string
}) {
  return (
    <form method="get" action={bookingUrl} className="grid gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-h3">{heading}</h2>
        <a href={bookingUrl} className="link-quiet text-small">
          {returningLabel}
        </a>
      </div>
      <ul className="grid gap-4">
        {statements.map((statement, i) => {
          const id = `new-patient-statement-${i + 1}`
          return (
            <li key={statement} className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-3">
              <input id={id} type="checkbox" required className="checkbox-brand mt-1" />
              <label htmlFor={id} className="max-w-[64ch]">
                {statement}
              </label>
            </li>
          )
        })}
      </ul>
      <div>
        <Button type="submit">Get Started</Button>
      </div>
    </form>
  )
}
