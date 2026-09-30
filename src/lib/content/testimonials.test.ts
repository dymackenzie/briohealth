import { describe, expect, it } from 'vitest'
import { testimonials } from './testimonials'

describe('testimonials', () => {
  it.each(testimonials.map((t) => [t.name, t]))('%s: the short quote is an unbroken run of the review', (_, t) => {
    // Only the first letter may change case, where the cut starts mid-sentence.
    const cut = t.shortQuote.slice(1)
    expect(t.quote).toContain(cut)
    expect(t.quote.toLowerCase()).toContain(t.shortQuote.toLowerCase())
  })

  it('keeps the large quote short enough for three lines on a phone', () => {
    expect(testimonials[0].shortQuote.length).toBeLessThanOrEqual(60)
  })
})
