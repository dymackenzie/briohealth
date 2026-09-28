import { site, yearsPractising } from '@/lib/site'
import { services } from './services'

/**
 * The homepage runs in StoryBrand order: what the patient wants, what's in
 * the way, who helps, the plan, the decision, then proof and reassurance.
 *
 * Headlines come from the wireframe; the body copy is the clinic's own, from
 * their live homepage and service pages. Every fact in here is on the live
 * site — anything that isn't (insurance, parking, referrals) stays out until
 * the client confirms it.
 *
 * Becomes SCF fields once WordPress is set up, so keep the shape flat.
 */

/**
 * Services as outcomes — what each is for, in the patient's terms. The
 * outcome lines only name conditions the service pages already list.
 *
 * Acupuncture and I.V. have no patient-centred wide shot yet, so their briefs
 * ask for details with no faces.
 */
const serviceFraming = {
  naturopathic: {
    outcome: "For when you're tired all the time, your digestion is off, and you want to know why.",
    image: 'Patient in consultation, arm out, listening',
  },
  acupuncture: {
    outcome: 'For when pain, stress or poor sleep is wearing you down.',
    image: 'Acupuncture needles in place on a forearm, calm room — detail, no faces',
  },
  'iv-therapy': {
    outcome: 'For when your energy is low, you keep getting sick, or you need to recover from hard training.',
    image: "I.V. bag and line, patient's hand resting on the chair arm — detail, no faces",
  },
} as const

export const home = {
  hero: {
    // Split so the last word can take the underline.
    heading: 'Reclaim Your Vitality',
    headingAccent: 'Naturally',
    body: 'Tired of feeling exhausted and confused about your health?',
    cta: 'Book an appointment',
    secondaryCta: 'See how it works',
    image: 'A patient mid-conversation at a first visit, warm natural light',
  },

  problem: {
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
    image: 'Patient at home, early morning, tired at the kitchen table — before',
  },

  guide: {
    heading: "You don't have to figure this out alone",
    // His words, from the live acupuncture page.
    quote:
      'I used to be overweight and chronically tired all the time, so I really understand what my patients are going through.',
    attribution: 'Dr. Jeffrey Lee, N.D., R.Ac.',
    credentials: [
      'Naturopathic Physician and Registered Acupuncturist — one of the few in the area licensed as both',
      'Degrees in naturopathic medicine and acupuncture from Bastyr University in Seattle, and a science degree from UBC',
      `Serving Richmond since ${site.foundedYear}`,
      'Voted Best Naturopath in Best of Richmond 2025, by Richmond News',
    ],
    link: 'More about Dr. Lee',
    image: 'Dr. Jeffrey Lee — portrait',
  },

  // /about reads `stats` from here too, which is why this key outlived the
  // section it was named for.
  empathy: {
    stats: [
      { numeric: yearsPractising, suffix: '', label: 'Years serving Richmond' },
      { numeric: 5000, suffix: '+', label: 'Patients helped' },
    ],
    award: {
      title: 'Best of Richmond 2025',
      detail: 'Voted Best Naturopath by Richmond News',
    },
  },

  plan: {
    heading: '3 Simple Steps to Reclaim Vitality',
    // Titles and bodies are their wording; `detail` is what each step
    // involves, from the service pages.
    steps: [
      {
        title: 'Assessment',
        body: 'We take the time to listen and understand your current health status, and meet you where you are.',
        detail: 'A 30-minute virtual assessment, with an intake form to fill in first.',
        image: 'Initial consultation — patient talking, being listened to',
      },
      {
        title: 'Re-establish a Healthy Baseline',
        body: 'We help you remove the obstacles to healing and restore balance in your body.',
        detail:
          'Acupuncture takes about 45 minutes in a private room; an I.V. takes 30 to 90.',
        image: 'Treatment in progress — patient relaxed on the table',
      },
      {
        title: 'Cultivate & Optimize Vitality',
        body: 'We optimize the systems that matter — digestive, neurological, blood flow — so you can maximize energy and overall health.',
        detail:
          'A series of 3 to 6 treatments is typical, and our staff schedule your follow-ups.',
        image: 'Patient on the pickleball court or a Richmond dyke path — active, no clinic',
      },
    ],
  },

  decision: {
    heading: 'Ready when you are',
    body: "Book online, or call and we'll set it up with you.",
    cta: 'Book an appointment',
    call: `Call ${site.phone}`,
    firstHeading: 'What happens first',
    first: [
      'Fill in the online intake form a few days before, and email us any recent blood tests.',
      'Your initial assessment is 30 minutes and virtual. Dr. Lee listens, goes through your intake form and starts your plan.',
      'Your second visit is in person, with a physical exam and any further testing you need.',
    ],
    feesHeading: 'Naturopathic fees',
    fees: [
      { label: 'Initial assessment (30 min, virtual)', price: '$150' },
      { label: 'Follow-up (30 min)', price: '$110' },
    ],
    feesNote: 'Fees subject to change.',
    hoursHeading: 'Hours',
  },

  // Three, not the five in the proposed IA — massage left with its
  // practitioner and laser isn't sold on its own.
  services: {
    heading: 'How we can help',
    // A view of the service list, not a second copy of it. Only the outcome
    // line and the home slot's brief are home's own.
    items: services.map((service) => ({
      slug: service.slug,
      title: service.title,
      href: `/services/${service.slug}`,
      body: service.summary,
      ...serviceFraming[service.slug],
    })),
  },

  proof: {
    heading: 'What patients say',
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

  // Answers are from the live naturopathic page. Referrals, insurance and
  // direct billing are left out until the client confirms them.
  faq: {
    heading: 'Before you book',
    body: 'Something else on your mind? Call us at',
    items: [
      {
        question: 'What happens at my first visit?',
        answer:
          'Your initial assessment is 30 minutes and virtual. Dr. Lee listens to what is going on, reviews your intake form with you and starts your treatment plan. Your second visit is in person, with a physical exam and any further testing.',
      },
      {
        question: 'How should I prepare?',
        answer:
          'Complete the online intake form several days before your appointment, and email us your most recent blood tests.',
      },
      {
        question: 'Can you order lab tests?',
        answer:
          'Yes. Dr. Lee can order lab tests through LifeLabs or other labs. The cost varies depending on the tests.',
      },
      {
        question: 'Will I need to take supplements?',
        answer:
          'Not necessarily. Supplements are prescribed case by case, when they fit your plan.',
      },
      {
        question: 'What does it cost?',
        answer:
          'A naturopathic initial assessment (30 minutes, virtual) is $150, and a 30-minute follow-up is $110. Lab test costs vary. Fees are subject to change.',
      },
    ],
  },

  close: {
    heading: 'Take the First Step Towards Wellness',
    body: 'Book an appointment today, so you can stop feeling frustrated about your health and start feeling **healthy, vibrant and full of energy** again.',
    cta: 'Book an appointment',
    secondaryCta: 'Ask us a question',
  },
} as const
