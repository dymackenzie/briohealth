import { slots, type Photo, type PhotoSlot } from './photos'

/**
 * The service page bodies are the live WordPress pages (naturopathic 6066,
 * acupuncture-3 6040, i-v-therapy 6033), copied from their rendered HTML
 * with the Avada wrappers removed: headings, paragraphs, lists and emphasis
 * as the clinic wrote them, Dr. Lee's quote as a blockquote. They render
 * through renderContent, which sanitises. The repeated page title at the
 * top of each live page is left out (the page has an h1). The live "BOOK
 * NOW!" buttons are rendered by the page as the standard Book Appointment
 * button, so they are not in the HTML. Fees appear only inside the cost FAQ
 * answers (faqs.ts), as on the live pages.
 */

export interface ServiceVideo {
  /** MP4 loop, 8-15s, muted; null until the client supplies it. */
  loop: string | null
  /** Still for the loop; null falls back to `image.photo`. */
  poster: Photo | null
  /** The narrated video on YouTube; null hides "Watch the video". */
  youtube: string | null
}

const NO_VIDEO: ServiceVideo = { loop: null, poster: null, youtube: null }

const naturopathicBody = `
<p><strong>Do you wake up feeling refreshed and ready to start your day, or do you lack the energy to complete your daily tasks? Or even worse, are you totally exhausted trying to balance work and family responsibilities?</strong></p>
<p>You are not alone. According to a recent Canadian survey by Researchco.ca, 49% of people working full-time feel incredibly stressed and fatigued by the end of the day. They also reported other symptoms like eye strain, back pain and sleep issues.</p>
<p>The problem is we have accepted that being constantly tired and stressed-out is normal. It is not normal. Our culture values productivity and success, so we get caught up in this busy “go, go, go” lifestyle. Before you know it, you feel trapped in this daily grind and feeling tired and stressed becomes normal. To make matters worse, our culture teaches us to indulge in caffeine and junk food to help us feel better, making the situation even worse.</p>
<p>We need a shift in our health paradigm. When the principles of Naturopathic Medicine are followed, the body can restore balance and begin to thrive.</p>
<blockquote>
<p>“I was introduced to the Naturopathic principles of health during a time when I was suffering from digestive issues and feeling chronically tired. My Naturopath helped me identify the triggers causing my stomach pain and guided me in changing certain dietary habits. Once I took care of the “energy leaks” from my gut, I began experiencing more vitality. That year, I felt such an incredible shift in both my physical and mental health, I had to learn more about this medicine. This led me to pursue a career as a Naturopath.”</p>
<p class="cite">Dr. Lee</p>
</blockquote>
<h2>What is Naturopathic Medicine?</h2>
<p>Naturopathic Medicine is a form of primary health care that blends modern scientific knowledge with traditional and natural forms of medicine. The Naturopathic approach is to stimulate the healing power of the body (vital force) and address the underlying “root cause” of disease. Symptoms of disease are seen as warning signals of a body that is out of balance. Natural therapies are used to bring the body back into balance including:</p>
<ul>
<li>Herbal Medicine</li>
<li>Clinical Nutrition</li>
<li>Exercise Science</li>
<li>Naturopathic Manipulation</li>
<li>Homeopathy</li>
<li>Hydrotherapy</li>
<li>Acupuncture</li>
</ul>
<h2>What Conditions are Treated with Naturopathic Medicine?</h2>
<p>Over the past 18 years, Dr. Lee has worked with a variety of health concerns: from acute symptoms to chronic illness and from the physical to the psychological. By addressing the root cause of disease, and through the appropriate use of natural therapies, many of Dr. Lee’s patients have found tremendous benefits.</p>
<p>More recently, Dr. Lee has focused his practice on the following areas of health:</p>
<ol>
<li>Digestive &amp; Root Imbalances: Energy &amp; fatigue issues, digestive problems, allergies, skin issues, food sensitivities.</li>
<li>Brain &amp; Mental Health: Stress, anxiety, depression, brain fog, focus &amp; memory, sleep problems.</li>
<li>Pain &amp; Injuries: Chronic pain, headaches, arthritis, sports injuries, frozen shoulder.</li>
</ol>
<p>By following the principles of Naturopathic Medicine, your body will heal at the cellular level; activating system-wide processes to regulate, detoxify, nourish, repair and energize. Dr. Lee has worked with thousands of patients guiding them to heal from the inside out.</p>
`

