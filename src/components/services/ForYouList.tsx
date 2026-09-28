/**
 * "This is for you if…" — the condition lists from the live pages, written to
 * the reader. Hairlines rather than chips: the pills read as tags to click,
 * and these are sentences to recognise yourself in.
 */
export function ForYouList({
  items,
  className = '',
}: {
  items: readonly string[]
  className?: string
}) {
  return (
    <ul className={`border-t border-ink-900/12 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-4 border-b border-ink-900/12 py-3.5">
          <span
            aria-hidden
            className="mt-[0.63em] h-1.5 w-1.5 shrink-0 rounded-pill bg-teal-500"
          />
          <span className="text-ink-700">{item}</span>
        </li>
      ))}
    </ul>
  )
}
