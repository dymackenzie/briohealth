import { describe, expect, it } from 'vitest'
import { faqs } from './faqs'
import { home } from './home'
import { getService, initialAssessmentFee } from './services'

/**
 * Fees are edited once and appear on the homepage, /services, the service
 * page and /book. These pin that nothing else carries its own copy.
 */
describe('fees have one source', () => {
  it('reads the initial assessment from the first fee of a service', () => {
    expect(initialAssessmentFee('naturopathic')).toEqual({
      label: 'Initial assessment',
      note: '30 minutes, virtual',
      amount: '$150',
    })
    expect(initialAssessmentFee('naturopathic')).toBe(getService('naturopathic')?.fees[0])
  })

  it('keeps every dollar figure out of the homepage content', () => {
    expect(JSON.stringify(home)).not.toContain('$')
  })

  it('points the homepage fee at a service', () => {
    expect(initialAssessmentFee(home.firstVisit.fee.service)?.amount).toBe('$150')
  })

  it('builds the cost answer from the service fees', () => {
    const cost = faqs.find((f) => f.question === 'What does it cost?')
    const [initial, followUp] = getService('naturopathic')!.fees
    expect(cost?.answer).toContain(initial.amount)
    expect(cost?.answer).toContain(followUp.amount)
  })
})
