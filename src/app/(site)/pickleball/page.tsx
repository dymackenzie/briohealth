import HeroSection from '@/components/sections/HeroSection'
import FeatureGridSection from '@/components/sections/FeatureGridSection'
import VideoEmbedSection from '@/components/sections/VideoEmbedSection'
import TestimonialCarouselSection from '@/components/sections/TestimonialCarouselSection'
import CtaBandSection from '@/components/sections/CtaBandSection'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Placeholder from '@/components/media/Placeholder'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pickleball Coaching | Brio Health',
  description: 'Brio Pickleball Coaching — private & group lessons with Dr. Jeff Lee in Richmond BC. Better movement, better decisions, better recovery.',
}

const coachingFeatures = [
  {
    icon: 'Footprints',
    title: 'Better Movement',
    text: 'Better paddle technique improves your consistency. Better footwork helps you be in the right position to win more points.',
  },
  {
    icon: 'Brain',
    title: 'Better Decision Making',
    text: 'Learn different strategies to quickly adapt against different opponents. Develop a higher pickleball IQ to win more games.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Better Recovery',
    text: 'Learn the right technique to keep your body more efficient & injury free. Prevent injuries so you can play for years to come.',
  },
]

const testimonials = [
  {
    _id: '1',
    quote: 'My Husband and I took 4 lessons from Dr. Jeff. I had no experience playing any racket sports and in 4 lessons my husband and I had the basics to play a full game. Dr. Jeff is a great teacher! He broke down the game so it was easy to learn and he kept it really fun.',
    attribution: 'Sharin & Steven',
    context: 'Pickleball Coaching',
  },
  {
    _id: '2',
    quote: 'I came to see Dr. Jeff because of a severe tennis elbow. I could not even hold my pickleball paddle. Dr. Jeff gave me several rounds of acupuncture and low level laser therapy to calm the inflammation. He also coached me on how to better grip my paddle. I am now pain free thanks to the doc and playing pickleball 3 times a week.',
    attribution: 'David C.',
    context: 'Acupuncture + Pickleball Coaching',
  },
]

export default function PickleballPage() {
  return (
    <>
      <HeroSection section={{
        eyebrow: 'Pickleball Coaching',
        heading: 'Unlock your hidden potential on the court.',
        emphasisWord: 'potential',
        subtext: 'Brio Pickleball Coaching offers private & small group lessons. We work with beginners & advanced players. We specialize in developing solid fundamentals so players improve faster and have more fun.',
        ctas: [
          { label: 'Book a Lesson', style: 'primary', link: { kind: 'booking' } },
          { label: 'Contact Us', style: 'secondary', link: { kind: 'internal', reference: null } },
        ],
        variant: 'split',
        background: 'canvas',
        imageArched: true,
      }} />

      <FeatureGridSection section={{
        eyebrow: 'Coaching Methodology',
        heading: 'Three pillars of great pickleball.',
        items: coachingFeatures,
        columns: 3,
        background: 'sand',
      }} />

      {/* Video section */}
      <VideoEmbedSection section={{
        heading: 'See the coaching in action.',
        url: 'https://yourbriohealth.com/wp-content/uploads/2025/11/BRIOP.mp4',
        background: 'canvas',
      }} />

      {/* Notable connections */}
      <section className="bg-sand-200 py-[clamp(4rem,9vw,8rem)]">
        <Container>
          <SectionHeading
            eyebrow="Coaching Network"
            heading="Learning from the best."
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { name: 'Ben Johns', desc: 'No. 1 in the world for mixed doubles, No. 2 for Singles, and No. 1 for Men\'s Doubles — PPA', label: 'Dr. Jeff with Ben Johns' },
              { name: 'Jordan Briones', desc: 'Briones Pickleball Academy — Arizona\'s Training Hub for Elite Pickleball Coaching & Competition', label: 'Dr. Jeff with Jordan Briones' },
            ].map((person) => (
              <div key={person.name} className="bg-paper rounded-[var(--r-xl)] overflow-hidden shadow-sm border border-sand-300">
                <Placeholder label={person.label} ratio="16/9" />
                <div className="p-5">
                  <h3 className="font-display text-[1.25rem] text-ink-900">{person.name}</h3>
                  <p className="text-ink-500 text-[0.9375rem] mt-1">{person.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
        <Container>
          <SectionHeading eyebrow="Services" heading="Coaching packages." className="mb-10" />
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            {[
              { title: 'Private Session', detail: '1–2 players', price: '$110 + GST / hour', desc: 'One-on-one coaching with a full assessment and tailored instructions to improve your paddle skills, movement patterns, and mindset.' },
              { title: 'Group Session', detail: '3–4 players', price: '$160 + GST / hour', desc: 'Team coaching includes skill development, key movement patterns with your partner and winning doubles strategy.' },
            ].map((pkg) => (
              <div key={pkg.title} className="bg-paper rounded-[var(--r-lg)] p-6 border border-sand-300 shadow-sm">
                <h3 className="font-display text-[1.375rem] text-ink-900 mb-1">{pkg.title}</h3>
                <p className="text-ink-500 text-[0.875rem] mb-3">{pkg.detail}</p>
                <p className="text-teal-500 font-semibold text-lg mb-3">{pkg.price}</p>
                <p className="text-ink-500 text-[0.9375rem] leading-relaxed">{pkg.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <TestimonialCarouselSection section={{
        eyebrow: 'What they\'re saying',
        heading: 'Student results.',
        testimonials,
        background: 'sand',
      }} />

      <CtaBandSection section={{
        heading: 'Ready to level up your game?',
        subtext: 'Book a private or group pickleball coaching session with Dr. Jeff.',
        primaryCta: { label: 'Book a Lesson', style: 'accent', link: { kind: 'booking' } },
        secondaryCta: { label: 'Contact Us', style: 'ghost', link: { kind: 'internal', reference: null } },
        background: 'teal',
      }} />
    </>
  )
}
