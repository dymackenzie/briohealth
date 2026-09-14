/**
 * NAP is repeated in the footer, the contact page and the JSON-LD, and local
 * SEO punishes inconsistency, so it lives here once. Moves to the SCF options
 * page later; these stay as the fallback.
 */

export const site = {
  name: 'Brio Health',
  legalName: 'Brio Health Inc.',
  tagline: 'Integrative health in Richmond, BC',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourbriohealth.com',

  phone: '(604) 271-9355',
  phoneHref: 'tel:+16042719355',
  email: 'info@yourbriohealth.com',

  address: {
    street: '2168 – 3779 Sexsmith Road',
    locality: 'Richmond',
    region: 'BC',
    postal: 'V6X 3Z9',
    country: 'CA',
  },

  /**
   * Confirmed by the client on the phone, 2026-09-04. Closed Wednesday,
   * Friday and Sunday — unlisted days read as closed, which is the convention
   * Google follows too.
   *
   * Saturday is deliberately not in here. It's remote-only and every other
   * week: schema.org can't say "alternating", and listing it would tell Google
   * the clinic is physically open when nobody is there. It goes on the page as
   * a note, and stays off the Google Business listing.
   */
  hours: [
    { days: ['Monday', 'Tuesday', 'Thursday'], opens: '10:00', closes: '18:00' },
  ],
  hoursNote: 'Remote appointments every other Saturday — ask when you book.',

  /** Jane. Never embed it — their own flow converts better. */
  bookingUrl: 'https://yourbriohealth.janeapp.com',

  /** Where the "20 years" stat comes from. */
  foundedYear: 2006,

  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/briohealth/' },
    { label: 'Facebook', href: 'https://www.facebook.com/briohealth/' },
    { label: 'X', href: 'https://x.com/briohealth' },
  ],
} as const

export const addressLine = `${site.address.street}, ${site.address.locality}, ${site.address.region}`

/** The "20 years" claim. Derived once — it was being recomputed in two files. */
export const yearsPractising = new Date().getFullYear() - site.foundedYear

/** Good enough to catch a typo; the confirmation email does the real check. */
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** Canonical absolute URL. Sitemap, OG tags and the RSS guid must all agree. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString()
}

/** '10:00' -> '10am'. Trailing :00 is noise on a sign that says 10 to 6. */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number)
  const suffix = h < 12 ? 'am' : 'pm'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`
}

/** ['Monday','Tuesday','Thursday'] -> 'Monday, Tuesday & Thursday' */
export function formatDays(days: readonly string[]): string {
  if (days.length < 2) return days.join('')
  return `${days.slice(0, -1).join(', ')} & ${days[days.length - 1]}`
}

export interface NavLink {
  label: string
  href: string
  children?: NavLink[]
}

/**
 * Defined here rather than in the CMS — it's structural and barely changes.
 *
 * Trimmed to what the clinic actually offers. The proposed nav had 5 services,
 * 4 programs and 3 bios; the live install has 3 service pages, no program
 * pages, and the other "bios" are old blog posts about people who've left.
 * Waiting on the client before adding any of it back — see docs/client-inputs.md.
 */
export const primaryNav: NavLink[] = [
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Naturopathic Medicine', href: '/services/naturopathic' },
      { label: 'Acupuncture', href: '/services/acupuncture' },
      { label: 'I.V. Therapy', href: '/services/iv-therapy' },
      { label: 'All Services', href: '/services' },
    ],
  },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'About Dr. Jeffrey Lee', href: '/about' },
      { label: 'Pickleball & Community', href: '/pickleball' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export const footerLegal: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
]
