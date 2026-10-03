import { describe, expect, it } from 'vitest'
import { testimonials } from './testimonials'

describe('testimonials', () => {
  it('are the two wireframe quotes, verbatim, with their names', () => {
    expect(testimonials.map((t) => t.name)).toEqual(['April B.', 'Stephania S.'])
    expect(testimonials[0].quote).toBe(
      "Dr. Lee's care and attention to detail helped uncover an underlying condition that, with treatment, is seeing tremendous results. Know that you can trust Brio and Dr. Lee with your health concerns and goals.",
    )
    expect(testimonials[1].quote).toBe(
      "I am inspired by Dr. Lee's ethics and passion for his profession. No matter how busy he gets when I come to see him, I always feel that I am a priority and can always trust in his honesty",
    )
  })

  it('carries no Google review fields', () => {
    for (const t of testimonials) {
      expect(t).not.toHaveProperty('shortQuote')
      expect(t).not.toHaveProperty('source')
    }
  })
})
