import { site } from '@/lib/site'
import { slots, type PhotoSlot } from './photos'
import type { ServiceSlug } from './services'

/**
 * The homepage runs in StoryBrand order: the patient's problem, the guide,
 * the plan, the decision, then proof and reassurance. Headlines are ours;
 * body copy is the clinic's own from the live homepage and service pages.
 * One key per SCF field group (spec section 8), named after the section.
 */

export interface HomeContent {
  hero: {
    heading: string
    /** 20 words max. */
    sentence: string
    image: PhotoSlot
    /** Sits on the white side of the hero. */
    award: string
  }
  stakes: {
    statement: string
    items: string[]
  }
  guide: {
    heading: string
    quote: string
    quotePending: boolean
    attribution: string
    /** Credentials in one sentence. */
    credentials: string
    award: string
    link: { label: string; href: string }
    portrait: PhotoSlot
  }
  services: {
    heading: string
    order: ServiceSlug[]
  }
  plan: {
    heading: string
    intro: string
    steps: { title: string; body: string }[]
  }
  firstVisit: {
    heading: string
    /**
     * The fee figure, which leads the figures. Only the service lives here:
     * the figure is `initialAssessmentFee(fee.service)` from services.ts,
     * rendered as `{ value: amount, label }`, so fees are edited in one place.
     */
    fee: { service: ServiceSlug }
    /** The figures after the fee. */
    figures: { value: string; label: string }[]
    happens: string[]
    leaveWithHeading: string
    leaveWith: string
    feesNote: string
    feesLink: { label: string; href: string }
  }
  proof: {
    heading: string
  }
  questions: {
    heading: string
    aside: string
  }
  close: {
    heading: string
    sentence: string
  }
}

export const home: HomeContent = {
  hero: {
    heading: 'Feel like yourself again.',
    sentence:
      'Naturopathic medicine, acupuncture and I.V. therapy in Richmond, for people who are tired of being tired.',
    image: slots.hero,
    award: 'Voted Best Naturopath, Best of Richmond 2025, Richmond News.',
  },

  stakes: {
    // Their question, and their five symptoms, from the live homepage.
    statement: 'Frustrated with your current level of health?',
    items: [
      'You feel tired all the time.',
      'Your digestion is off.',
      'You get sick easily.',
      'Brain fog, or anxiety, is getting in the way.',
      'Quick fixes have left you more frustrated than when you started.',
    ],
  },

  guide: {
    heading: "You don't have to figure this out alone",
    // His words, from the live acupuncture page. Pending his permission to
    // move it to the homepage (docs/client-inputs.md).
    quote:
      'I used to be overweight and chronically tired all the time, so I really understand what my patients are going through.',
    quotePending: true,
    attribution: 'Dr. Jeffrey Lee, N.D., R.Ac.',
    credentials: `Dr. Lee is a Naturopathic Physician and Registered Acupuncturist, trained at Bastyr University, and has practised in Richmond since ${site.foundedYear}.`,
    award: 'Voted Best Naturopath in Best of Richmond 2025, by Richmond News.',
    link: { label: 'More about Dr. Lee', href: '/about' },
    portrait: slots.guide,
  },

  services: {
    heading: 'How we help',
    order: ['naturopathic', 'acupuncture', 'iv-therapy'],
  },

  plan: {
    heading: 'Three steps back to yourself',
    intro: 'Every patient follows the same road map. What changes is what we find along it.',
    // Their wording, from the live homepage.
    steps: [
      {
        title: 'Assessment',
        body: 'We take the time to listen and understand your current health status, and meet you where you are.',
      },
      {
        title: 'Re-establish a healthy baseline',
        body: 'We help you remove the obstacles to healing and restore balance in your body.',
      },
      {
        title: 'Cultivate and optimize vitality',
        body: 'We optimize the systems that matter, digestive, neurological, blood flow, so you can maximize energy and overall health.',
      },
    ],
  },

  firstVisit: {
    heading: 'Your first visit',
    // Only figures the live naturopathic page states.
    fee: { service: 'naturopathic' },
    figures: [{ value: '30 min', label: 'Virtual, from wherever you are' }],
    happens: [
      'Fill in the online intake form a few days before, and email us any recent blood tests.',
      'Dr. Lee listens, goes through your intake form with you and starts your treatment plan.',
      'Your second visit is in person, with a physical exam and any further testing you need.',
    ],
    leaveWithHeading: 'What you leave with',
    leaveWith:
      'A treatment plan under way, and lab tests ordered through LifeLabs or another lab if you need them.',
    feesNote: 'Fees subject to change.',
    feesLink: { label: 'All fees', href: '/book#fees' },
  },

  proof: {
    heading: 'What patients say',
  },

  questions: {
    heading: 'Before you book',
    aside: 'Something else on your mind? Call us and ask.',
  },

  close: {
    heading: 'Ready when you are.',
    sentence: "Book online, or call and we'll set it up with you.",
  },
}
