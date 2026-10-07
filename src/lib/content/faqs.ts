import type { ServiceSlug } from './services'

/**
 * The live pages' FAQ accordions, word for word (book-now 5913,
 * naturopathic 6066, acupuncture-3 6040, i-v-therapy 6033), in their
 * order. Fees live only here, inside the cost answers, as on the live
 * site. Multi-line answers keep their line breaks as "\n"; the Accordion
 * renders them whitespace-pre-line. These become `faq` CPT entries.
 */

export type FaqGroup = 'booking' | ServiceSlug

export interface FaqItem {
  question: string
  answer: string
  group: FaqGroup
}

export const faqs: FaqItem[] = [
  // Book Now page
  {
    group: 'booking',
    question: 'What is your cancellation policy?',
    answer:
      'We have a strict 48-hour cancellation policy.Late cancellations or no-shows will require full payment of the missed visit or treatment. Missed appointments due to emergencies will be handled on a case-by-case basis.',
  },
  {
    group: 'booking',
    question: 'Which appointment should I book?',
    answer:
      'ALL new patients begin with a VIRTUAL initial appointment.You will meet with Dr. Lee virtually for 30 minutes, at which time a health history is taken and a tailored treatment plan will be created.',
  },
  {
    group: 'booking',
    question: 'I am not comfortable with a virtual visit, can I see Dr. Lee in person for my initial consultation?',
    answer:
      'In-person visits are prioritized for physical exams and in-clinic treatments only. However, give us a call and we will do our best to accommodate an in-person visit.',
  },
  {
    group: 'booking',
    question: 'Do you offer direct billing for private insurance?',
    answer:
      'We currently do not offer direct billing. Patients pay for the treatment and submit receipts to their insurance provider for reimbursement.',
  },
  {
    group: 'booking',
    question: 'What forms of payments do you accept?',
    answer: 'Brio Health is a cashless clinic. We accept debit and credit cards only (Visa, MasterCard, American Express).',
  },
  {
    group: 'booking',
    question: 'Why is a credit card kept on file?',
    answer:
      'Having a credit card on file simplifies the booking and payment process.This saves time and keeps patient costs low. All credit card information is encrypted and stored securely on Stripe Payments.',
  },

  // Naturopathic Medicine page
  {
    group: 'naturopathic',
    question: 'What should I expect from my first Naturopathic visit?',
    answer:
      'During the initial virtual visit, Dr. Lee will listen to your health concerns and gather additional information from your intake form. He will begin building a treatment plan for you. The subsequent visit will be an in-person visit where Dr. Lee will complete a physical exam and further testing.',
  },
  {
    group: 'naturopathic',
    question: 'How do I best prepare for my visit?',
    answer:
      'Step 1: Complete the online intake form several days before your first visit and as thoroughly as possible.\nStep 2: Email any recent blood tests to us.\nStep 3: Prepare your mindset. The Naturopathic process moves beyond just symptom management and towards finding the root cause of your issues. Be prepared to work hard and enjoy the health transformation.',
  },
  {
    group: 'naturopathic',
    question: 'Can a Naturopathic Physician order laboratory tests?',
    answer:
      'Yes, we may order further laboratory tests from Lifelabs or other labs. The cost of these lab tests varies and will be discussed with you.',
  },
  {
    group: 'naturopathic',
    question: 'Does Dr. Lee prescribe supplements?',
    answer:
      'In order for the body to experience long term healing, it needs to be properly cleansed and properly nourished. For some patients, specific herbs or supplements are necessary. Dr. Lee may prescribe supplements on a case-by-case basis.',
  },
  {
    group: 'naturopathic',
    question: 'What is the cost of a Naturopathic Visit at Brio Health?',
    answer:
      '(Please note: Fees subject to change)\nThe Initial Assessment is 30 minutes and done virtually: $150\nFollow up 30 minute consultation: $110',
  },

  // Acupuncture page
  {
    group: 'acupuncture',
    question: 'I am new to Brio, what should I expect at my first Acupuncture Assessment?',
    answer:
      'All new patients will meet with Dr. Lee virtually for a 30 minute initial consultation, where a thorough evaluation will be conducted and a treatment plan created. After this evaluation, you will be able to schedule your acupuncture treatments.',
  },
  {
    group: 'acupuncture',
    question: 'I have done acupuncture before, why do I need this initial consultation?',
    answer:
      'Patient safety is a priority, therefore beginning any treatments a thorough medical history is taken. Patient outcomes are always better when a careful assessment is done in the beginning.',
  },
  {
    group: 'acupuncture',
    question: 'Does Acupuncture hurt?',
    answer:
      'During an Acupuncture treatment, fine needles are inserted into specific locations on the body. Some people may feel a light pin prick on the skin with each needle insertion, while others barely feel anything. At Brio Health we use high-quality needles which significantly minimize pain and discomfort.',
  },
  {
    group: 'acupuncture',
    question: 'How many Acupuncture treatments are typically required?',
    answer:
      'The number of treatments will depend on the conditions presented. Generally, Dr. Lee encourages patients to start with a series of 3 to 6 treatments.',
  },
  {
    group: 'acupuncture',
    question: 'Does Acupuncture have any side effects?',
    answer:
      'Potential side effects of Acupuncture can include temporary pain, bleeding or bruising at the site of needle insertion. Most patients experience a deep sense of relaxation, which may lead to some lightheadedness or short term fatigue after the treatment.',
  },
  {
    group: 'acupuncture',
    question: 'How should I prepare for a visit?',
    answer:
      '3 things to consider to best prepare for an Acupuncture visit:\nWear loose clothing, so your sleeves and pant legs can be rolled up.\nEnsure you have eaten something light and are well hydrated.\nAvoid rushing to your appointment. Prepare your mind to have a restful, relaxing treatment.',
  },
  {
    group: 'acupuncture',
    question: 'How long will each session last?',
    answer: 'Treatments are between 30 to 45 minutes.',
  },
  {
    group: 'acupuncture',
    question: 'I have tried a number of different treatments and nothing has helped me, how is your approach different?',
    answer:
      'Healing the body is complex.The nervous system can keep the body stuck in pain patterns. Dr.Lee has trained with world renowned doctors in the field of Acupuncture and Functional Neurology. His approach is to unlock these stuck patterns by balancing the nervous system, improving circulation and building energy in the body.',
  },
  {
    group: 'acupuncture',
    question: 'What is the cost of an Acupuncture Treatment at Brio Health?',
    answer:
      'The Initial Acupuncture Assessment is 30 minutes and done virtually: $150\nAcupuncture Treatment : $100',
  },

  // I.V. Therapy page
  {
    group: 'iv-therapy',
    question: 'I am new to Brio, what should I expect at my first I.V. Therapy Assessment?',
    answer:
      'Patient safety is a priority, therefore beginning any treatments a thorough medical history is taken. Patient outcomes are always better when a careful assessment is done in the beginning.',
  },
  {
    group: 'iv-therapy',
    question: 'What are the side effects of I.V. Therapy?',
    answer:
      'Side effects of I.V. Therapy can include temporary pain at the site of injection, a flushing sensation, nausea, rapid heart rate and dizziness.',
  },
  {
    group: 'iv-therapy',
    question: 'How many I.V. Therapy treatments are typically required?',
    answer: 'I.V. Therapy treatments can be completed in a series or seasonally. Dr. Lee will design a custom plan for you.',
  },
  {
    group: 'iv-therapy',
    question: 'How long is an I.V. Therapy treatment?',
    answer: 'I.V. Therapy treatments can range from 30 minutes to 1.5 hours, depending on the size of the I.V. therapy formula.',
  },
  {
    group: 'iv-therapy',
    question: 'Where are your I.V. vitamins from?',
    answer:
      'The I.V. nutrients used at our clinic are pharmaceutical-grade quality. We only source through reputable Canadian pharmacies in Vancouver and Toronto. We do not order any I.V. nutrients from outside of Canada.',
  },
  {
    group: 'iv-therapy',
    question: 'What is the cost of an I.V. Therapy Treatment at Brio Health?',
    answer:
      'The Initial I.V. Therapy Assessment is 30 minutes and done virtually: $150\nI.V. therapy Formulas range from $115 to $250 depending on the formula',
  },
]

export function faqsFor(group: FaqGroup): FaqItem[] {
  return faqs.filter((f) => f.group === group)
}
