/**
 * Site settings. NAP is repeated in the footer, the contact page, the close
 * and the JSON-LD, and local SEO punishes inconsistency, so it lives here
 * once. This object is the fallback for /wp-json/brio/v1/settings; the
 * shape mirrors that endpoint field for field.
 */

export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export interface HoursRow {
  days: Day[]
  /** 24h 'HH:MM' */
  opens: string
  closes: string
}

export interface SiteSettings {
  name: string
  legalName: string
  tagline: string
  url: string
  phone: string
  phoneHref: string
  email: string
  address: {
    street: string
    locality: string
    region: string
    postal: string
    country: string
  }
  /** Physical hours only. */
  hours: HoursRow[]
  /** Shown on the page, never in JSON-LD: nobody is physically there. */
  saturdayNote: string
  bookingUrl: string
  /** The one booking label, everywhere. */
  ctaLabel: string
  social: { label: string; href: string }[]
  announcement: { text: string; href: string | null } | null
  ogImage: { url: string; width: number; height: number; alt: string }
  foundedYear: number
}

export const site: SiteSettings = {
  name: 'Brio Health',
  legalName: 'Brio Health Inc.',
  tagline: 'Naturopathic medicine, acupuncture and I.V. therapy in Richmond, BC',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourbriohealth.com',

  phone: '(604) 271-9355',
  phoneHref: 'tel:+16042719355',
  email: 'info@yourbriohealth.com',

  address: {
    street: '2168-3779 Sexsmith Road',
    locality: 'Richmond',
    region: 'BC',
    postal: 'V6X 3Z9',
    country: 'CA',
  },

  /**
   * Confirmed by the client on the phone, 2026-09-04. Closed Wednesday,
   * Friday and Sunday; unlisted days read as closed, which is the convention
   * Google follows too.
   */
  hours: [{ days: ['Monday', 'Tuesday', 'Thursday'], opens: '10:00', closes: '18:00' }],
  saturdayNote: 'Remote appointments every other Saturday. Ask when you book.',

  /** The one label, everywhere (wireframe). Buttons link to BOOKING_PATH; this URL is for the Get Started form. */
  bookingUrl: 'https://yourbriohealth.janeapp.com',
  ctaLabel: 'Book Appointment',

  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/briohealth/' },
    { label: 'Facebook', href: 'https://www.facebook.com/briohealth/' },
    { label: 'X', href: 'https://x.com/briohealth' },
  ],

  announcement: null,

  ogImage: { url: '/brio_social_2.png', width: 1081, height: 1081, alt: 'Brio Health' },

  foundedYear: 2006,
}

/**
 * Where every "Book Appointment" button goes: the New Patient page, which
 * screens the way the live site does before handing over to Jane.
 */
export const BOOKING_PATH = '/new-patient'

/**
 * The one default meta description. The root layout and the homepage both
 * read it, and `buildMetadata` falls back to it, so it is written once.
 */
export const defaultDescription = `Naturopathic medicine, acupuncture and I.V. therapy in Richmond, BC, with Dr. Jeffrey Lee, N.D., R.Ac. Root-cause care since ${site.foundedYear}.`

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

/** Structural, changes rarely, so it lives in code rather than the CMS. */
export const nav: NavItem[] = [
  { label: 'New Patient', href: BOOKING_PATH },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Naturopathic Medicine', href: '/services/naturopathic' },
      { label: 'Acupuncture', href: '/services/acupuncture' },
      { label: 'I.V. Therapy', href: '/services/iv-therapy' },
      { label: 'About Dr. Lee', href: '/about' },
    ],
  },
  { label: 'Blog', href: '/blog' },
]

/**
 * The nav link's `aria-current`: "page" only for the link to the page
 * itself; "true" for a parent whose section or one of whose children is
 * open (About sits under Services without sharing its path).
 */
export function currentState(href: string, pathname: string, children?: NavItem[]): 'page' | 'true' | undefined {
  if (pathname === href) return 'page'
  if (children?.some((child) => child.href === pathname)) return 'true'
  if (href !== '/' && pathname.startsWith(`${href}/`)) return 'true'
  return undefined
}

export const footerLegal: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
]

/** Good enough to catch a typo; the confirmation email does the real check. */
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/**
 * Canonical absolute URL. Sitemap, OG tags and the RSS guid must all agree,
 * so every absolute URL is built here rather than by concatenating
 * `site.url`: URL resolution cannot produce a `//` from a trailing slash.
 */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString()
}

/** '10:00' -> '10am', '18:30' -> '6:30pm'. */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number)
  const suffix = h < 12 ? 'am' : 'pm'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`
}

/** ['Monday','Tuesday','Thursday'] -> 'Monday, Tuesday and Thursday'. */
export function formatDays(days: readonly string[]): string {
  if (days.length < 2) return days.join('')
  return `${days.slice(0, -1).join(', ')} and ${days[days.length - 1]}`
}

export function addressLine(settings: SiteSettings): string {
  const { street, locality, region, postal } = settings.address
  return `${street}, ${locality}, ${region} ${postal}`
}

/**
 * '(604) 271-9355' -> '604-271-9355', the wireframe's top-bar format. A
 * leading country code 1 is dropped; anything that is not ten digits after
 * that is returned as typed rather than mangled.
 */
export function formatPhoneDashed(phone: string): string {
  const digits = phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')
  if (digits.length !== 10) return phone
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
}

/** The footer map: a plain Google Maps embed by address, no API key. */
export function mapEmbedUrl(settings: SiteSettings): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(addressLine(settings))}&output=embed`
}

/** "Open in Google Maps" under the embed; also the fallback when the iframe is blocked. */
export function mapSearchUrl(settings: SiteSettings): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine(settings))}`
}