const naturopathicClosing = `
<h2>Naturopathic Medicine at Brio Health</h2>
<p>Have you accepted that feeling constantly tired &amp; stressed-out is NORMAL? It is not normal.</p>
<p>Comparing our current level of health to other cultures and even past cultures; something is not right. We are not meant to be stuck in chronic pain, exhaustion and poor health.</p>
<p><strong>How Can Naturopathic Medicine Help Me?</strong></p>
<p>Naturopathic Medicine blends modern scientific knowledge with traditional and natural forms of medicine. The benefits of Naturopathic Medicine include:<br>
Identifying and treating the root cause of your ailments, rather than just masking the symptoms.<br>
Using safe effective natural therapies to stimulate long lasting healing.<br>
Treating the whole person by addressing imbalances in the physical, mental, emotional and spiritual areas of health.</p>
<p><strong>Why Choose Brio Health For Naturopathic Care?</strong></p>
<p>Dr. Lee is both experienced and knowledgeable with over 18 years of clinical experience. He cares about his patients and inspires them to make small changes that make a big impact on their health.</p>
<p><strong>What Conditions Are Treated With Naturopathic Medicine?</strong></p>
<p>Dr. Lee has focused his practice on the following areas of health:</p>
<ul>
<li><strong>Digestive &amp; Root Imbalances:</strong> Energy &amp; fatigue issues, digestive problems, allergies, skin issues, food sensitivities</li>
<li><strong>Nervous System &amp; Mental Health:</strong> Stress, anxiety, depression, brain fog, focus &amp; memory, sleep problems</li>
<li><strong>Pain &amp; Injuries:</strong> Chronic pain, headaches, arthritis, sports injuries, frozen shoulder</li>
</ul>
<p>Naturopathic Medicine is safe, effective and personalized medicine.</p>
<p>Give Brio Health a call today to book in your Naturopathic consultation.</p>
`

const acupunctureBody = `
<p><strong>Acupuncture can help shift our bodies out of this overdrive mode into a restorative and healing state.</strong> Our modern day lifestyle of high stress, demanding schedules and lack of quality rest keeps us stuck in constant “Fight or Flight” mode. This overdrive mode releases compounds, like cortisol and adrenaline, preventing our bodies from repairing.</p>
<blockquote>
<p>“There is incredible wisdom in Traditional Chinese Medicine. I personally follow its guiding principles to help energize, clean and repair my body everyday. I used to be overweight and chronically tired all the time, so I really understand what my patients are going through. It wasn’t until I began studying and understanding the interconnectedness of the body and treating the body as a whole system, rather than isolated parts, that I began addressing the root cause of my own issues. Deep rest and healing can only happen when our bodies are in balance. Acupuncture has helped me rebalance my own physical, mental and emotional health.”</p>
<p class="cite">Dr. Lee</p>
</blockquote>
<h2>What is Acupuncture?</h2>
<p>Acupuncture is part of Traditional Chinese Medicine, practiced and perfected over centuries. Fine needles are placed in strategic points throughout the body to balance the flow of energy or life force. This leads to improved mood, increased vitality and pain relief. Modern research supports the amazing benefits of acupuncture.</p>
<h2>What Conditions are Treated with Acupuncture?</h2>
<p>By increasing blood flow, relaxing muscle tension and releasing natural pain-reducing compounds, Acupuncture is a great solution for treating pain and a number of other health problems. Dr. Lee primarily uses acupuncture to treat the following conditions in his practice</p>
<ol>
<li>Pain &amp; Injuries: Chronic pain, Sport Injuries, Headaches.</li>
<li>Mental Emotional Issues: Stress, Anxiety, Depression.</li>
<li>Sleep Problems: Insomnia, Fatigue, Hot Flashes.</li>
<li>Digestive Issues: Nausea, Bloating, Digestive Pain.</li>
<li>Immune Related Issues: Allergies, Weak Immunity, Inflammation.</li>
</ol>
<h2>What Does an Acupuncture Treatment at Brio Health Look Like?</h2>
<p><strong>Step 1: Assessment</strong></p>
<ul>
<li>Medical history reviewed and physical examination performed</li>
<li>Questions are answered and a custom treatment plan created</li>
</ul>
<p><strong>Step 2: Treatments</strong></p>
<ul>
<li>Treatments are done in a comfortable private room while seated or lying down</li>
<li>Patients are monitored and assessed during the 45 min. treatment</li>
<li>Most patients find treatments incredibly relaxing.</li>
</ul>
<p><strong>Step 3: Aftercare</strong></p>
<ul>
<li>Aftercare recommendations are given on an individual basis (rest, stretch, hydration, etc.)</li>
<li>A series of treatments ranging from 3 to 6 treatments is scheduled for best results</li>
</ul>
<h2>Why Choose Brio Health for Acupuncture?</h2>
<p>Dr. Lee has been practicing Acupuncture for over 18 years and has helped thousands of patients relieve pain, improve sleep and reduce stress. Being one of the few double-licensed Naturopathic Physician &amp; Acupuncturists in BC, Dr. Lee integrates a variety of different methods to bring about relief. He particularly enjoys combining his research of functional neurology with the ancient wisdom of Traditional Chinese Medicine to bring lasting change in the body.</p>
<p>Acupuncture treatments are safe, effective and shift your nervous system back into a healing state.</p>
`

