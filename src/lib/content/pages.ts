import { site } from '@/lib/site'
import { slots } from './photos'

/** Heading and lead per page template, shaped like their SCF groups. */
export const pages = {
  about: {
    title: 'Dr. Jeffrey Lee, N.D., R.Ac.',
    lead: `Naturopathic Physician and Registered Acupuncturist, serving Richmond since ${site.foundedYear}.`,
    // Fallback story, from the live About page, used when WordPress is unreachable.
    story: [
      'Dr. Lee holds degrees in naturopathic medicine and acupuncture from Bastyr University in Seattle, and a science degree from the University of British Columbia. He is one of the few practitioners in BC licensed as both a Naturopathic Physician and a Registered Acupuncturist.',
      `He has practised in Richmond since ${site.foundedYear}, and Brio Health has looked after more than 5,000 patients in that time.`,
    ],
    credentials: [
      'Naturopathic Physician and Registered Acupuncturist',
      'Bastyr University, Seattle: naturopathic medicine and acupuncture',
      'University of British Columbia: science degree',
      `Practising in Richmond since ${site.foundedYear}`,
    ],
    award: 'Voted Best Naturopath in Best of Richmond 2025, by Richmond News.',
    photos: slots.about,
  },
  // The live Book Now page (5913), verbatim. The three statements are the
  // screening the live form does before it hands over to Jane.
  newPatient: {
    title: 'Welcome to Brio Health',
    videoUrl: 'https://yourbriohealth.com/wp-content/uploads/2024/02/BrioBookNowVideo.mp4',
    intro: `
<p>Whether you are booking a Naturopathic Medicine, Acupuncture or I.V. Therapy visit, all patients will begin with an <strong>assessment consultation</strong> with Dr. Lee.</p>
<p>The assessment consultation will be done as an <strong>online virtual visit</strong> followed by an <strong>in person</strong> visit.</p>
<p>Here are the steps to booking your appointment:</p>
<p><strong>Step 1:</strong> Answer the 3 questions below and click the “Get Started” button.</p>
<p><strong>Step 2:</strong> Book the first available appointment with Dr. Lee.</p>
<p><strong>Step 3:</strong> Fill out and submit the online intake form as soon as possible so that Dr. Lee can prepare for your visit.</p>
`,
    statementsHeading: 'Step 1: Answer the 3 questions below',
    statements: [
      'I understand that working with Dr. Lee is not about quick fixes. I understand that true healing takes time and I am committed to doing my best on this health journey.',
      'I understand that Dr. Lee’s practice is focused on Proactive Healthcare, and he is currently not focusing on Cancer Care, Pediatric Care & Women’s Hormonal Healthcare.',
      'I understand that the initial assessment consultation is an online virtual visit and the second visit will be done in person. Virtual appointments are on: Monday, Tuesday, Thursday & Saturday. In person appointments (Acupuncture, I.V. Therapy, Naturopathic visits) are on: Monday, Tuesday & Thursday.',
    ],
    faqHeading: 'FAQ’s',
    /** Ours: UI chrome for people who have already been screened. */
    returningLabel: 'Returning patient? Book directly',
  },
  contact: {
    title: 'Get in touch',
    lead: "Questions about whether we can help? Send a note or give us a call. We're happy to talk it through before you book.",
    formHeading: 'Send us a message',
    detailsHeading: 'The clinic',
    privacyNote: "Please don't include medical details you wouldn't want sent by email. For anything sensitive, call us instead.",
  },
  pickleball: {
    title: 'Pickleball and community',
    lead: 'Dr. Lee plays several days a week. Staying active with other people is half the point of getting your energy back.',
    fallback: 'More on our pickleball community soon. In the meantime, come say hello at the clinic.',
    photos: slots.pickleball,
  },
  blog: {
    title: 'Notes on getting your health back',
    lead: 'Nutrition, treatment and what we have learned in the clinic.',
    empty: 'Nothing here yet. Check back soon.',
  },
  notFound: {
    title: "We can't find that page",
    body: 'It may have moved when we rebuilt the site. The services, the blog archive and booking are all still here.',
  },
} as const
