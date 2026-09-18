import { site, yearsPractising } from '@/lib/site'
import { services } from './services'

/**
 * Section order and headlines come from the wireframe; the body copy is the
 * clinic's own, lifted from their live homepage, which is more specific
 * everywhere the two differ.
 *
 * Becomes SCF fields once WordPress is set up, so keep the shape flat.
 */

export const home = {
  hero: {
    // Wireframe's headline; their own opening question underneath. Split so
    // the last word can take the underline.
    heading: 'Reclaim Your Vitality',
    headingAccent: 'Naturally',
    body: 'Tired of feeling exhausted and confused about your health?',
    cta: 'Book an appointment',
    images: {
      primary: 'Dr. Lee with a patient, warm natural light, treatment room',
      secondary: 'Clinic interior — waiting area or reception detail',
    },
  },

  stakes: {
    heading: "Don't Let Fatigue Control Your Life",
    body: 'Are you **frustrated** with your current level of health?',
    // Their five, not the wireframe's eight generic ones.
    items: [
      'Do you feel tired all the time?',
      'Do you have digestive issues?',
      'Do you get sick easily?',
      'Do you experience brain fog or anxiety?',
      'Have quick fixes left you more frustrated than when you started?',
    ],
    images: {
      tall: 'Patient in consultation — listening, mid-conversation',
      wide: 'Quiet clinic detail — natural light, plants, calm surface',
    },
  },

  value: {
    heading: 'Feel Energized Again',
    body: "At Brio Health, we don't focus on quick fixes that give you a temporary solution. That only leads to long term frustration.",
    lead: 'We uncover the **obstacles blocking you from healing** and guide you back to wellness. Our patients follow a customized road map empowering them to take control of their own health.',
    items: [
      'Custom treatment plans that target root causes, not symptoms',
      'Natural solutions backed by years of clinical experience',
      'A holistic approach that harmonizes your body systems',
      'Support to live life to the fullest, on your terms',
    ],
    image: 'Dr. Lee reviewing a treatment plan with a patient',
  },

  empathy: {
    heading: 'We Understand Your Challenges',
    body: `A licensed Naturopathic Physician and Registered Acupuncturist, **serving Richmond since ${site.foundedYear}**.`,
    stats: [
      { numeric: yearsPractising, suffix: '', label: 'Years serving Richmond' },
      { numeric: 5000, suffix: '+', label: 'Patients helped' },
    ],
    award: {
      title: 'Best of Richmond 2025',
      detail: 'Voted Best Naturopath by Richmond News',
    },
    images: {
      portrait: 'Dr. Jeffrey Lee — portrait, clinic setting',
    },
  },

  // Real Google reviews, already public on their current site. These become
  // testimonial CPT entries so the client picks which ones run.
  testimonials: [
    {
      quote:
        'Dr. Jeff Lee is the most professional, knowledgeable, gentle and trustworthy Naturopath in Richmond. I have been the recipient of many of his acupuncture, laser and naturopathic treatments and always feel stronger and healthier when I leave his office.',
      name: 'Diane C.',
      date: 'November 2024',
    },
    {
      quote:
        'He has treated me and my family — pinched nerve, sciatica, ankle sprains, fibromyalgia — for over a decade. We will follow him wherever he goes. As honest and as competent as they come.',
      name: 'Dennis B.',
      date: 'February 2024',
    },
    {
      quote:
        'He spends the time to get to the root cause of your health concerns. You can tell he really cares about his patients. The IV treatments from Brio are the best.',
      name: 'Brandon W.',
      date: 'February 2024',
    },
  ],

  plan: {
    heading: '3 Simple Steps to Reclaim Vitality',
    // Their wording. The wireframe was paraphrasing these anyway.
    steps: [
      {
        title: 'Assessment',
        body: 'We take the time to listen and understand your current health status, and meet you where you are.',
        image: 'Initial consultation — Dr. Lee listening, patient talking',
      },
      {
        title: 'Re-establish a Healthy Baseline',
        body: 'We help you remove the obstacles to healing and restore balance in your body.',
        image: 'Treatment in progress — acupuncture or IV therapy',
      },
      {
        title: 'Cultivate & Optimize Vitality',
        body: 'We optimize the systems that matter — digestive, neurological, blood flow — so you can maximize energy and overall health.',
        image: 'Patient leaving the clinic, or an active lifestyle frame',
      },
    ],
  },

  // Three, not the five in the proposed IA — massage left with its
  // practitioner and laser isn't sold on its own.
  services: {
    heading: 'How We Can Help',
    // A view of the service list, not a second copy of it. The blurbs were
    // duplicated word-for-word and would have drifted on the first edit.
    items: services.map((service) => ({
      slug: service.slug,
      title: service.title,
      href: `/services/${service.slug}`,
      body: service.summary,
      image: service.image,
    })),
  },

  close: {
    heading: 'Take the First Step Towards Wellness',
    body: 'Book an appointment today, so you can stop feeling frustrated about your health and start feeling **healthy, vibrant and full of energy** again.',
    cta: 'Book an appointment',
  },
} as const
