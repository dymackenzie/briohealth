import { describe, expect, it } from 'vitest'
import { costAnswer, faqs } from './faqs'
import { home } from './home'
import { getService, initialAssessmentFee, services, type Fee } from './services'

/**
 * Fees are edited once and appear on the homepage, /services, the service
 * page and /book. These pin that nothing else carries its own copy.
 */
describe('fees have one source', () => {
  it('finds the initial assessment by kind', () => {
    expect(initialAssessmentFee('naturopathic')).toEqual({
      kind: 'initial',
      label: 'Initial assessment',
      note: '30 minutes, virtual',
      amount: '$150',
    })
  })

  it('still finds the initial assessment when the fees are reordered', () => {
    const service = getService('naturopathic')!
    const original = service.fees
    try {
      service.fees = [...original].reverse()
      expect(initialAssessmentFee('naturopathic')?.amount).toBe('$150')
      expect(initialAssessmentFee('naturopathic')?.kind).toBe('initial')
    } finally {
      service.fees = original
    }
  })

  it('returns null when a service has no initial assessment', () => {
    const service = getService('naturopathic')!
    const original = service.fees
    try {
      service.fees = original.filter((f) => f.kind !== 'initial')
      expect(initialAssessmentFee('naturopathic')).toBeNull()
    } finally {
      service.fees = original
    }
  })

  it('gives every service exactly one initial assessment', () => {
    for (const service of services) {
      expect(service.fees.filter((f) => f.kind === 'initial')).toHaveLength(1)
    }
  })

  it('keeps every dollar figure out of the homepage content', () => {
    expect(JSON.stringify(home)).not.toContain('$')
  })

  it('points the homepage fee at a service', () => {
    const fee = initialAssessmentFee(home.firstVisit.fee.service)
    expect(fee).toMatchObject({ label: 'Initial assessment', amount: '$150' })
  })
})

describe('the cost answer', () => {
  const initial: Fee = { kind: 'initial', label: 'Initial assessment', note: '30 minutes, virtual', amount: '$150' }
  const followUp: Fee = { kind: 'follow-up', label: 'Follow-up consultation', note: '30 minutes', amount: '$110' }

  it('is built from the service fees', () => {
    const cost = faqs.find((f) => f.question === 'What does it cost?')
    expect(cost?.answer).toBe(costAnswer(initialAssessmentFee('naturopathic'), followUp))
    expect(cost?.answer).toContain('$150')
    expect(cost?.answer).toContain('$110')
  })

  it('reads in full with both fees', () => {
    expect(costAnswer(initial, followUp)).toBe(
      'A naturopathic initial assessment (30 minutes, virtual) is $150, and a 30-minute follow-up is $110. Lab test costs vary. Fees are subject to change.',
    )
  })

  it('drops the follow-up sentence when there is no follow-up fee', () => {
    expect(costAnswer(initial, null)).toBe(
      'A naturopathic initial assessment (30 minutes, virtual) is $150. Lab test costs vary. Fees are subject to change.',
    )
  })

  it('still answers with no fees at all', () => {
    expect(costAnswer(null, null)).toBe('Lab test costs vary. Fees are subject to change.')
  })
})
