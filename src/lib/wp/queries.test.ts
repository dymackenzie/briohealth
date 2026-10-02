import { describe, expect, it } from 'vitest'
import { mergeSettings, parsePage } from './queries'
import type { WPSettings } from './types'
import { site } from '@/lib/site'

describe('parsePage', () => {
  it('defaults to page one', () => {
    expect(parsePage(undefined)).toBe(1)
    expect(parsePage('')).toBe(1)
  })

  it('parses a positive integer', () => {
    expect(parsePage('3')).toBe(3)
    expect(parsePage('12')).toBe(12)
  })

  it('clamps nonsense to page one', () => {
    expect(parsePage('abc')).toBe(1)
    expect(parsePage('0')).toBe(1)
    expect(parsePage('-3')).toBe(1)
    expect(parsePage('1.5')).toBe(1)
    expect(parsePage('1e3')).toBe(1)
  })

  it('takes the first value when the param repeats', () => {
    expect(parsePage(['4', '9'])).toBe(4)
  })
})

describe('mergeSettings', () => {
  it('returns the fallback when the endpoint is missing', () => {
    expect(mergeSettings(null, site)).toEqual(site)
  })

  it('takes strings from WordPress and keeps the fallback for blanks', () => {
    const merged = mergeSettings({ phone: '(604) 000-0000', email: '', ctaLabel: '  ' }, site)
    expect(merged.phone).toBe('(604) 000-0000')
    expect(merged.email).toBe(site.email)
    expect(merged.ctaLabel).toBe(site.ctaLabel)
  })

  it('derives phoneHref from a WordPress phone', () => {
    expect(mergeSettings({ phone: '(604) 555-1234' }, site).phoneHref).toBe('tel:+16045551234')
  })

  it('keeps only open rows with real days and both times', () => {
    const merged = mergeSettings(
      {
        hours: [
          { days: ['Monday', 'Wednesday'], opens: '09:00', closes: '17:00', closed: false },
          { days: ['Friday'], opens: null, closes: null, closed: true },
          { days: [], opens: '09:00', closes: '17:00', closed: false },
          { days: ['Saturday'], opens: '10:00', closes: null, closed: false },
        ],
      },
      site,
    )
    expect(merged.hours).toEqual([{ days: ['Monday', 'Wednesday'], opens: '09:00', closes: '17:00' }])
  })

  it('falls back to the code hours when WordPress has none', () => {
    expect(mergeSettings({ hours: [] }, site).hours).toEqual(site.hours)
  })

  it('passes the announcement through and clears it when null', () => {
    expect(mergeSettings({ announcement: { text: 'Closed Monday', href: null } }, site).announcement).toEqual({
      text: 'Closed Monday',
      href: null,
    })
    expect(mergeSettings({ announcement: null }, site).announcement).toBeNull()
  })

  it('merges the address one field at a time', () => {
    const merged = mergeSettings({ address: { postal: 'V6X 0A1', street: '' } }, site)
    expect(merged.address.postal).toBe('V6X 0A1')
    expect(merged.address.street).toBe(site.address.street)
  })

  it('treats the false SCF returns for an empty field as empty, never as a value', () => {
    const allFalse: WPSettings = {
      phone: false,
      email: false,
      address: false,
      mapUrl: false,
      bookingUrl: false,
      ctaLabel: false,
      hours: false,
      saturdayNote: false,
      social: false,
      announcement: false,
      ogImage: false,
    }
    expect(mergeSettings(allFalse, site)).toEqual(site)

    const partlyFalse = mergeSettings(
      {
        address: { street: false, postal: 'V6X 0A1' },
        hours: [{ days: false, opens: false, closes: false, closed: false }],
      },
      site,
    )
    expect(partlyFalse.address).toEqual({ ...site.address, postal: 'V6X 0A1' })
    expect(partlyFalse.hours).toEqual(site.hours)
  })
})
