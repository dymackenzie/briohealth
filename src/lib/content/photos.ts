/**
 * Photos for the image slots.
 *
 * Most come from the clinic's own shoot and live in `public/photos` as
 * web-sized copies, capped at 2400px on the long edge. The full-size camera
 * files are 10–16 MB each and stay out of the repo, in the gitignored
 * `photo-originals/`.
 *
 * The shoot didn't cover pickleball, so those two still come from the
 * client's WordPress library. next.config.ts allows the apex and cms. hosts
 * they'll move to at cutover.
 *
 * Every slot still carries its brief as `subject`. Anything not wired up here
 * renders as a labelled placeholder, which doubles as the shot list.
 */

const WP = 'https://yourbriohealth.com/wp-content/uploads'

export const photos = {
  leeMarket: {
    src: '/photos/lee-market-stall.jpg',
    alt: 'Dr. Jeffrey Lee smiling at a farmers market stall',
  },
  lobby: {
    src: '/photos/lobby.jpg',
    alt: 'The Brio Health waiting area',
  },
  leeConsultation: {
    src: '/photos/lee-consultation-tall.jpg',
    alt: 'Dr. Jeffrey Lee using an anatomy model to explain a treatment to a patient',
  },
  leeReviewingPlan: {
    src: '/photos/lee-reviewing-plan.jpg',
    alt: 'Dr. Jeffrey Lee going over a supplement with a patient',
  },
  leePortraitClinic: {
    src: '/photos/lee-portrait-clinic.jpg',
    alt: 'Dr. Jeffrey Lee in the clinic',
  },
  leePortraitWindow: {
    src: '/photos/lee-portrait-window.jpg',
    alt: 'Dr. Jeffrey Lee',
  },
  pickleballGroup: {
    src: `${WP}/2025/11/pickleball-1-rotated.jpg`,
    alt: 'Brio Health pickleball group',
  },
  pickleballCourt: {
    src: `${WP}/2025/11/pickleball2.jpg`,
    alt: 'Players on the pickleball court',
  },
} as const

/** In step order, one per `home.plan.steps` entry. */
export const planPhotos = [
  {
    src: '/photos/lee-first-visit.jpg',
    alt: 'Dr. Jeffrey Lee listening to a couple at their first visit',
  },
  {
    src: '/photos/lee-treatment.jpg',
    alt: 'Dr. Jeffrey Lee treating a patient on the table',
  },
  {
    src: '/photos/lee-outdoors-family.jpg',
    alt: 'Dr. Jeffrey Lee outdoors on a picnic blanket with a family',
  },
] as const

/**
 * Each service shows in a wide slot (home, /services) and a tall one (its
 * own page). A single crop loses too much of one or the other.
 */
export const servicePhotos = {
  naturopathic: {
    wide: {
      src: '/photos/naturopathic-wide.jpg',
      alt: 'Dr. Jeffrey Lee in a naturopathic consultation with a patient',
    },
    tall: {
      src: '/photos/naturopathic-tall.jpg',
      alt: 'Dr. Jeffrey Lee checking a patient’s blood pressure',
    },
  },
  acupuncture: {
    wide: {
      src: '/photos/acupuncture-wide.jpg',
      alt: 'Dr. Jeffrey Lee giving an acupuncture treatment',
    },
    tall: {
      src: '/photos/acupuncture-tall.jpg',
      alt: 'Dr. Jeffrey Lee treating a patient’s neck',
    },
  },
  'iv-therapy': {
    wide: {
      src: '/photos/iv-wide.jpg',
      alt: 'Dr. Jeffrey Lee setting up an I.V. for a patient',
    },
    tall: {
      src: '/photos/iv-tall.jpg',
      alt: 'Dr. Jeffrey Lee adjusting an I.V. drip',
    },
  },
} as const
