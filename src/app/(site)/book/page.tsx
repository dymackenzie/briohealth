import HeroSection from '@/components/sections/HeroSection'
import ProcessStepsSection from '@/components/sections/ProcessStepsSection'
import FaqSection from '@/components/sections/FaqSection'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import VideoEmbed from '@/components/media/VideoEmbed'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Now | Brio Health',
  description: 'Book your appointment with Dr. Jeffrey Lee at Brio Health in Richmond BC. All new patients start with a virtual consultation.',
}

const bookingFaqs = [
  { question: 'What is your cancellation policy?', answer: [{ _type: 'block', children: [{ _type: 'span', text: 'We have a strict 48-hour cancellation policy. Late cancellations or no-shows will require full payment of the missed visit or treatment. Missed appointments due to emergencies will be handled on a case-by-case basis.' }] }] },
  { question: 'Which appointment should I book?', answer: [{ _type: 'block', children: [{ _type: 'span', text: 'ALL new patients begin with a VIRTUAL initial appointment. You will meet with Dr. Lee virtually for 30 minutes, at which time a health history is taken and a tailored treatment plan will be created.' }] }] },
  { question: 'I am not comfortable with a virtual visit, can I see Dr. Lee in person?', answer: [{ _type: 'block', children: [{ _type: 'span', text: 'In-person visits are prioritized for physical exams and in-clinic treatments only. However, give us a call and we will do our best to accommodate an in-person visit.' }] }] },
  { question: 'Do you offer direct billing for private insurance?', answer: [{ _type: 'block', children: [{ _type: 'span', text: 'We currently do not offer direct billing. Patients pay for the treatment and submit receipts to their insurance provider for reimbursement.' }] }] },
  { question: 'What forms of payment do you accept?', answer: [{ _type: 'block', children: [{ _type: 'span', text: 'Brio Health is a cashless clinic. We accept debit and credit cards only (Visa, MasterCard, American Express).' }] }] },
  { question: 'Why is a credit card kept on file?', answer: [{ _type: 'block', children: [{ _type: 'span', text: 'Having a credit card on file simplifies the booking and payment process. This saves time and keeps patient costs low. All credit card information is encrypted and stored securely on Stripe Payments.' }] }] },
]

export default function BookPage() {
  return (
    <>
      <HeroSection section={{
        eyebrow: 'Getting Started',
        heading: 'Welcome to Brio Health.',
        subtext: 'Whether you are booking a Naturopathic Medicine, Acupuncture or I.V. Therapy visit, all patients will begin with an assessment consultation with Dr. Lee.',
        ctas: [
          { label: 'Book on Jane', style: 'primary', link: { kind: 'booking' } },
        ],
        variant: 'centered',
        background: 'sand',
      }} />

      {/* Video */}
      <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <VideoEmbed url="https://yourbriohealth.com/wp-content/uploads/2024/02/BrioBookNowVideo.mp4" />
          </div>
        </Container>
      </section>

      <ProcessStepsSection section={{
        eyebrow: 'How to Book',
        heading: 'Three simple steps.',
        steps: [
          { stepLabel: 'Step 1', title: 'Answer a few questions', description: 'Answer the 3 questions in the Jane App booking system and click "Get Started".' },
          { stepLabel: 'Step 2', title: 'Book your appointment', description: 'Book the first available appointment with Dr. Lee — initial visits are 30 minutes, done virtually.' },
          { stepLabel: 'Step 3', title: 'Complete your intake form', description: 'Fill out and submit the online intake form as soon as possible so that Dr. Lee can prepare for your visit.' },
        ],
        background: 'sand',
      }} />

      {/* Jane embed CTA */}
      <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-teal-500 mb-3">Ready?</p>
            <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-4">Book your visit now.</h2>
            <p className="text-ink-500 text-[1.0625rem] mb-8">Secure, private, and easy — powered by Jane App.</p>
            <Button href="https://yourbriohealth.janeapp.com" external variant="primary" size="lg">
              Open Jane Booking
            </Button>
          </div>
        </Container>
      </section>

      <FaqSection section={{
        eyebrow: 'Questions',
        heading: 'Booking FAQs',
        inlineFaqs: bookingFaqs,
        background: 'sand',
      }} />
    </>
  )
}
