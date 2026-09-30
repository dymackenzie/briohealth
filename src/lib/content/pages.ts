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
  book: {
    title: 'Book a consultation',
    lead: 'New patients welcome. Appointments are handled through Jane, our booking system.',
    intro: "Choose a time that works for you. If you're not sure what to book, call us and we'll point you in the right direction.",
    firstHeading: 'What happens first',
    firstNote: 'For naturopathic medicine. Acupuncture and I.V. therapy each start with their own consultation.',
    feesHeading: 'Fees',
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
