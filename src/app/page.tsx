import { DotBurst } from '@/components/brand/DotBurst'
import { Logo } from '@/components/brand/Logo'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { faqsFor } from '@/lib/content/faqs'
import { slots } from '@/lib/content/photos'
import { site } from '@/lib/site'
import { displayClass } from '@/lib/typography'

const HEADING = 'Feel like yourself again.'

export default function HomePage() {
  return (
    <main id="main" className="container-x section-y">
      <h1 className={displayClass(HEADING)}>{HEADING}</h1>
      <h2 className="mt-10 text-h2">How we help</h2>
      <h3 className="mt-6 text-h3">A 30-minute virtual assessment</h3>
      <p className="mt-4 max-w-[60ch] text-body">
        Body text at 18px in Funnel Sans, line height 1.55. Nothing on the site is smaller than 15px.
      </p>
      <p className="mt-2 text-small text-ink-soft">Small text at 15px, ink-soft.</p>
      <p className="mt-6 text-numeral text-teal">$150</p>
      <div data-surface="teal" className="mt-10 rounded-brand p-8">
        <h2 className="text-h2">Display type is paper on teal</h2>
        <p className="mt-3 max-w-[50ch]">Body text on a teal field is on-teal, 5.1:1.</p>
      </div>
      <div className="mt-10 flex items-end gap-10">
        <Logo />
        <DotBurst className="h-32 w-32 text-teal" />
        <div data-surface="teal" className="rounded-brand p-6">
          <DotBurst className="h-32 w-32 text-paper" />
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        <Button href={site.bookingUrl}>{site.ctaLabel}</Button>
        <Button href="/about" variant="quiet">More about Dr. Lee</Button>
        <Field className="flex gap-4 p-4">
          <Button href={site.bookingUrl} on="teal">{site.ctaLabel}</Button>
          <Button href="/about" on="teal" variant="quiet">More about Dr. Lee</Button>
        </Field>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Reveal><Figure {...slots.hero} /></Reveal>
        <Reveal delay={80}><Figure {...slots.services['iv-therapy']} aspect="1/1" /></Reveal>
        <Reveal delay={160}><Figure {...slots.guide} /></Reveal>
      </div>
      <div className="mt-10 max-w-2xl">
        <Accordion items={faqsFor('general')} />
      </div>
    </main>
  )
}
