import { describe, expect, it } from 'vitest'
import { faqs, faqsFor } from './faqs'
import { getService, services } from './services'

describe('services carry the live pages verbatim', () => {
  it('has three services with an HTML body and video fields', () => {
    expect(services.map((s) => s.slug)).toEqual(['naturopathic', 'acupuncture', 'iv-therapy'])
    for (const s of services) {
      expect(s.body.trim().startsWith('<')).toBe(true)
      expect(s.video).toEqual({ loop: null, poster: null, youtube: null })
    }
  })

  it('briefs each loop for the placeholder, horizontal, in UI chrome without dashes, and has no photo slot', () => {
    for (const s of services) {
      expect(s.loopBrief).toMatch(/^A short horizontal loop of /)
      expect(s.loopBrief).not.toMatch(/[–—]/)
      expect(s).not.toHaveProperty('image')
    }
  })

  it('carries no fee or summary fields any more', () => {
    for (const s of services) {
      expect(s).not.toHaveProperty('fees')
      expect(s).not.toHaveProperty('whoFor')
      expect(s).not.toHaveProperty('summary')
      expect(s).not.toHaveProperty('steps')
    }
  })

  it('opens each body with the live page opening line', () => {
    expect(getService('naturopathic')?.body).toContain('Do you wake up feeling refreshed and ready to start your day')
    expect(getService('acupuncture')?.body).toContain('Acupuncture can help shift our bodies out of this overdrive mode')
    expect(getService('iv-therapy')?.body).toContain('Millions of people wake up every morning feeling tired')
  })

  it('keeps the closing block only where the live page has one', () => {
    expect(getService('naturopathic')?.closing).toContain('Naturopathic Medicine at Brio Health')
    expect(getService('acupuncture')?.closing).toContain('Acupuncture at Brio Health')
    expect(getService('iv-therapy')?.closing).toBe('')
  })

  it('heads the FAQs with the live page heading, as content, not markup', () => {
    for (const s of services) expect(s.faqHeading).toBe('FAQ’s')
  })

  it('renders the Dr. Lee quote as a blockquote with his name', () => {
    expect(getService('naturopathic')?.body).toMatch(
      /<blockquote>[\s\S]*“I was introduced to the Naturopathic principles[\s\S]*Dr\. Lee<\/p>\s*<\/blockquote>/,
    )
    expect(getService('acupuncture')?.body).toMatch(
      /<blockquote>[\s\S]*“There is incredible wisdom in Traditional Chinese Medicine[\s\S]*Dr\. Lee<\/p>\s*<\/blockquote>/,
    )
  })
})

describe('faqs are the live answers, grouped by page', () => {
  it('has the live counts per group and no pending flag', () => {
    expect(faqsFor('booking')).toHaveLength(6)
    expect(faqsFor('naturopathic')).toHaveLength(5)
    expect(faqsFor('acupuncture')).toHaveLength(9)
    expect(faqsFor('iv-therapy')).toHaveLength(6)
    for (const f of faqs) expect(f).not.toHaveProperty('pending')
  })

  it('keeps the fees inside the live cost answers, verbatim', () => {
    expect(faqsFor('naturopathic').at(-1)?.answer).toBe(
      '(Please note: Fees subject to change)\nThe Initial Assessment is 30 minutes and done virtually: $150\nFollow up 30 minute consultation: $110',
    )
    expect(faqsFor('acupuncture').at(-1)?.answer).toBe(
      'The Initial Acupuncture Assessment is 30 minutes and done virtually: $150\nAcupuncture Treatment : $100',
    )
    expect(faqsFor('iv-therapy').at(-1)?.answer).toBe(
      'The Initial I.V. Therapy Assessment is 30 minutes and done virtually: $150\nI.V. therapy Formulas range from $115 to $250 depending on the formula',
    )
  })

  it('starts the booking FAQs with the cancellation policy', () => {
    expect(faqsFor('booking')[0].question).toBe('What is your cancellation policy?')
    expect(faqsFor('booking')[3].answer).toContain('We currently do not offer direct billing.')
  })
})
