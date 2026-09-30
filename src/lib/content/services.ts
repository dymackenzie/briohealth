import { slots, type PhotoSlot } from './photos'

/**
 * Three services, the ones the clinic advertises. Everything here is the
 * clinic's own copy from the live WordPress pages: `helpsWith` is their
 * condition lists, `steps` the "what a visit looks like" sequence each page
 * spells out, `fees` from each page's cost FAQ. Nothing that is not there.
 *
 * Shaped like the `service` SCF field group so it becomes the fallback.
 *
 * Fees are edited here once and read everywhere else: the homepage's first
 * visit, the cost FAQ, /services, the service page and /book. Nothing else
 * types a dollar figure.
 */

export type ServiceSlug = 'naturopathic' | 'acupuncture' | 'iv-therapy'

export interface Fee {
  label: string
  note?: string
  amount: string
}

export interface Step {
  title: string
  body: string
}

export interface ServiceContent {
  slug: ServiceSlug
  title: string
  /** Lower-case, for running text: "more about acupuncture". */
  short: string
  summary: string
  /** One line, for the /services rows and the homepage rows. */
  whoFor: string
  lead: string
  helpsWith: string[]
  steps: Step[]
  /** The initial assessment always comes first. */
  fees: Fee[]
  feesNote: string
  /** True until the client confirms the numbers. */
  feesPending: boolean
  image: PhotoSlot
}

export const services: ServiceContent[] = [
  {
    slug: 'naturopathic',
    title: 'Naturopathic Medicine',
    short: 'naturopathic medicine',
    summary:
      'Root-cause care built around your history, your body and your goals. We look for what is driving the symptom, not just the symptom.',
    whoFor: "For when you're tired all the time, your digestion is off, and you want to know why.",
    lead: 'A full picture of your health, not a five-minute appointment.',
    helpsWith: [
      "You're exhausted, and you've started to accept that as normal",
      "Your digestion is off, or certain foods don't agree with you",
      "You're dealing with allergies or skin issues",
      'Stress, anxiety, brain fog or poor sleep are getting in the way',
      "Chronic pain, headaches or an old injury hasn't settled",
      'You want the root cause found, not just the symptoms managed',
    ],
    steps: [
      {
        title: 'Fill in your intake form',
        body: 'Complete the online intake form a few days before your first visit, as thoroughly as you can, and email us any recent blood tests.',
      },
      {
        title: 'A 30-minute virtual assessment',
        body: 'Dr. Lee listens to your health concerns, fills in what the intake form left out, and starts building your treatment plan.',
      },
      {
        title: 'Your first in-person visit',
        body: 'At the clinic, Dr. Lee completes a physical exam and any further testing. If you need lab work, it goes through LifeLabs or another lab, and the cost is discussed with you.',
      },
    ],
    fees: [
      // Stated on the live naturopathic page.
      { label: 'Initial assessment', note: '30 minutes, virtual', amount: '$150' },
      // Unconfirmed.
      { label: 'Follow-up consultation', note: '30 minutes', amount: '$110' },
    ],
    feesNote: 'Fees subject to change.',
    feesPending: true,
    image: slots.services.naturopathic,
  },
  {
    slug: 'acupuncture',
    title: 'Acupuncture',
    short: 'acupuncture',
    summary:
      'Traditional Chinese Medicine for pain, sleep, stress and recovery, including sports injuries.',
    whoFor: 'For when pain, stress or poor sleep is wearing you down.',
    lead: 'Registered acupuncture, on its own or alongside naturopathic care.',
    helpsWith: [
      "You're living with chronic pain, a sports injury or headaches",
      'Stress, anxiety or low mood have you stuck in overdrive',
      "You can't sleep, or you're dealing with fatigue or hot flashes",
      'You have nausea, bloating or digestive pain',
      "You're dealing with allergies, weak immunity or inflammation",
    ],
    steps: [
      {
        title: 'Assessment',
        body: "A 30-minute virtual assessment. Dr. Lee takes a thorough medical history, answers your questions and creates a treatment plan for you, even if you've had acupuncture before, because safety comes first.",
      },
      {
        title: 'Treatments',
        body: "30 to 45 minutes in a comfortable private room, seated or lying down, and you're monitored throughout. Most people find it deeply relaxing. Wear loose clothing so sleeves and pant legs roll up.",
      },
      {
        title: 'Aftercare',
        body: "You'll get aftercare advice for you: rest, stretching, hydration. A series of 3 to 6 treatments is usual for the best results.",
      },
    ],
    fees: [
      { label: 'Initial assessment', note: '30 minutes, virtual', amount: '$150' },
      { label: 'Acupuncture treatment', amount: '$100' },
    ],
    feesNote: 'Fees subject to change.',
    feesPending: true,
    image: slots.services.acupuncture,
  },
  {
    slug: 'iv-therapy',
    title: 'I.V. Therapy',
    short: 'I.V. therapy',
    summary:
      'Targeted nutrients delivered directly, for energy, immune support and recovery when the digestive route is not enough.',
    whoFor: 'For when your energy is low, you keep getting sick, or you need to recover from hard training.',
    lead: 'Nutrients that bypass the gut, for when absorption is the problem.',
    helpsWith: [
      "You're running on empty: chronic fatigue, exhaustion or insomnia",
      'Stress, anxiety, low mood or poor focus are wearing you down',
      'Your immune system feels weak: sinus trouble, seasonal allergies, one virus after another',
      'You get tension headaches, migraines or muscle spasms',
      "You're an athlete recovering from injury, competition or cramps",
      "Digestive issues mean you're not absorbing nutrients well",
    ],
    steps: [
      {
        title: 'A 30-minute consultation',
        body: 'Complete the intake form first. In a 30-minute virtual consultation, Dr. Lee checks that I.V. therapy is both safe and effective for you.',
      },
      {
        title: 'Your first I.V.',
        body: 'Treatments take 30 to 90 minutes, depending on your formula. Come well hydrated, in sleeves that roll up easily. Each preparation is made for you, in-house.',
      },
      {
        title: 'After your treatment',
        body: 'Most people leave feeling relaxed and rested. Book your follow-up with the staff. Dr. Lee designs the plan, whether that means a series or a seasonal top-up.',
      },
    ],
    fees: [
      { label: 'Initial assessment', note: '30 minutes, virtual', amount: '$150' },
      { label: 'I.V. treatment', note: 'Varies with the formula', amount: '$115-$250' },
    ],
    feesNote: 'Fees subject to change.',
    feesPending: true,
    image: slots.services['iv-therapy'],
  },
]

export function getService(slug: string): ServiceContent | null {
  return services.find((s) => s.slug === slug) ?? null
}

/** A service's initial assessment: by convention, its first fee. */
export function initialAssessmentFee(slug: ServiceSlug): Fee | null {
  return getService(slug)?.fees[0] ?? null
}
