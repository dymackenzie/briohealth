/**
 * Which photo fills which slot, the crop, and why.
 *
 * Web-sized copies live in public/photos (the originals are in the gitignored
 * photo-originals/). Every shoot photo except the lobby has Dr. Lee in it, and
 * the lobby shows a neighbouring business's Botox banner, so it is never used.
 *
 * The rule: Dr. Lee appears once on the homepage (the guide section) and
 * freely on /about. Every other slot is a patient-side crop via `position`
 * (CSS object-position, at 4/5 or 1/1), or a `null` photo whose `subject` is
 * the brief for the next shoot. A null never breaks a layout: Figure renders
 * a designed placeholder.
 *
 * Retired (still in public/photos, unused): lee-reviewing-plan, lee-portrait-
 * clinic, lee-treatment, lee-outdoors-family, acupuncture-tall, iv-tall,
 * naturopathic-tall, iv-wide, lobby. He dominates each frame and no crop fixes
 * it; iv-wide puts his face at 41-56% of the width, inside any left-anchored
 * crop. Also unused: the WP host's pickleball-1-rotated.jpg, a selfie he
 * takes at the left edge; every crop that clears him cuts the face beside
 * him.
 */

const WP = 'https://yourbriohealth.com/wp-content/uploads'

export interface Photo {
  src: string
  alt: string
  /** CSS object-position: where the crop centres. */
  position: string
}

export interface PhotoSlot {
  /** The brief. Shown in the placeholder when `photo` is null. */
  subject: string
  photo: Photo | null
}

export const photos = {
  /** Only the couple is in frame at 22% at 4/5. */
  patientsFirstVisit: {
    src: '/photos/lee-first-visit.jpg',
    alt: 'A couple talking through their health history at a first visit',
    position: '22% 50%',
  },
  /** The patient, with only Dr. Lee's hands, at 20%. */
  patientListening: {
    src: '/photos/naturopathic-wide.jpg',
    alt: 'A patient holding out his arm while his pulse is taken at a naturopathic visit',
    position: '20% 50%',
  },
  patientAcupuncture: {
    src: '/photos/acupuncture-wide.jpg',
    alt: 'A patient lying back on the treatment table at the start of an acupuncture visit',
    position: '0% 60%',
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
  /**
   * On the WP host. Dr. Lee is second from the left; at 4/5 and 86% the
   * frame starts past him and no face meets either edge. At 1/1 there is no
   * position that clears him without halving someone else.
   */
  pickleballCourt: {
    src: `${WP}/2025/11/pickleball2.jpg`,
    alt: 'Pickleball players lined up with their paddles on an indoor court, one kneeling in front',
    position: '86% 50%',
  },
} as const satisfies Record<string, Photo>

export const slots = {
  hero: {
    subject: 'A patient mid-conversation at a first visit, warm natural light',
    photo: photos.patientsFirstVisit,
  },
  guide: {
    subject: 'Dr. Jeffrey Lee, portrait',
    photo: photos.guidePortrait,
  },
  services: {
    naturopathic: {
      subject: 'Naturopathic visit: the patient, listening, at ease',
      photo: photos.patientListening,
    },
    acupuncture: {
      subject: 'Acupuncture needles in place on a forearm, calm room. Detail, no faces',
      photo: photos.patientAcupuncture,
    },
    'iv-therapy': {
      subject: 'Patient settled in the I.V. chair, line in, reading or resting. No clinician in frame',
      photo: null,
    },
  },
  about: {
    portrait: { subject: 'Dr. Jeffrey Lee, portrait', photo: photos.guidePortrait },
    explaining: { subject: 'Dr. Lee explaining a treatment', photo: photos.guideExplaining },
    community: { subject: 'Dr. Lee in the community', photo: photos.guideCommunity },
    exterior: { subject: 'The clinic exterior on Sexsmith Road, daylight', photo: null },
  },
  pickleball: {
    court: { subject: 'A community game on the court', photo: photos.pickleballCourt },
  },
} as const satisfies Record<string, PhotoSlot | Record<string, PhotoSlot>>
