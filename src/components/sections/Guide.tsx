import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import type { HomeContent } from '@/lib/content/home'

/**
 * Dr. Lee's only homepage photo. Empathy in his words, credentials in one
 * sentence, the award. The quote is display type; the attribution is small.
 */
export function Guide({ content }: { content: HomeContent['guide'] }) {
  return (
    <section aria-labelledby="guide-heading" className="container-x section-y grid-12 gap-y-10">
      <Reveal className="col-span-12 sm:col-span-8 lg:col-span-5">
        <Figure
          subject={content.portrait.subject}
          photo={content.portrait.photo}
          aspect="4/5"
          sizes="(min-width: 1280px) 490px, (min-width: 1024px) 40vw, (min-width: 640px) 66vw, 100vw"
        />
      </Reveal>

      <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-6">
        <Reveal>
          <h2 id="guide-heading" className="max-w-[14ch] text-h2">
            {content.heading}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <figure className="mt-10">
            <blockquote className="text-quote max-w-[24ch]">
              {'“'}
              {content.quote}
              {'”'}
            </blockquote>
            <figcaption className="mt-4 text-small text-ink-soft">{content.attribution}</figcaption>
          </figure>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-10 max-w-[52ch] text-body">{content.credentials}</p>
          <p className="mt-3 max-w-[52ch] text-body text-ink-soft">{content.award}</p>
          <div className="mt-6">
            <Button href={content.link.href} variant="quiet">
              {content.link.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
