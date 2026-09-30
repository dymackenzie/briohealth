import { Reveal } from '@/components/ui/Reveal'
import type { Testimonial } from '@/lib/content/testimonials'

/**
 * One large Google review, two short ones, asymmetric. Quotes are the
 * three-line trims; attribution is "Name, Google review". Real typographic
 * quote marks, with the large quote's opening mark hung in the margin so
 * the text keeps a clean left edge (inline on phones, where the gutter is
 * too narrow to hold it). Renders nothing without items.
 */
export function Proof({ heading, items }: { heading: string; items: Testimonial[] }) {
  if (items.length === 0) return null
  const [large, ...rest] = items
  const small = rest.slice(0, 2)

  return (
    <section aria-labelledby="proof-heading" className="container-x section-y">
      <h2 id="proof-heading" className="sr-only">
        {heading}
      </h2>
      <div className="grid-12 gap-y-12">
        <Reveal as="figure" className="col-span-12 lg:col-span-7">
          <blockquote className="relative text-quote max-w-[24ch]">
            <span className="sm:absolute sm:right-full">{'“'}</span>
            {large.shortQuote}
            {'”'}
          </blockquote>
          <figcaption className="mt-6 text-ink-soft">
            {large.name}, {large.source}
          </figcaption>
        </Reveal>

        {small.length > 0 && (
          <div className="col-span-12 grid gap-10 sm:grid-cols-2 lg:col-span-4 lg:col-start-9 lg:grid-cols-1 lg:pt-2">
            {small.map((item, i) => (
              <Reveal as="figure" key={item.name} delay={80 + i * 80} className="border-t-2 border-teal pt-5">
                <blockquote className="text-body">
                  {'“'}
                  {item.shortQuote}
                  {'”'}
                </blockquote>
                <figcaption className="mt-3 text-small text-ink-soft">
                  {item.name}, {item.source}
                </figcaption>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
