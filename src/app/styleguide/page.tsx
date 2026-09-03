import { notFound } from 'next/navigation'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Placeholder from '@/components/media/Placeholder'

export default function StyleguidePage() {
  if (process.env.NODE_ENV !== 'development') notFound()

  return (
    <div className="bg-canvas min-h-screen py-16">
      <Container>
        <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] text-ink-900 mb-2">Brio Design System</h1>
        <p className="text-ink-500 mb-16">Dev-only styleguide · Fraunces + Hanken Grotesk · Teal/Cream/Coral system</p>

        {/* Colours */}
        <section className="mb-16">
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-8">Colour Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {[
              { name: 'teal-700', bg: 'bg-teal-700', text: 'text-white' },
              { name: 'teal-500', bg: 'bg-teal-500', text: 'text-white' },
              { name: 'teal-300', bg: 'bg-teal-300', text: 'text-ink-900' },
              { name: 'teal-100', bg: 'bg-teal-100', text: 'text-ink-900' },
              { name: 'coral-500', bg: 'bg-coral-500', text: 'text-white' },
              { name: 'coral-100', bg: 'bg-coral-100', text: 'text-ink-900' },
            ].map((swatch) => (
              <div key={swatch.name} className={`${swatch.bg} ${swatch.text} rounded-[var(--r-lg)] p-4 aspect-square flex items-end`}>
                <span className="text-xs font-semibold">{swatch.name}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'ink-900', bg: 'bg-ink-900', text: 'text-white' },
              { name: 'ink-700', bg: 'bg-ink-700', text: 'text-white' },
              { name: 'ink-500', bg: 'bg-ink-500', text: 'text-white' },
              { name: 'ink-300', bg: 'bg-ink-300', text: 'text-ink-900' },
              { name: 'canvas', bg: 'bg-canvas border border-sand-300', text: 'text-ink-900' },
              { name: 'sand-200', bg: 'bg-sand-200', text: 'text-ink-900' },
            ].map((swatch) => (
              <div key={swatch.name} className={`${swatch.bg} ${swatch.text} rounded-[var(--r-lg)] p-4 aspect-square flex items-end`}>
                <span className="text-xs font-semibold">{swatch.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Type scale */}
        <section className="mb-16">
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-8">Typography</h2>
          <div className="space-y-6">
            <div><p className="text-xs text-ink-500 mb-1 font-semibold tracking-widest uppercase">Display XL · Fraunces · clamp(2.75rem,6vw,5rem)</p>
              <p className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.02] tracking-[-0.02em] text-ink-900">Whole-person care that helps you feel alive again.</p></div>
            <div><p className="text-xs text-ink-500 mb-1 font-semibold tracking-widest uppercase">Display LG · clamp(2.25rem,4vw,3.5rem)</p>
              <p className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900">Your health, transformed.</p></div>
            <div><p className="text-xs text-ink-500 mb-1 font-semibold tracking-widest uppercase">Body LG · 1.1875rem</p>
              <p className="text-[1.1875rem] text-ink-700 leading-relaxed max-w-2xl">We believe that true health is more than just the absence of disease — it's the presence of energy, clarity, and joy in your everyday life.</p></div>
            <div><p className="text-xs text-ink-500 mb-1 font-semibold tracking-widest uppercase">Body · 1.0625rem</p>
              <p className="text-[1.0625rem] text-ink-700 leading-[1.65] max-w-2xl">Dr. Jeffrey Lee combines naturopathic medicine with acupuncture, IV therapy, and low-level laser to deliver integrative care that gets to the root cause.</p></div>
            <div><p className="text-xs text-ink-500 mb-1 font-semibold tracking-widest uppercase">Eyebrow · 0.8125rem · 600 · tracking wide</p>
              <p className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-teal-500">Integrative Health · Richmond BC</p></div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-8">Buttons</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <Button variant="primary" size="lg">Book Now</Button>
            <Button variant="secondary" size="lg">Learn More</Button>
            <Button variant="accent" size="lg">Join Program</Button>
            <Button variant="ghost" size="lg">View All</Button>
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Button variant="primary">Book Now</Button>
            <Button variant="secondary">Learn More</Button>
            <Button variant="accent">Join Program</Button>
            <Button variant="ghost">View All</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="sm">Book Now</Button>
            <Button variant="secondary" size="sm">Learn More</Button>
          </div>
        </section>

        {/* Tags */}
        <section className="mb-16">
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-8">Tags & Pills</h2>
          <div className="flex flex-wrap gap-3">
            <Tag color="teal">Naturopathic</Tag>
            <Tag color="teal">Acupuncture</Tag>
            <Tag color="coral">Programs</Tag>
            <Tag color="coral">IV Therapy</Tag>
            <Tag color="sand">Health Tips</Tag>
            <Tag color="sand">Recipes</Tag>
          </div>
        </section>

        {/* Section heading */}
        <section className="mb-16">
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-8">Section Heading Component</h2>
          <SectionHeading eyebrow="Our Services" heading="How we can help" subtext="From naturopathic medicine to acupuncture, IV therapy, and beyond — we offer integrative care that gets results." />
        </section>

        {/* Placeholders */}
        <section className="mb-16">
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-8">Placeholders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Placeholder label="Dr. Jeff Lee portrait" ratio="3/4" />
            <Placeholder label="Clinic interior" ratio="4/3" />
            <Placeholder label="Service hero" ratio="1/1" tone="sand" />
            <Placeholder label="Program photo" ratio="16/9" />
          </div>
        </section>

        {/* Backgrounds */}
        <section className="mb-16 -mx-[clamp(1.25rem,4vw,3rem)]">
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-8 px-[clamp(1.25rem,4vw,3rem)]">Section Backgrounds</h2>
          {[
            { bg: 'bg-canvas', label: 'canvas — default page bg', dark: false },
            { bg: 'bg-sand-200', label: 'sand-200 — alternating sections', dark: false },
            { bg: 'bg-teal-100', label: 'teal-100 — soft tinted', dark: false },
            { bg: 'bg-teal-700', label: 'teal-700 — deep band', dark: true },
            { bg: 'bg-coral-100', label: 'coral-100 — accent wash', dark: false },
          ].map((item) => (
            <div key={item.label} className={`${item.bg} px-[clamp(1.25rem,4vw,3rem)] py-10`}>
              <p className={`font-semibold ${item.dark ? 'text-white' : 'text-ink-900'}`}>{item.label}</p>
              <p className={`text-[0.9375rem] ${item.dark ? 'text-teal-100' : 'text-ink-500'}`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </section>

        <div className="py-8 text-center">
          <p className="text-ink-300 text-sm">Dev-only · not visible in production</p>
        </div>
      </Container>
    </div>
  )
}
