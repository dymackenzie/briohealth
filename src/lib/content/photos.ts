import { WP_UPLOADS_URL } from '@/lib/wp/client'

/**
 * Which photo fills which slot, the crop, and why.
 *
 * Web-sized copies live in public/photos (the originals are in the gitignored
 * photo-originals/). Every shoot photo except the lobby has Dr. Lee in it, and
 * the lobby shows a neighbouring business's Botox banner, so it is never used.
 *
 * The rule: Dr. Lee appears on /about and /pickleball only. The homepage hero
 * has no photo: it is the illustrated herb garden (src/components/garden),
 * which replaced the stock shortlist on 2026-10-05. /about runs one photo,
 * lee-portrait-clinic, whole at 2:3. Every other slot is a patient-side
 * crop via `position` (CSS object-position, at 4/5 or 1/1), or a `null`
 * photo whose `subject` is the brief for the next shoot. A null never
 * breaks a layout: Figure renders a designed placeholder.
 *
 * Retired (still in public/photos, unused): lee-portrait-window and
 * lee-market-stall, which ran on /about until 2026-10-05, and
 * lee-consultation-tall, which ran below the story there until the same
 * day. lee-reviewing-plan, lee-treatment, lee-outdoors-family,
 * acupuncture-tall, iv-tall, naturopathic-tall, iv-wide and lobby: he
 * dominates each frame and no crop fixes it; iv-wide puts his face at
 * 41-56% of the width, inside any left-anchored crop. naturopathic-wide and
 * acupuncture-wide were the service tiles' 4/5 patient-side crops; the
 * service rows are 16:9 video stills now, and cut wide those frames show
 * Dr. Lee. Also unused: the WP host's pickleball-1-rotated.jpg, a selfie the
 * live Pickleball page carries; the spec lists the Ben Johns, Jordan Briones
 * and court photos only.
 */

// The live media library, wherever WP_API_URL points.
const WP = WP_UPLOADS_URL

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
  /** 2:3, shown whole on /about beside the story; the page's LCP image. */
  guideClinicPortrait: {
    src: '/photos/lee-portrait-clinic.jpg',
    alt: 'Dr. Jeffrey Lee in his clinic',
    position: '50% 50%',
  },
  /** On the WP host. Dr. Lee may appear on /pickleball, so the frame is centred. */
  pickleballCourt: {
    src: `${WP}/2025/11/pickleball2.jpg`,
    alt: 'Pickleball players lined up with their paddles on an indoor court, one kneeling in front',
    position: '50% 50%',
  },
  /** On the WP host, for /pickleball, where Dr. Lee may appear. */
  pickleballBenJohns: {
    src: `${WP}/2025/11/Ben-Johns.jpg`,
    alt: 'Dr. Jeff with Ben Johns on a pickleball court',
    position: '50% 30%',
  },
  pickleballJordanBriones: {
    src: `${WP}/2025/11/Jordan-Briones-scaled.jpg`,
    alt: 'Dr. Jeff with Jordan Briones',
    position: '50% 30%',
  },
} as const satisfies Record<string, Photo>

export const slots = {
  about: {
    portrait: { subject: 'Dr. Jeffrey Lee, portrait', photo: photos.guideClinicPortrait },
  },
  pickleball: {
    court: { subject: 'A community game on the court', photo: photos.pickleballCourt },
    benJohns: { subject: 'Dr. Jeff with Ben Johns', photo: photos.pickleballBenJohns },
    jordanBriones: { subject: 'Dr. Jeff with Jordan Briones', photo: photos.pickleballJordanBriones },
  },
} as const satisfies Record<string, PhotoSlot | Record<string, PhotoSlot>>
