/**
 * Three services, matching what the clinic actually advertises.
 *
 * `wpSlug` is where the copy lives on the existing install — the paths are
 * historical and don't match the new URLs, hence the mapping.
 *
 * `image`, `tallImage` and `video` are placeholder briefs, not filenames.
 * `image` is the wide slot (home, /services) and `tallImage` the slot on the
 * service's own page; where there's no usable photo yet, the brief is the shot
 * list. None of them are of Dr. Lee: he's the guide, and the service slots are
 * about the patient.
 *
 * Everything else is the clinic's own, from the live WordPress pages: `forYou`
 * is their condition lists written to the reader, `steps` is the "what does a
 * visit look like" sequence each page spells out, and `fees` is copied from
 * each page's cost FAQ. Nothing here that isn't there.
 */
export const services = [
  {
    slug: 'naturopathic',
    wpSlug: 'naturopathic',
    title: 'Naturopathic Medicine',
    short: 'naturopathic',
    summary:
      'Root-cause care built around your history, your body and your goals. We look for what is driving the symptom, not just the symptom.',
    lead: 'A full picture of your health, not a five-minute appointment.',
    outcome:
      'Find what is behind the tiredness, the gut trouble or the pain, and get a plan built around you.',
    image: 'Naturopathic visit — patient mid-conversation, listening',
    tallImage: 'Naturopathic visit — patient with his arm out, listening, at ease',
    video:
      'Dr. Lee on what happens in a first naturopathic appointment — 60–90 seconds',
    forYou: [
      "You're exhausted, and you've started to accept that as normal",
      "Your digestion is off, or certain foods don't agree with you",
      "You're dealing with allergies or skin issues",
      'Stress, anxiety, brain fog or poor sleep are getting in the way',
      "Chronic pain, headaches or an old injury hasn't settled",
      'You want the root cause found, not just the symptoms managed',
    ],
    steps: [
      {
        title: 'Fill in your intake form',
        body: 'Complete the online intake form a few days before your first visit, as thoroughly as you can, and email us any recent blood tests.',
      },
      {
        title: 'A 30-minute virtual assessment',
        body: 'Dr. Lee listens to your health concerns, fills in what the intake form left out, and starts building your treatment plan.',
      },
      {
        title: 'Your first in-person visit',
        body: 'At the clinic, Dr. Lee completes a physical exam and any further testing. If you need lab work, it goes through LifeLabs or another lab, and the cost is discussed with you.',
      },
    ],
    fees: [
      { label: 'Initial assessment — 30 minutes, virtual', price: '$150' },
      { label: 'Follow-up consultation — 30 minutes', price: '$110' },
    ],
    feesNote: 'Fees subject to change.',
  },
  {
    slug: 'acupuncture',
    wpSlug: 'acupuncture-3',
    title: 'Acupuncture',
    short: 'acupuncture',
    summary:
      'Traditional Chinese Medicine for pain, sleep, stress and recovery — including sports injuries and their prevention.',
    lead: 'Registered acupuncture, used on its own or alongside naturopathic care.',
    outcome:
      'Shift your body out of fight-or-flight and into the state where it rests, repairs and heals.',
    image: 'Acupuncture needles in place on a forearm, calm room — detail, no faces',
    tallImage: 'Patient resting on the treatment table, eyes closed — calm, unhurried',
    video: 'Dr. Lee on what acupuncture feels like and what it treats',
    forYou: [
      "You're living with chronic pain, a sports injury or headaches",
      'Stress, anxiety or low mood have you stuck in overdrive',
      "You can't sleep, or you're dealing with fatigue or hot flashes",
      'You have nausea, bloating or digestive pain',
      "You're dealing with allergies, weak immunity or inflammation",
    ],
    steps: [
      {
        title: 'Assessment',
        body: "A 30-minute virtual assessment. Dr. Lee takes a thorough medical history, answers your questions and creates a treatment plan for you — even if you've had acupuncture before, because safety comes first.",
      },
      {
        title: 'Treatments',
        body: "30 to 45 minutes in a comfortable private room, seated or lying down, and you're monitored throughout. Most people find it deeply relaxing. Wear loose clothing so sleeves and pant legs roll up.",
      },
      {
        title: 'Aftercare',
        body: "You'll get aftercare advice for you — rest, stretching, hydration. A series of 3 to 6 treatments is usual for the best results.",
      },
    ],
    fees: [
      { label: 'Initial assessment — 30 minutes, virtual', price: '$150' },
      { label: 'Acupuncture treatment', price: '$100' },
    ],
    feesNote: 'Fees subject to change.',
  },
  {
    slug: 'iv-therapy',
    wpSlug: 'i-v-therapy',
    title: 'I.V. Therapy',
    short: 'I.V. therapy',
    summary:
      'Targeted nutrients delivered directly, for energy, immune support and recovery when the digestive route is not enough.',
    lead: 'Nutrients that bypass the gut, for when absorption is the problem.',
    outcome:
      "Vitamins and minerals straight into the bloodstream, for when your gut can't absorb what your body needs to repair.",
    image:
      "I.V. bag and line, patient's hand resting on the chair arm — detail, no faces",
    tallImage:
      "Patient settled in the I.V. chair, line in, reading or resting — no clinician's face",
    video:
      'Dr. Lee walks through an I.V. session — what is involved and how long it takes',
    forYou: [
      "You're running on empty — chronic fatigue, exhaustion or insomnia",
      'Stress, anxiety, low mood or poor focus are wearing you down',
      'Your immune system feels weak — sinus trouble, seasonal allergies, one virus after another',
      'You get tension headaches, migraines or muscle spasms',
      "You're an athlete recovering from injury, competition or cramps",
      "Digestive issues mean you're not absorbing nutrients well",
    ],
    steps: [
      {
        title: 'A 30-minute consultation',
        body: 'Complete the intake form first. In a 30-minute virtual consultation, Dr. Lee checks that I.V. therapy is both safe and effective for you.',
      },
      {
        title: 'Your first I.V.',
        body: 'Treatments take 30 to 90 minutes, depending on your formula. Come well hydrated, in sleeves that roll up easily. Each preparation is made for you, in-house.',
      },
      {
        title: 'After your treatment',
        body: 'Most people leave feeling relaxed and rested. Book your follow-up with the staff — Dr. Lee designs the plan, whether that means a series or a seasonal top-up.',
      },
    ],
    fees: [
      { label: 'Initial assessment — 30 minutes, virtual', price: '$150' },
      { label: 'I.V. treatment — varies with the formula', price: '$115–$250' },
    ],
    feesNote: 'Fees subject to change.',
  },
] as const

export type Service = (typeof services)[number]

export function getService(slug: string) {
  return services.find((s) => s.slug === slug) ?? null
}
