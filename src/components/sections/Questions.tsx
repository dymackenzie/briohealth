import { Accordion } from '@/components/ui/Accordion'
import { Reveal } from '@/components/ui/Reveal'
import type { FaqItem } from '@/lib/content/faqs'
import type { HomeContent } from '@/lib/content/home'
import type { SiteSettings } from '@/lib/site'

/** Heading on the left, accordion on the right. Hidden when there are no items. */
export function Questions({
  content,
  items,
  settings,
}: {
  content: HomeContent['questions']
  items: FaqItem[]
  settings: SiteSettings
}) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="questions-heading" className="container-x section-y grid-12 gap-y-10">
      <Reveal className="col-span-12 lg:col-span-4">
        <h2 id="questions-heading" className="max-w-[10ch] text-h2">
          {content.heading}
        </h2>
        <p className="mt-5 max-w-[26ch] text-ink-soft">
          {content.aside}{' '}
          <a href={settings.phoneHref} className="link-quiet whitespace-nowrap">
            {settings.phone}
          </a>
        </p>
      </Reveal>
      <Reveal delay={80} className="col-span-12 lg:col-span-7 lg:col-start-6">
        <Accordion items={items.map(({ question, answer }) => ({ question, answer }))} />
      </Reveal>
    </section>
  )
}
