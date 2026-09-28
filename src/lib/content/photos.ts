/**
 * Photos for the image slots.
 *
 * Most come from the clinic's own shoot and live in `public/photos` as
 * web-sized copies, capped at 2400px on the long edge. The full-size camera
 * files are 10–16 MB each and stay out of the repo, in the gitignored
 * `photo-originals/`.
 *
 * The site is about the patient; Dr. Lee is the guide. Every shoot photo but
 * the lobby has him in it, so the rule is: he appears once on the homepage
 * (the guide section) and on /about, and nowhere else. Every other slot is
 * either patient-centred — `position` is an object-position crop that puts the
 * patient in frame and pushes him to the edge — or a labelled placeholder.
 *
 * Retired because he dominates the frame and no crop fixes it:
 * lee-reviewing-plan, lee-portrait-clinic, lee-treatment, lee-outdoors-family,
 * acupuncture-tall, iv-tall, and then naturopathic-tall and iv-wide too — the
 * first is a portrait so a 4/5 slot has no room to crop sideways, and in the
 * second his face sits at 41–56% of the width, inside any left-anchored 4/5
 * crop. Every I.V. slot is a placeholder until there's a patient-only shot. They stay in `public/photos` in case the client
 * wants them on /about later.
 *
 * The shoot didn't cover pickleball, so those two still come from the
 * client's WordPress library. next.config.ts allows the apex and cms. hosts
 * they'll move to at cutover.
 *
 * Every slot still carries its brief as `subject`. A `null` below renders as a
 * labelled placeholder, which doubles as the shot list.
 */

const WP = 'https://yourbriohealth.com/wp-content/uploads'

export type Photo = {
  readonly src: string
  readonly alt: string
  /** CSS object-position for the crop. */
  readonly position: string
}

export const photos = {
  patientsConsult: {
    src: '/photos/lee-first-visit.jpg',
    alt: 'A couple smiling as they talk through their health history at their first visit',
    position: '18% 50%',
  },
  patientListening: {
    src: '/photos/naturopathic-wide.jpg',
    alt: 'A patient holding out his arm, listening, as his pulse is taken at a naturopathic visit',
    position: '10% 50%',
  },
  patientAcupuncture: {
    src: '/photos/acupuncture-wide.jpg',
    alt: 'A patient lying back on the treatment table, relaxed, at the start of an acupuncture visit',
    position: '0% 60%',
  },
  lobby: {
    src: '/photos/lobby.jpg',
    alt: 'The Brio Health waiting area',
    position: '50% 60%',
  },
  guidePortrait: {
    src: '/photos/lee-portrait-window.jpg',
    alt: 'Dr. Jeffrey Lee, naturopathic physician and acupuncturist',
    position: '50% 30%',
  },
  guideExplaining: {
    src: '/photos/lee-consultation-tall.jpg',
    alt: 'Dr. Jeffrey Lee using an anatomy model to explain a treatment to a patient',
    position: '60% 50%',
  },
  guideCommunity: {
    src: '/photos/lee-market-stall.jpg',
    alt: 'Dr. Jeffrey Lee at a farmers market stall in Richmond',
    position: '50% 40%',
  },
  pickleballGroup: {
    src: `${WP}/2025/11/pickleball-1-rotated.jpg`,
    alt: 'Brio Health pickleball group',
    position: '50% 50%',
  },
  pickleballCourt: {
    src: `${WP}/2025/11/pickleball2.jpg`,
    alt: 'Players on the pickleball court',
    position: '50% 50%',
  },
} as const satisfies Record<string, Photo>

/** In step order, one per `home.plan.steps` entry. Step 3 hasn't been shot. */
export const planPhotos: readonly (Photo | null)[] = [
  photos.patientListening,
  photos.patientAcupuncture,
  null,
]

/**
 * Each service shows in a wide slot (home, /services) and a tall one (its own
 * page). A single crop loses too much of one or the other, and only
 * naturopathic has a patient-centred wide shot so far.
 */
export const servicePhotos: Record<
  'naturopathic' | 'acupuncture' | 'iv-therapy',
  { readonly wide: Photo | null; readonly tall: Photo | null }
> = {
  naturopathic: { wide: photos.patientListening, tall: photos.patientListening },
  acupuncture: { wide: null, tall: photos.patientAcupuncture },
  'iv-therapy': { wide: null, tall: null },
}