const acupunctureClosing = `
<h2>Acupuncture at Brio Health</h2>
<p>Deep rest and healing can only happen when your nervous system is in balance. Our modern lifestyle of high stress, demanding schedules and inadequate rest puts us at risk for constant exhaustion, chronic pain and mood problems.</p>
<p>Don’t let your symptoms compound into bigger problems.</p>
<p><strong>How Can Acupuncture Help Me?</strong></p>
<p>Acupuncture has been practiced for thousands of years. The benefits of acupuncture include:</p>
<ol>
<li>Reduction of stress &amp; mood issues by shifting your body from “Fight or Flight” to “Rest &amp; Digest.”</li>
<li>Heals pain &amp; injuries by releasing tension and improving blood flow.</li>
<li>Builds energy &amp; vitality by improving sleep and digestive function.</li>
</ol>
<p><strong>Why Choose Brio Health For Acupuncture?</strong></p>
<p>Dr. Lee is both experienced and knowledgeable with over 18 years of clinical experience. He cares about his patients and inspires them to make simple changes that make a big impact on their health.</p>
<p>Acupuncture treatments are safe, effective and shifts your body back into a healing state.</p>
<p>Give Brio Health a call today to book in your Acupuncture visit.</p>
`

const ivBody = `
<p><strong>Millions of people wake up every morning feeling tired, depressed, and in constant pain.</strong> To make matters worse, chronic stress and daily exposure to processed foods trigger inflammation in our bodies. Inflammation is the root cause of so many health problems; it confuses the immune system and robs us of our energy. Research shows that when inflammation is out of control, we not only suffer physical ailments, our brain and mental health suffer as well.</p>
<p>Having adequate vitamins and minerals is essential for your body to heal. Intravenous (I.V.) Nutrient Therapy delivers key building blocks to repair your body and protects against the negative effects of inflammation.</p>
<h2>How Does Intravenous (I.V) Therapy Heal My Body?</h2>
<p>When our body is sick, under stress or suffering from digestive issues, it cannot absorb nutrients efficiently through our gut. This becomes a problem because in order for the body to heal, it need needs these nutrients to repair at the cellular level.</p>
<p>Intravenous (I.V.) Therapy is the delivery of nutrients (vitamins, minerals, amino acids) directly into the bloodstream through a small needle. The bloodstream delivers the nutrients to the needed cells and organ systems in the body. Once the cell has the appropriate nutrients, it will create energy and function as a healthy cell again.</p>
<h2>What is the Difference Between I.V. Therapy and Taking Oral Vitamins and Minerals?</h2>
<p>Under normal conditions, oral supplementation of vitamins and minerals will meet the needs of the general population. However, many of our patients have digestive issues that prevent the proper absorption of nutrients into the body. I.V. Therapy can effectively replenish the body’s nutrients.</p>
<p>I.V. Therapy delivers nutrients directly into the bloodstream and can achieve blood concentrations of vitamins and minerals far higher than any oral supplements.</p>
<h2>What Conditions Are Treated with I.V. Therapy?</h2>
<p>The following conditions can be treated effectively with I.V. Therapy:</p>
<ol>
<li>Low Energy: Chronic fatigue, exhaustion, insomnia.</li>
<li>Stress &amp; Mood Issues: Anxiety &amp; depression, high stress, focus problems.</li>
<li>Weakened Immune System: Upper respiratory tract infections, chronic sinusitis, seasonal allergies, viral infections.</li>
<li>Headaches &amp; Inflammation: Tension headaches, migraines, acute muscle spasm.</li>
<li>Athletic Performance &amp; Recovery: Sports injuries, recovery after competition, excessive sweating, muscle cramps.</li>
</ol>
<h2>Why Choose Brio Health for I.V. Therapy?</h2>
<p>Dr. Lee has helped hundreds of patients with this safe and effective therapy. He actively researches and attends training to keep up to date in the field of I.V. Therapy. Each I.V. preparation is customized to the patient and is carefully prepared in-house.</p>
<p>To book your first appointment for I.V. Therapy, please follow these steps:</p>
<p><strong>Step 1:</strong> Book a 30-minute consultation. Complete the intake form before the treatment. During the consultation, Dr. Lee will assess that I.V. therapy is both safe and effective for you.</p>
<p><strong>Step 2</strong>: Book your first I.V. Therapy visit. Treatments can range between 30 minutes to 90 minutes. Come to the visit well-hydrated and wearing sleeves that can easily roll-up to access your veins.</p>
<p><strong>Step 3:</strong> After the treatment, most patients feel relaxed and rested. Schedule your follow up I.V. Treatment with the staff.</p>
<p>Remember that stress &amp; lack of nutrients from our modern day lifestyle prevents the body from repairing, defending and building energy. By nourishing your body from the inside out with I.V. Therapy, we target the root problem and ignite your body’s healing potential. As a result, your vitality increases, so you can focus on what you love to do.</p>
`

