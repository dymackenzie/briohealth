import { ChevronDown } from 'lucide-react'

/**
 * Native `<details>`, so it opens with no JavaScript and every answer is in
 * the HTML for search and for find-in-page. Hairlines between, no boxes.
 */
export function Faq({
  items,
}: {
  items: readonly { question: string; answer: string }[]
}) {
  return (
    <div className="border-t border-ink-900/15">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-ink-900/15">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-base font-semibold text-ink-900 hover:text-teal-700 [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              aria-hidden
              className="mt-1 h-5 w-5 shrink-0 text-teal-600 transition-transform duration-500 group-open:rotate-180"
            />
          </summary>
          <p className="max-w-[60ch] pb-6 text-ink-700">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
