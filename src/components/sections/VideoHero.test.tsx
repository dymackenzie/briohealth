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

  it('falls back to the teal field with no image or video when there is a loop but no poster', () => {
    const html = renderToStaticMarkup(<VideoHero {...base} still={null} loop="https://example.com/loop.mp4" youtube={null} />)
    expect(html).toContain('data-surface="teal"')
    expect(html).toContain('Acupuncture')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('<video')
    expect(html).not.toContain('bg-ink/45')
  })

  it('sizes the teal field to its content on the section rhythm, not the media height or aspect', () => {
    const html = renderToStaticMarkup(<VideoHero {...base} still={null} loop={null} youtube="https://youtu.be/mYhjmq7-1q8" />)
    const section = html.match(/<section [^>]*>/)?.[0] ?? ''
    expect(section).toMatch(/\bsection-y\b/)
    expect(html).not.toMatch(/min-h-\[|max-h-\[70vh\]|aspect-\[/)
    expect(html).toContain('Watch the video')
  })

  it('keeps the media height and aspect when there is a still', () => {
    const section = renderToStaticMarkup(<VideoHero {...base} still={still} loop={null} youtube={null} />).match(/<section [^>]*>/)?.[0] ?? ''
    expect(section).toContain('aspect-[4/5]')
    expect(section).toContain('max-h-[70vh]')
    expect(section).toContain('sm:aspect-[16/9]')
  })

  it('shows the photo as a still under the ink wash when there is no loop', () => {
    const html = renderToStaticMarkup(<VideoHero {...base} still={still} loop={null} youtube={null} />)
    expect(html).toContain('acupuncture-wide.jpg')
    expect(html).not.toContain('<video')
    expect(html).toContain('bg-ink/45')
    expect(html).not.toContain('data-surface="teal"')
  })

  it('gives the copy over the ink wash a paper focus ring, without painting a surface', () => {
    const html = renderToStaticMarkup(<VideoHero {...base} still={still} loop={null} youtube="https://youtu.be/mYhjmq7-1q8" />)
    const copyLayer = (html.match(/<div class="absolute inset-0 z-20[^"]*"/)?.[0] ?? '').replaceAll('&amp;', '&')
    expect(copyLayer).toContain('[&_:focus-visible]:outline-paper')
    expect(html).not.toContain('data-surface="tide"')
  })

  it('offers Watch the video only for a YouTube link', () => {
    const yes = renderToStaticMarkup(<VideoHero {...base} still={still} loop={null} youtube="https://youtu.be/mYhjmq7-1q8" />)
    expect(yes).toContain('Watch the video')
    expect(yes).not.toContain('<iframe')
    const no = renderToStaticMarkup(<VideoHero {...base} still={still} loop={null} youtube="https://vimeo.com/1" />)
    expect(no).not.toContain('Watch the video')
  })
})
