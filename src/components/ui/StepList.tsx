/**
 * A numbered sequence: the homepage plan and the Pickleball coaching steps.
 * Both are real sequences, so the numerals show. A step's text is one
 * `body`, or `points` for a step that lists them. Numerals in Funnel Display, titles in
 * Newsreader, bodies in Funnel Sans. It renders
 * only the <ol>, so a caller that wants a decorative line beside the steps
 * places it as a sibling, never inside the list.
 */

type Surface = 'light' | 'teal'

// Display numerals are teal on light grounds and paper on a field.
const numeralColour: Record<Surface, string> = {
  light: 'text-teal',
  teal: 'text-paper',
}

export function StepList({
  steps,
  surface = 'light',
  className = '',
}: {
  steps: readonly { title: string; body?: string; points?: readonly string[] }[]
  surface?: Surface
  className?: string
}) {
  return (
    <ol className={`grid gap-7 ${className}`}>
      {steps.map((step, i) => (
        <li key={step.title} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-5">
          <span aria-hidden className={`text-numeral ${numeralColour[surface]}`}>
            {i + 1}
          </span>
          <div className="pt-1">
            <h3 className="font-serif text-[1.5rem] leading-tight font-medium tracking-[-0.01em]">{step.title}</h3>
            {step.body && <p className="mt-2 max-w-[48ch]">{step.body}</p>}
            {step.points && (
              <ul className="mt-2 grid max-w-[48ch] gap-1.5">
                {step.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
