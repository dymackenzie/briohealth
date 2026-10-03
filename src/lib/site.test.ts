import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  BOOKING_PATH,
  addressLine,
  formatDays,
  formatPhoneDashed,
  formatTime,
  mapEmbedUrl,
  mapSearchUrl,
  nav,
  site,
} from './site'

describe('absoluteUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('never doubles the slash when the site url ends in one', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com/')
    vi.resetModules()
    const { absoluteUrl } = await import('./site')
    expect(absoluteUrl('/blog/a-post')).toBe('https://example.com/blog/a-post')
  })

  it('joins a site url with no trailing slash', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com')
    vi.resetModules()
    const { absoluteUrl } = await import('./site')
    expect(absoluteUrl('/blog/a-post')).toBe('https://example.com/blog/a-post')
  })
})

describe('formatTime', () => {
  it('drops the minutes on the hour', () => {
    expect(formatTime('10:00')).toBe('10am')
    expect(formatTime('18:00')).toBe('6pm')
  })

  it('keeps the minutes otherwise', () => {
    expect(formatTime('18:30')).toBe('6:30pm')
  })

  it('reads noon and midnight as 12', () => {
    expect(formatTime('12:00')).toBe('12pm')
    expect(formatTime('00:00')).toBe('12am')
  })
})

describe('formatDays', () => {
  it('joins the last day with "and"', () => {
    expect(formatDays(['Monday', 'Tuesday', 'Thursday'])).toBe('Monday, Tuesday and Thursday')
    expect(formatDays(['Monday', 'Tuesday'])).toBe('Monday and Tuesday')
  })

  it('returns a single day as is', () => {
    expect(formatDays(['Monday'])).toBe('Monday')
  })
})

describe('addressLine', () => {
  it('writes the address on one line', () => {
    expect(addressLine(site)).toBe('2168-3779 Sexsmith Road, Richmond, BC V6X 3Z9')
  })
})

describe('booking', () => {
  it('uses the wireframe label and points every button at the New Patient page', () => {
    expect(site.ctaLabel).toBe('Book Appointment')
    expect(BOOKING_PATH).toBe('/new-patient')
    expect(site.bookingUrl).toBe('https://yourbriohealth.janeapp.com')
    expect(site.foundedYear).toBe(2006)
  })
})

describe('nav', () => {
  it('is New Patient, Services with four children, Blog', () => {
    expect(nav.map((i) => i.label)).toEqual(['New Patient', 'Services', 'Blog'])
    expect(nav[0].href).toBe('/new-patient')
    expect(nav[1].href).toBe('/services')
    expect(nav[1].children?.map((c) => [c.label, c.href])).toEqual([
      ['Naturopathic Medicine', '/services/naturopathic'],
      ['Acupuncture', '/services/acupuncture'],
      ['I.V. Therapy', '/services/iv-therapy'],
      ['About Dr. Lee', '/about'],
    ])
    expect(nav[2].href).toBe('/blog')
  })
})

describe('formatPhoneDashed', () => {
  it('writes a ten-digit North American number the way the wireframe does', () => {
    expect(formatPhoneDashed('(604) 271-9355')).toBe('604-271-9355')
    expect(formatPhoneDashed('604.271.9355')).toBe('604-271-9355')
    expect(formatPhoneDashed('+1 604 271 9355')).toBe('604-271-9355')
    expect(formatPhoneDashed(site.phone)).toBe('604-271-9355')
  })

  it('leaves anything that is not ten digits as typed', () => {
    expect(formatPhoneDashed('+44 20 7946 0958')).toBe('+44 20 7946 0958')
    expect(formatPhoneDashed('')).toBe('')
  })
})

describe('map links', () => {
  it('embeds Google Maps without an API key, by address', () => {
    expect(mapEmbedUrl(site)).toBe(
      'https://www.google.com/maps?q=2168-3779%20Sexsmith%20Road%2C%20Richmond%2C%20BC%20V6X%203Z9&output=embed',
    )
  })

  it('opens the same address in Google Maps', () => {
    expect(mapSearchUrl(site)).toBe(
      'https://www.google.com/maps/search/?api=1&query=2168-3779%20Sexsmith%20Road%2C%20Richmond%2C%20BC%20V6X%203Z9',
    )
  })
})
