import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Photo } from '@/lib/content/photos'
import { VideoHero } from './VideoHero'

const still: Photo = { src: '/photos/acupuncture-wide.jpg', alt: 'A patient on the table', position: '0% 60%' }
const base = { title: 'Acupuncture', ctaLabel: 'Book Appointment' }

describe('VideoHero', () => {
  it('falls back to a teal field with the same text when there is no loop and no photo', () => {
    const html = renderToStaticMarkup(<VideoHero {...base} still={null} loop={null} youtube={null} />)
    expect(html).toContain('data-surface="teal"')
    expect(html).toContain('<h1')
    expect(html).toContain('Acupuncture')
    expect(html).toContain('href="/new-patient"')
    expect(html).not.toContain('<video')
    expect(html).not.toContain('Watch the video')
  })

  it('shows the photo as a still under the ink wash when there is no loop', () => {
    const html = renderToStaticMarkup(<VideoHero {...base} still={still} loop={null} youtube={null} />)
    expect(html).toContain('acupuncture-wide.jpg')
    expect(html).toContain('bg-ink/45')
    expect(html).not.toContain('data-surface="teal"')
  })

  it('offers Watch the video only for a YouTube link', () => {
    const yes = renderToStaticMarkup(<VideoHero {...base} still={still} loop={null} youtube="https://youtu.be/mYhjmq7-1q8" />)
    expect(yes).toContain('Watch the video')
    expect(yes).not.toContain('<iframe')
    const no = renderToStaticMarkup(<VideoHero {...base} still={still} loop={null} youtube="https://vimeo.com/1" />)
    expect(no).not.toContain('Watch the video')
  })
})
