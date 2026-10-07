import { describe, expect, it } from 'vitest'

import { captionsPath, captionsSource } from './captions'
import { WP_UPLOADS_URL } from './wp/client'

describe('captionsPath', () => {
  it('maps a .vtt in the media library to the same-origin route', () => {
    expect(captionsPath(`${WP_UPLOADS_URL}/2026/10/naturopathic.vtt`)).toBe('/api/captions/2026/10/naturopathic.vtt')
    expect(captionsPath(` ${WP_UPLOADS_URL}/acupuncture-en.vtt `)).toBe('/api/captions/acupuncture-en.vtt')
  })

  it('returns null for anything else', () => {
    expect(captionsPath(`${WP_UPLOADS_URL}/2026/10/naturopathic.mp4`)).toBeNull()
    expect(captionsPath(`${WP_UPLOADS_URL}/2026/10/naturopathic.vtt?ver=2`)).toBeNull()
    expect(captionsPath(`${WP_UPLOADS_URL}/../wp-config.vtt`)).toBeNull()
    expect(captionsPath('https://example.com/wp-content/uploads/2026/10/naturopathic.vtt')).toBeNull()
    expect(captionsPath('')).toBeNull()
    expect(captionsPath(null)).toBeNull()
    expect(captionsPath(undefined)).toBeNull()
  })
})

describe('captionsSource', () => {
  it('rebuilds the media library URL from the route segments', () => {
    expect(captionsSource(['2026', '10', 'naturopathic.vtt'])).toBe(`${WP_UPLOADS_URL}/2026/10/naturopathic.vtt`)
  })

  it('refuses other files, dot segments and empty paths', () => {
    expect(captionsSource(['2026', '10', 'naturopathic.mp4'])).toBeNull()
    expect(captionsSource(['..', 'wp-config.vtt'])).toBeNull()
    expect(captionsSource(['.hidden.vtt'])).toBeNull()
    expect(captionsSource(['2026', '', 'a.vtt'])).toBeNull()
    expect(captionsSource([])).toBeNull()
  })
})
