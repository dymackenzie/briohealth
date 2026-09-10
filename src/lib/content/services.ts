/**
 * Three services, matching what the clinic actually advertises.
 *
 * `wpSlug` is where the copy lives on the existing install — the paths are
 * historical and don't match the new URLs, hence the mapping.
 *
 * `image` and `video` are placeholder briefs, not filenames. Both get shot
 * later; the strings are what the slots show in the meantime.
 */
export const services = [
  {
    slug: 'naturopathic',
    wpSlug: 'naturopathic',
    title: 'Naturopathic Medicine',
    summary:
      'Root-cause care built around your history, your body and your goals. We look for what is driving the symptom, not just the symptom.',
    lead: 'A full picture of your health, not a five-minute appointment.',
    image: 'Naturopathic consultation — Dr. Lee and patient in discussion',
    video:
      'Dr. Lee on what happens in a first naturopathic appointment — 60–90 seconds',
    treats: [
      'Fatigue and low energy',
      'Digestive issues',
      'Food sensitivities',
      'Hormonal balance',
      'Skin conditions',
      'Immune support',
    ],
  },
  {
    slug: 'acupuncture',
    wpSlug: 'acupuncture-3',
    title: 'Acupuncture',
    summary:
      'Traditional Chinese Medicine for pain, sleep, stress and recovery — including sports injuries and their prevention.',
    lead: 'Registered acupuncture, used on its own or alongside naturopathic care.',
    image: 'Acupuncture treatment — needles in place, calm room',
    video: 'Dr. Lee on what acupuncture feels like and what it treats',
    treats: [
      'Chronic and acute pain',
      'Sports injuries',
      'Sleep problems',
      'Stress and anxiety',
      'Headaches and migraines',
      'Recovery and mobility',
    ],
  },
  {
    slug: 'iv-therapy',
    wpSlug: 'i-v-therapy',
    title: 'I.V. Therapy',
    summary:
      'Targeted nutrients delivered directly, for energy, immune support and recovery when the digestive route is not enough.',
    lead: 'Nutrients that bypass the gut, for when absorption is the problem.',
    image: 'IV therapy — drip in progress, patient comfortable in chair',
    video:
      'Walkthrough of an I.V. session — what is involved and how long it takes',
    treats: [
      'Low energy and fatigue',
      'Immune support',
      'Nutrient deficiencies',
      'Poor absorption',
      'Recovery support',
      'Hydration',
    ],
  },
] as const

export type Service = (typeof services)[number]

export function getService(slug: string) {
  return services.find((s) => s.slug === slug) ?? null
}
