/**
 * Photos that already exist in the client's own WordPress library.
 *
 * Every slot on the site still carries its brief. The ones that spread an
 * entry from here show a real picture in the meantime, which makes the mockup
 * a lot more convincing without pretending the shoot has happened.
 *
 * Only the clinic's own pictures of their own people are in here. The library
 * also holds a pile of licensed stock: acupuncture models, an IV drip macro,
 * the mortar-and-pestle-with-a-stethoscope shot. None of it is used. The brief
 * rules that look out, one of the files is named `depositphotos-...` and may
 * never have been licensed at all, and a stock treatment room tells a patient
 * the clinic looks like something it doesn't.
 *
 * Slots left without one stay as labelled placeholders on purpose. The gaps
 * are the shot list, and they make the case for the shoot better than an
 * email does.
 *
 * URLs point at the apex today and move to cms. with everything else at
 * cutover; next.config.ts allows both hosts.
 */

const WP = 'https://yourbriohealth.com/wp-content/uploads'

export const photos = {
  leePortrait: {
    src: `${WP}/2023/10/drjefflee.jpeg`,
    alt: 'Dr. Jeffrey Lee',
  },
  leePortraitAlt: {
    src: `${WP}/2020/01/drjefflee.jpg`,
    alt: 'Dr. Jeffrey Lee',
  },
  leeCoat: {
    src: `${WP}/2024/02/dr_jeff_lee-scaled-e1706829079893.jpeg`,
    alt: 'Dr. Jeffrey Lee at the clinic',
  },
  leeTeaching: {
    src: `${WP}/2024/02/dr-jeff-lee-teaching.jpeg`,
    alt: 'Dr. Jeffrey Lee talking with a small group',
  },
  leeMarket: {
    src: `${WP}/2024/05/BRIO-Jeff-scaled-e1715974860745.jpeg`,
    alt: 'Dr. Jeffrey Lee at a farmers market',
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
