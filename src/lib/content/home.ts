import { site } from '@/lib/site'
import { WP_UPLOADS_URL } from '@/lib/wp/client'
import { slots, type PhotoSlot } from './photos'
import type { ServiceSlug } from './services'

/**
 * The homepage in Dr. Jeff's wireframe order (spec Appendix A): hero,
 * stakes, trust, plan, explanatory paragraph. Every string is the
 * wireframe's, with the reading notes applied: live-site title casing on
 * headings the live site also has, 2006 not 2008, no double spaces, no
 * trailing period after "Increasing Energy", Best of Richmond as the only
 * logo. One key per SCF field group, named after the section.
 */

export type TrustIcon = 'certificate' | 'map-pin' | 'users'

export interface HomeContent {
  hero: {
    heading: string
    sentence: string
    image: PhotoSlot
  }
  stakes: {
    heading: string
    questions: string[]
    paragraphs: string[]
  }
  services: {
    order: ServiceSlug[]
  }
  trust: {
    stats: { icon: TrustIcon; text: string }[]
    badge: { src: string; alt: string; width: number; height: number }
    badgeHeading: string
    badgeThanks: string
  }
  plan: {
    heading: string
    steps: { title: string; body: string }[]
  }
  explain: {
    heading: string
    paragraphs: string[]
    stepsIntro: string
    steps: { title: string; body: string }[]
    closing: string
  }
}

export const home: HomeContent = {
  hero: {
    heading: 'Transform Your Health, Regain Your Life:',
    sentence: 'A Natural Approach to Building Vitality and Increasing Energy',
    image: slots.hero,
  },

  stakes: {
    heading: 'Have you been frustrated with your level of health?',
    questions: [
      'Do you feel tired all the time?',
      'Do you have digestive issues?',
      'Do you get sick easily?',
      'Do you experience brain fog or anxiety?',
    ],
    paragraphs: [
      "At Brio Health, we don't focus on quick fixes that give you a temporary solution. That only leads to long term frustration.",
      'We uncover the obstacles blocking your healing and guide you back to wellness. Our patients follow a customized road map empowering them to take control of their own health.',
    ],
  },

  services: {
    order: ['naturopathic', 'acupuncture', 'iv-therapy'],
  },

  trust: {
    stats: [
      { icon: 'certificate', text: 'Licensed Health Professionals' },
      { icon: 'map-pin', text: `Serving Richmond Since ${site.foundedYear}` },
      { icon: 'users', text: 'Trusted by over 5,000 patients' },
    ],
    // The live homepage's badge and caption (page 22731).
    badge: {
      src: `${WP_UPLOADS_URL}/2025/06/2025-best-of-richmond-logo.jpg`,
      alt: 'Best of Richmond 2025, Richmond News',
      width: 960,
      height: 540,
    },
    badgeHeading: 'Brio Health was voted in Richmond News’ “Best of Richmond 2025” in the category of Best Naturopath!',
    badgeThanks: 'Thank you, Richmond!',
  },

  plan: {
    heading: "Here's How It Works",
    steps: [
      {
        title: 'Book An Appointment',
        body: "Everyone's healing journey is unique. During the initial assessment, we carefully listen to you, and meet you where you are.",
      },
      {
        title: 'Build A Personal Health Plan',
        body: 'No one appreciates a cookie cutter approach. We build a plan specifically for you to address the root problems so you can heal from the inside out.',
      },
      {
        title: 'Be Proud Of Your Health',
        body: 'We guide and empower you to take the right steps towards vibrant health by following your custom treatment plan and making small adjustments along the way.',
      },
    ],
  },

  explain: {
    heading: 'At Brio Health we know you want to be healthy, vibrant and full of energy.',
    paragraphs: [
      'In order to be that way, you need a custom step-by-step plan that rebuilds your health from the inside out.',
      'The problem is that most people only want symptomatic relief and are misled by "quick fixes" that never address the root imbalance. This leads to confusion in the body resulting in more problems down the road like fatigue, inflammation and immune issues.',
      "We believe the current healthcare model needs to change. It's not right that we are getting sicker and sicker as a society, despite all our medical knowledge and advancements.",
      "We understand it's frustrating when your health feels stuck or worse, heading in the wrong direction. That's why our health approach is tailored to your specific needs, rather than treating a generic medical diagnosis. We have helped thousands of patients over the past 18 years transform their health with this personalized approach.",
    ],
    stepsIntro: 'Here are the steps to transform your health:',
    steps: [
      { title: 'Assessment', body: 'We take the time to listen and understand your current health status.' },
      { title: 'Re-establish a Healthy Baseline', body: 'We help you remove obstacles to healing and restore balance in your body' },
      {
        title: 'Cultivate & Optimize Vitality',
        body: 'We help you optimize the important systems in your body (ie. digestive, neurological, blood flow), so you can maximize energy production and overall health.',
      },
    ],
    closing:
      'Book an appointment today, so you can stop feeling frustrated about your health and start believing you can be healthy, vibrant and full of energy again.',
  },
}
