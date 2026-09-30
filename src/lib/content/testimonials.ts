import type { ServiceSlug } from './services'

/**
 * Real Google reviews, already public on the clinic's current site. `quote`
 * is the review as written (minus nothing but length); `shortQuote` is the
 * trimmed version that fits three lines on the page. These become
 * `testimonial` CPT entries so the client picks which ones run.
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
      'Dr. Jeff Lee is the most professional, knowledgeable, gentle and trustworthy Naturopath in Richmond. I have been the recipient of many of his acupuncture, laser and naturopathic treatments and always feel stronger and healthier when I leave his office.',
    shortQuote:
      'The most professional, knowledgeable, gentle and trustworthy naturopath in Richmond. I always feel stronger and healthier when I leave his office.',
    name: 'Diane C.',
    source: 'Google review',
    date: 'November 2024',
    service: 'naturopathic',
  },
  {
    quote:
      'He has treated me and my family, pinched nerve, sciatica, ankle sprains, fibromyalgia, for over a decade. We will follow him wherever he goes. As honest and as competent as they come.',
    shortQuote:
      'He has treated me and my family for over a decade. As honest and as competent as they come.',
    name: 'Dennis B.',
    source: 'Google review',
    date: 'February 2024',
    service: 'acupuncture',
  },
  {
    quote:
      'He spends the time to get to the root cause of your health concerns. You can tell he really cares about his patients. The IV treatments from Brio are the best.',
    shortQuote:
      'He spends the time to get to the root cause of your health concerns. The I.V. treatments from Brio are the best.',
    name: 'Brandon W.',
    source: 'Google review',
    date: 'February 2024',
    service: 'iv-therapy',
  },
]
