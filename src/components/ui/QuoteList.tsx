import { Reveal } from '@/components/ui/Reveal'

/**
 * Testimonials: the quote verbatim in serif italic at the quote size, a
 * teal quotation mark, the name in small Funnel Sans. In rows (the
 * homepage trust section) the mark hangs in the margin column (column 1;
 * inline above the quote on phones); in `columns` (the Pickleball page,
 * two side by side from md) it sits above each quote, and the quotes are
 * set a size down so the pair stays compact.
 */
export function QuoteList({
  items,
  columns = false,
  className = '',
}: {
  items: readonly { quote: string; name: string }[]
  columns?: boolean
  className?: string
}) {
  return (
    <ul className={`grid gap-y-10 ${columns ? 'gap-x-10 md:grid-cols-2' : ''} ${className}`}>
      {items.map((item, i) => (
        <Reveal as="li" key={item.name} delay={i * 80} className={columns ? 'grid content-start gap-y-3' : 'grid-12 gap-y-3'}>
          <figure className="contents">
            <span
              aria-hidden
              className={`font-serif leading-[0.75] font-medium text-teal ${columns ? 'text-[3rem]' : 'col-span-12 text-[clamp(3.5rem,5.2vw,4.75rem)] lg:col-span-1 lg:text-right'}`}
            >
              {'“'}
            </span>
            <blockquote
              className={
                columns
                  ? 'font-serif text-[clamp(1.125rem,1.45vw,1.3125rem)] leading-normal italic'
                  : 'text-quote col-span-12 lg:col-span-10 lg:col-start-2'
              }
            >
              {item.quote}
            </blockquote>
            <figcaption className={`text-small text-ink-soft ${columns ? '' : 'col-span-12 lg:col-span-10 lg:col-start-2'}`}>
              {item.name}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  )
}
