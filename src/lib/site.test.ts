import { afterEach, describe, expect, it, vi } from 'vitest'
import { addressLine, formatDays, formatTime, site } from './site'

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
