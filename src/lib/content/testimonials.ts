import type { ServiceSlug } from './services'

/**
 * Real Google reviews, already public on the clinic's current site. `quote`
 * is the review as written (minus nothing but length); `shortQuote` is the
 * version that fits three lines on the page: one unbroken run of the
 * reviewer's own words, never reworded and never stitched together from two
 * places. These become `testimonial` CPT entries so the client picks which
 * ones run.
 *
 * The first entry is the homepage's large quote, which is Funnel Display at
 * up to 44px and holds about 60 characters in three lines on a phone. That
 * is why it is the shortest.
 */

export interface Testimonial {
  quote: string
  shortQuote: string
  name: string
  source: string
  date: string
  service: ServiceSlug | null
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'He has treated me and my family, pinched nerve, sciatica, ankle sprains, fibromyalgia, for over a decade. We will follow him wherever he goes. As honest and as competent as they come.',
    shortQuote: 'As honest and as competent as they come.',
    name: 'Dennis B.',
    source: 'Google review',
    date: 'February 2024',
    service: 'acupuncture',
  },
  {
    quote:
      'Dr. Jeff Lee is the most professional, knowledgeable, gentle and trustworthy Naturopath in Richmond. I have been the recipient of many of his acupuncture, laser and naturopathic treatments and always feel stronger and healthier when I leave his office.',
    shortQuote: 'The most professional, knowledgeable, gentle and trustworthy Naturopath in Richmond.',
    name: 'Diane C.',
    source: 'Google review',
    date: 'November 2024',
    service: 'naturopathic',
  },
  {
    quote:
      'He spends the time to get to the root cause of your health concerns. You can tell he really cares about his patients. The IV treatments from Brio are the best.',
    shortQuote: 'He spends the time to get to the root cause of your health concerns.',
    name: 'Brandon W.',
    source: 'Google review',
    date: 'February 2024',
    service: 'iv-therapy',
  },
]