/**
 * Three services, the ones the clinic advertises. Everything here is the
 * clinic's own copy from the live WordPress pages: `helpsWith` is their
 * condition lists, `steps` the "what a visit looks like" sequence each page
 * spells out, `fees` from each page's cost FAQ. Nothing that is not there.
 *
 * Shaped like the `service` SCF field group so it becomes the fallback.
 *
 * The `fees` rows are read by the homepage's first visit, /services, the
 * service page and /book, never by position. The cost FAQ answers in
 * faqs.ts carry the live pages' fee text verbatim, separately.
 */

export type ServiceSlug = 'naturopathic' | 'acupuncture' | 'iv-therapy'

/**
 * What a fee row is, so callers find a fee by meaning rather than by its
 * position in the list (the client can reorder the repeater).
 */
export type FeeKind = 'initial' | 'follow-up' | 'treatment'

export interface Fee {
  kind: FeeKind
  label: string
  note?: string
  amount: string
}

export interface Step {
  title: string
  body: string
}

export interface ServiceContent {
  slug: ServiceSlug
  title: string
  /** Lower-case, for running text: "more about acupuncture". */
  short: string
  summary: string
  /** One line, for the /services rows and the homepage rows. */
  whoFor: string
  lead: string
  helpsWith: string[]
  steps: Step[]
  /** Exactly one row has `kind: 'initial'`. */
  fees: Fee[]
  feesNote: string
  /** True until the client confirms the numbers. */
  feesPending: boolean
  image: PhotoSlot
  /** The live page, verbatim, as HTML for renderContent. */
  body: string
  /** The live page's closing "X at Brio Health" block; empty when it has none. */
  closing: string
  video: ServiceVideo
}

