import { describe, expect, it } from 'vitest'
import { withFallback } from './merge'

const fallback = {
  heading: 'Feel like yourself again.',
  sentence: 'Fallback sentence.',
  items: ['a', 'b'],
  count: 3,
  flag: false,
  nested: { label: 'Open in Google Maps', href: '/#map' },
}

describe('withFallback', () => {
  it('returns the fallback when WordPress gives nothing', () => {
    expect(withFallback(null, fallback)).toEqual(fallback)
    expect(withFallback(undefined, fallback)).toEqual(fallback)
  })

  it('uses a WordPress value when it is present', () => {
    expect(withFallback({ heading: 'From WP' }, fallback).heading).toBe('From WP')
  })

  it('falls back on empty strings and whitespace', () => {
    expect(withFallback({ heading: '' }, fallback).heading).toBe(fallback.heading)
    expect(withFallback({ heading: '   ' }, fallback).heading).toBe(fallback.heading)
  })

  it('falls back on null and undefined fields', () => {
    expect(withFallback({ heading: null as unknown as string }, fallback).heading).toBe(fallback.heading)
    expect(withFallback({ heading: undefined }, fallback).heading).toBe(fallback.heading)
  })

  it('falls back on an empty array but keeps a filled one', () => {
    expect(withFallback({ items: [] }, fallback).items).toEqual(['a', 'b'])
    expect(withFallback({ items: ['x'] }, fallback).items).toEqual(['x'])
  })

  it('keeps zero and false, which are real values', () => {
    expect(withFallback({ count: 0 }, fallback).count).toBe(0)
    expect(withFallback({ flag: false }, fallback).flag).toBe(false)
  })

  it('merges nested objects one level down', () => {
    const merged = withFallback({ nested: { label: 'See the map', href: '' } }, fallback)
    expect(merged.nested).toEqual({ label: 'See the map', href: '/#map' })
  })

  it('does not mutate the fallback', () => {
    const copy = structuredClone(fallback)
    withFallback({ heading: 'x', items: ['y'] }, fallback)
    expect(fallback).toEqual(copy)
  })
})
