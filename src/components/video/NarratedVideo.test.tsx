import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { Photo } from '@/lib/content/photos'
import { WP_UPLOADS_URL } from '@/lib/wp/client'

import { NarratedVideo } from './NarratedVideo'

const src = `${WP_UPLOADS_URL}/2026/10/acupuncture-narrated.mp4`
const poster: Photo = { src: `${WP_UPLOADS_URL}/2026/10/acupuncture-still.jpg`, alt: 'Hands at work', position: '50% 50%' }

describe('NarratedVideo', () => {
  it('is a plain player that loads nothing until played, behind the still, with its box reserved', () => {
    const html = renderToStaticMarkup(<NarratedVideo src={src} captions={null} poster={poster} label="Acupuncture video" />)
    const video = html.match(/<video [^>]*>/)?.[0] ?? ''
    expect(video).toContain('controls')
    expect(video).toContain('preload="none"')
    expect(video).not.toContain('autoplay')
    expect(video).toContain(`poster="${poster.src}"`)
    expect(video).toContain('width="1280"')
    expect(video).toContain('height="720"')
    expect(video).toContain('aria-label="Acupuncture video"')
    expect(html).toContain(`src="${src}"`)
    expect(html).not.toContain('<track')
  })

  it('serves captions through this origin, on by default', () => {
    const html = renderToStaticMarkup(
      <NarratedVideo src={src} captions={`${WP_UPLOADS_URL}/2026/10/acupuncture.vtt`} poster={poster} label="Acupuncture video" />,
    )
    const track = html.match(/<track [^>]*>/)?.[0] ?? ''
    expect(track).toContain('src="/api/captions/2026/10/acupuncture.vtt"')
    expect(track).toContain('kind="captions"')
    expect(track).toMatch(/\bdefault\b/)
  })

  it('drops captions that are not a .vtt in the media library', () => {
    const html = renderToStaticMarkup(<NarratedVideo src={src} captions="https://example.com/a.vtt" poster={poster} label="Acupuncture video" />)
    expect(html).not.toContain('<track')
  })
})