export const services: ServiceContent[] = [
  {
    slug: 'naturopathic',
    title: 'Naturopathic Medicine',
    short: 'naturopathic medicine',
    summary:
      'Root-cause care built around your history, your body and your goals. We look for what is driving the symptom, not just the symptom.',
    whoFor: "For when you're tired all the time, your digestion is off, and you want to know why.",
    lead: 'A full picture of your health, not a five-minute appointment.',
    helpsWith: [
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
      // Stated on the live naturopathic page.
      { kind: 'initial', label: 'Initial assessment', note: '30 minutes, virtual', amount: '$150' },
      // Unconfirmed.
      { kind: 'follow-up', label: 'Follow-up consultation', note: '30 minutes', amount: '$110' },
    ],
    feesNote: 'Fees subject to change.',
    feesPending: true,
    image: slots.services.naturopathic,
    body: naturopathicBody,
    closing: naturopathicClosing,
    video: NO_VIDEO,
  },
  {
    slug: 'acupuncture',
    title: 'Acupuncture',
    short: 'acupuncture',
    summary:
      'Traditional Chinese Medicine for pain, sleep, stress and recovery, including sports injuries.',
    whoFor: 'For when pain, stress or poor sleep is wearing you down.',
    lead: 'Registered acupuncture, on its own or alongside naturopathic care.',
    helpsWith: [
      "You're living with chronic pain, a sports injury or headaches",
      'Stress, anxiety or low mood have you stuck in overdrive',
      "You can't sleep, or you're dealing with fatigue or hot flashes",
      'You have nausea, bloating or digestive pain',
      "You're dealing with allergies, weak immunity or inflammation",
    ],
    steps: [
      {
        title: 'Assessment',
        body: "A 30-minute virtual assessment. Dr. Lee takes a thorough medical history, answers your questions and creates a treatment plan for you, even if you've had acupuncture before, because safety comes first.",
      },
      {
        title: 'Treatments',
        body: "30 to 45 minutes in a comfortable private room, seated or lying down, and you're monitored throughout. Most people find it deeply relaxing. Wear loose clothing so sleeves and pant legs roll up.",
      },
      {
        title: 'Aftercare',
        body: "You'll get aftercare advice for you: rest, stretching, hydration. A series of 3 to 6 treatments is usual for the best results.",
      },
    ],
    fees: [
      { kind: 'initial', label: 'Initial assessment', note: '30 minutes, virtual', amount: '$150' },
      { kind: 'treatment', label: 'Acupuncture treatment', amount: '$100' },
    ],
    feesNote: 'Fees subject to change.',
    feesPending: true,
    image: slots.services.acupuncture,
    body: acupunctureBody,
    closing: acupunctureClosing,
    video: NO_VIDEO,
  },
  {
    slug: 'iv-therapy',
    title: 'I.V. Therapy',
    short: 'I.V. therapy',
    summary:
      'Targeted nutrients delivered directly, for energy, immune support and recovery when the digestive route is not enough.',
    whoFor: 'For when your energy is low, you keep getting sick, or you need to recover from hard training.',
    lead: 'Nutrients that bypass the gut, for when absorption is the problem.',
    helpsWith: [
      "You're running on empty: chronic fatigue, exhaustion or insomnia",
      'Stress, anxiety, low mood or poor focus are wearing you down',
      'Your immune system feels weak: sinus trouble, seasonal allergies, one virus after another',
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
        body: 'Most people leave feeling relaxed and rested. Book your follow-up with the staff. Dr. Lee designs the plan, whether that means a series or a seasonal top-up.',
      },
    ],
    fees: [
      { kind: 'initial', label: 'Initial assessment', note: '30 minutes, virtual', amount: '$150' },
      { kind: 'treatment', label: 'I.V. treatment', note: 'Varies with the formula', amount: '$115-$250' },
    ],
    feesNote: 'Fees subject to change.',
    feesPending: true,
    image: slots.services['iv-therapy'],
    body: ivBody,
    closing: '',
    video: NO_VIDEO,
  },
]

export function getService(slug: string): ServiceContent | null {
  return services.find((s) => s.slug === slug) ?? null
}

/** A service's initial assessment, wherever it sits in the fee list. */
export function initialAssessmentFee(slug: ServiceSlug): Fee | null {
  return getService(slug)?.fees.find((f) => f.kind === 'initial') ?? null
}
