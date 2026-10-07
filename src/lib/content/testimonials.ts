import type { ServiceSlug } from './services'

/**
 * The two testimonials from Dr. Jeff's wireframe (spec Appendix A,
 * section 4), word for word, with the names he gave. They replace the
 * Google reviews on the homepage; the reviews are not used anywhere else.
 * These become `testimonial` CPT entries.
 */

export interface Testimonial {
  quote: string
  name: string
  service: ServiceSlug | null
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Dr. Lee's care and attention to detail helped uncover an underlying condition that, with treatment, is seeing tremendous results. Know that you can trust Brio and Dr. Lee with your health concerns and goals.",
    name: 'April B.',
    service: null,
  },
  {
    quote:
      "I am inspired by Dr. Lee's ethics and passion for his profession. No matter how busy he gets when I come to see him, I always feel that I am a priority and can always trust in his honesty",
    name: 'Stephania S.',
    service: null,
  },
]
