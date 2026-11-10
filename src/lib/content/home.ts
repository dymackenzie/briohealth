import { reviewsUrl } from '@/lib/site'
import type { ServiceSlug } from './services'

/**
 * The homepage in the order of Dr. Jeff's second wireframe (2026-10-24,
 * `docs/Brio Health 2026 WIRE FRAME WEBSITE.pdf`): hero, stakes, value,
 * services, trust, plan, explanatory paragraph. Every string is the
 * wireframe's, with the first round's reading notes kept: no double spaces,
 * no capitals-only labels. One key per SCF field group, named after the
 * section. The buttons say `site.ctaLabel` ("Book Appointment") like the rest
 * of the site; the wireframe's "Schedule a Consultation" was dropped
 * (2026-11-07).
 */

export type ValueIcon = 'path' | 'plant' | 'scales' | 'hand-heart'

export interface HomeContent {
  hero: {
    heading: string
    // Dr. Jeff took the tagline out to see the hero without it (2026-11-10)
    sentence?: string
  }
  stakes: {
    heading: string
    sentence: string
    points: string[]
  }
  value: {
    heading: string
    sentence: string
    points: { icon: ValueIcon; text: string }[]
  }
  services: {
    order: ServiceSlug[]
  }
  trust: {
    heading: string
    sentence: string
    stats: { title: string; body: string; link?: string }[]
    badge: { src: string; alt: string; width: number; height: number }
    badgeHeading: string
    badgeThanks: string
  }
  plan: {
    heading: string
    sentence: string
    steps: { title: string; body: string }[]
  }
  explain: {
    heading: string
    sentence: string
    paragraphs: string[]
  }
}

export const home: HomeContent = {
  hero: {
    heading: 'Reclaim Your Vitality Naturally',
  },

  stakes: {
    heading: 'Don’t Let Fatigue Control Your Life',
    sentence: 'What happens if you continue to ignore your health?',
    points: [
      'You’re exhausted and drained every day.',
      'Staying focused is a constant challenge',
      'You feel overwhelmed by your symptoms',
      'Your body feels out of balance and chaotic',
      'Chronic inflammation and burnout can ruin health.',
      'Digestive issues lead to discomfort',
      'Frequent illness disrupts your life',
      'Anxiety leaves you feeling unproductive',
    ],
  },

  value: {
    heading: 'Live with Lasting Energy',
    sentence: 'Experience the joy of true vitality in everyday life.',
    points: [
      { icon: 'path', text: 'Customized treatment plans addressing your unique needs' },
      { icon: 'plant', text: 'Rooted in Tradition. Guided by Science. Focused Personalized Care' },
      { icon: 'scales', text: 'Proven methods to restore balance and energy' },
      { icon: 'hand-heart', text: 'Support from a dedicated health professional with proven success' },
    ],
  },

  services: {
    order: ['naturopathic', 'acupuncture', 'iv-therapy'],
  },

  trust: {
    heading: 'We Make Your Health Journey Simple',
    sentence: 'With 20 years of experience, we know how to help you.',
    stats: [
      {
        title: '20 years of Clinical experience',
        body: 'Helping thousands reclaim their health for over two decades',
      },
      {
        title: 'Trusted by over 5,000+ patients.',
        body: 'Validated with numerous positive reviews and awards.',
        link: reviewsUrl,
      },
    ],
    // Our own seal citing the award, not Richmond News' logo; their official winner badge replaces it if the clinic gets one
    badge: {
      src: '/badges/best-of-richmond-2026.svg',
      alt: 'Best of Richmond 2026, Best Naturopath, Richmond News',
      width: 240,
      height: 240,
    },
    badgeHeading: 'Brio Health was voted in Richmond News’ “Best of Richmond 2026” in the category of Best Naturopath!',
    badgeThanks: 'Thank you, Richmond!',
  },

  plan: {
    heading: '3 Simple Steps to Transform Your Health',
    sentence: 'Easy steps to restore your vitality and energy.',
    steps: [
      {
        title: 'Assessment',
        body: 'Everyone’s healing journey is unique. During the initial assessment, we carefully listen and uncover your root causes.',
      },
      {
        title: 'Healthy Baseline',
        body: 'No one appreciates a cookie cutter approach. We build a plan that removes obstacles and restore balance throughout your body.',
      },
      {
        title: 'Cultivate Vitality',
        body: 'We guide and empower you to take the right steps towards vitality. We maximize energy production for long-term wellness.',
      },
    ],
  },

  explain: {
    heading: 'Your Health Matters: Let Us Help',
    sentence: 'You deserve to feel energized and healthy.',
    paragraphs: [
      'At Brio Health, we believe you deserve to feel healthy, vibrant, and full of energy. Whether you’re facing ongoing health issues, feeling drained as a busy professional, or seeking preventive health strategies for healthy aging, we’re here to help.',
      'Many people chase quick fixes for their health concerns, which often leads to confusion in the body and more serious problems down the road, like fatigue and inflammation.',
      'Our personalized approach focuses on identifying and addressing the root causes of your health challenges, rather than simply treating symptoms. For over 20 years, we’ve empowered thousands of patients to transform their health and reclaim their vitality.',
      'Don’t let frustration hold you back any longer—schedule a consultation today and discover how you can take charge of your health!',
    ],
  },
}
