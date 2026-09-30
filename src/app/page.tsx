import { DotBurst } from '@/components/brand/DotBurst'
import { Logo } from '@/components/brand/Logo'
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
    </main>
  )
}
