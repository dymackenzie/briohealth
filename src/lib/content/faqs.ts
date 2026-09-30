import { getService, type ServiceSlug } from './services'

/**
 * Answers are lifted from the live service pages. Every one is `pending`
 * until the client signs them off (spec section 6). Referrals, insurance and
 * direct billing are left out until the client confirms them.
 */

export type FaqGroup = 'general' | ServiceSlug

export interface FaqItem {
  question: string
  answer: string
  group: FaqGroup
  pending: boolean
}

// The cost answer reads the fees rather than repeating them, so they are
// edited in one place (services.ts).
const [initialFee, followUpFee] = getService('naturopathic')!.fees

export const faqs: FaqItem[] = [
  {
    question: 'What happens at my first visit?',
    answer:
      'Your initial assessment is 30 minutes and virtual. Dr. Lee listens to what is going on, reviews your intake form with you and starts your treatment plan. Your second visit is in person, with a physical exam and any further testing.',
    group: 'general',
    pending: true,
  },
  {
    question: 'How should I prepare?',
    answer:
      'Complete the online intake form several days before your appointment, and email us your most recent blood tests.',
    group: 'general',
    pending: true,
  },
  {
    question: 'Can you order lab tests?',
    answer:
      'Yes. Dr. Lee can order lab tests through LifeLabs or other labs. The cost varies depending on the tests.',
    group: 'general',
    pending: true,
  },
  {
    question: 'Will I need to take supplements?',
    answer: 'Not necessarily. Supplements are prescribed case by case, when they fit your plan.',
    group: 'general',
    pending: true,
  },
  {
    question: 'What does it cost?',
    answer: `A naturopathic initial assessment (30 minutes, virtual) is ${initialFee.amount}, and a 30-minute follow-up is ${followUpFee.amount}. Lab test costs vary. Fees are subject to change.`,
    group: 'general',
    pending: true,
  },
  {
    question: 'Does acupuncture hurt?',
    answer:
      'Most people find it deeply relaxing. You are seated or lying down in a private room and monitored throughout.',
    group: 'acupuncture',
    pending: true,
  },
  {
    question: 'What should I wear?',
    answer: 'Loose clothing, so sleeves and pant legs roll up easily.',
    group: 'acupuncture',
    pending: true,
  },
  {
    question: 'How many treatments will I need?',
    answer: 'A series of 3 to 6 treatments is usual for the best results.',
    group: 'acupuncture',
    pending: true,
  },
  {
    question: 'How long does an I.V. take?',
    answer: '30 to 90 minutes, depending on your formula.',
    group: 'iv-therapy',
    pending: true,
  },
  {
    question: 'How should I prepare for an I.V.?',
    answer:
      'Complete the intake form first, come well hydrated, and wear sleeves that roll up easily.',
    group: 'iv-therapy',
    pending: true,
  },
  {
    question: 'Is I.V. therapy safe for me?',
    answer:
      'That is what the 30-minute consultation is for. Dr. Lee checks that I.V. therapy is both safe and effective for you before your first treatment.',
    group: 'iv-therapy',
    pending: true,
  },
  {
    question: 'Do I need to come in person for the first appointment?',
    answer:
      'No. The initial assessment is a 30-minute virtual visit. The physical exam happens at your first in-person visit.',
    group: 'naturopathic',
    pending: true,
  },
]

export function faqsFor(group: FaqGroup): FaqItem[] {
  return faqs.filter((f) => f.group === group)
}
