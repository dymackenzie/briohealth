import { WP_UPLOADS_URL } from '@/lib/wp/client'
import { slots } from './photos'

/** Heading and lead per page template, shaped like their SCF groups. */
export const pages = {
  // The live About page (about-2, 5907): the first, longer block verbatim.
  // Title and lead are its h2/h3; the body is the pull quote and the five
  // paragraphs. The photo is the clinic's own (slots.about).
  about: {
    title: 'Dr. Jeffrey Lee, N.D., R.Ac.',
    lead: 'Naturopathic Physician & Registered Acupuncturist',
    body: `
<blockquote><p>“ I help patients like you make sense of all the confusing health information out there and to create a personalized, actionable plan to optimize your health.”</p></blockquote>
<p>Hello, my name is Dr. Jeffrey Lee. I have been serving the community of Richmond as a Naturopathic Doctor and Registered Acupuncturist since 2006. I value collaboration, a growth mindset, generosity and laughter.</p>
<p>My personal mission is to encourage and empower people to take charge of their own health, so that they can regain their natural vitality. I help patients like you make sense of all the confusing health information out there and to create a personalized, actionable plan to optimize your health. My patients experience pain relief, improved sleep, healthier skin, strong digestive systems, mental clarity and abundant energy!</p>
<p>My personal health journey started when I struggled with digestive and immune-related issues as a child. Some medications, such as antibiotics, would only temporarily alleviate my symptoms, and often left me feeling worse. Due to my digestion issues and my poor health habits, I began putting on excess weight. By the time I reached my late teens, I was about 50 pounds overweight, with constant fatigue and continued irritable bowel symptoms. In search of a solution to my health problems, I discovered Naturopathic Medicine and Traditional Chinese Medicine. With the guidance that I received from amazing Naturopathic Doctors, I completely transformed my health, and my life. Not only did I lose over 50 lbs, my energy and mental focus improved significantly and my vitality returned. That experience confirmed my desire to study Natural Medicine and has led me to where I am today.</p>
<p>Outside of the clinic, I play pickleball several days a week (Yes, I am obsessed)! I also enjoy all that British Columbia has to offer. During the winter months, I like to ski at Whistler or the interior mountains with friends and family. In the summer months, I play in pickleball tournaments, go camping and explore all around BC. I am blessed to be part of a great local community church, where I am supported through friendship and prayer. Integrating spiritual disciplines like prayer and meditation is how I stay grounded and focused in helping others.</p>
<p>Dr. Jeffrey Lee is a board certified and licensed Naturopathic Physician and Registered Acupuncturist. He earned his degrees in Naturopathic Medicine and Acupuncture at Bastyr University in Seattle, WA after completing a Science degree at the University of British Columbia.</p>
`,
    photos: slots.about,
  },
  // The live Book Now page (5913), verbatim. The three statements are the
  // screening the live form does before it hands over to Jane.
  newPatient: {
    title: 'Welcome to Brio Health',
    videoUrl: `${WP_UPLOADS_URL}/2026/10/new-patient-welcome.mp4`,
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
  // The live Contact page (contact-us, 11952).
  contact: {
    title: 'Contact Us',
    lead: 'Call or email us if you have any questions',
    bookLine: 'If you want to book an appointment use the link below.',
  },
  // The live Pickleball page (23155), verbatim and in order. Its text is
  // split into the parts the page lays out: the questions, the intro, the
  // three coaching steps, and the two coaching services with their prices.
  pickleball: {
    title: 'Pickleball',
    questions: [
      'Are you ready to unlock your hidden potential on the pickleball court?',
      'Are you ready to win more games and have more fun?',
    ],
    intro:
      'Brio Pickleball Coaching offers private & small group lessons. We work with beginners & advanced players. We specialize in developing solid fundamentals so players improve faster and have more fun.',
    stepsHeading: 'Our Coaching methodology follows these 3 steps',
    steps: [
      {
        title: 'Better Movement',
        points: ['Better paddle technique improves your consistency.', 'Better footwork helps you be in the right position to win more points.'],
      },
      {
        title: 'Better Decision making',
        points: ['Learn different strategies to quickly adapt against different opponents', 'Develop a higher pickleball IQ to win more games'],
      },
      {
        title: 'Better Recovery',
        points: [
          'Learn the right technique to keep your body more efficient & injury free',
          'Learn how to prevent injuries so you can play for years to come.',
        ],
      },
    ],
    videoUrl: `${WP_UPLOADS_URL}/2025/11/BRIOP.mp4`,
    /** The film at 0:00.5: its title card, the Brio Pickleball Coaching logo. */
    videoPoster: '/photos/pickleball-film-still.jpg',
    photos: [
      {
        slot: slots.pickleball.benJohns,
        caption: 'Dr. Jeff with Ben Johns, No. 1 in the world for mixed doubles, No. 2 for Singles, and No. 1 for Men’s Doubles by the Pro Pickleball Association. (PPA)',
      },
      {
        slot: slots.pickleball.jordanBriones,
        caption: 'Dr. Jeff with Jordan Briones of Briones Pickleball Academy. Arizona’s Training Hub for Elite Pickleball Coaching & Competition',
      },
    ],
    servicesHeading: 'Pickleball Coaching Services',
    servicesIntro:
      'Dr. Jeff’s team of coaches are Pickleball Canada certified instructors. They bring a wealth of experience from other health disciplines combined with their years of coaching pickleball.',
    offeringsHeading: 'Coaching Services offered:',
    offerings: [
      {
        name: 'Private Coaching Sessions',
        price: '$110+GST/hour',
        detail:
          '1 to 2 players. One-on-one coaching includes a full assessment and tailored instructions to improve your paddle skills, movement patterns, and improved mindset.',
      },
      {
        name: 'Group Coaching Sessions',
        price: '$ 160+GST/hour',
        detail: '3-4 players. Team coaching includes skill development, key movement patterns with your partner and winning doubles strategy.',
      },
    ],
    court: slots.pickleball.court,
    quotesHeading: 'What they are saying:',
    quotes: [
      {
        quote:
          'My Husband and I took 4 lessons from Dr. Jeff. I had no experience playing any racket sports and in 4 lessons my husband and I had the basics to play a full game. Dr. Jeff is a great teacher! He broke down the game so it was easy to learn and he kept it really fun. If you are new to the sport, you must learn from Dr. Jeff.',
        name: 'Sharin & Steven',
      },
      {
        quote:
          'I came to see Dr. Jeff because of a severe tennis elbow. I could not even hold my pickleball paddle. Dr. Jeff gave me several rounds of acupuncture and low level laser therapy to calm the inflammation. He also coached me on how to better grip my paddle and improve my swing. I am now pain free thanks to the doc and playing pickleball 3 times a week.',
        name: 'David C.',
      },
    ],
    formHeading: 'Schedule a lesson',
  },
  blog: {
    title: 'Blog',
    empty: 'Nothing here yet. Check back soon.',
  },
  notFound: {
    title: "We can't find that page",
    body: 'It may have moved when we rebuilt the site. The services, the blog archive and booking are all still here.',
  },
} as const
