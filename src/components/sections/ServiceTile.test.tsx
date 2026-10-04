import type { ComponentProps } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { Photo } from '@/lib/content/photos'
import { ServiceTile } from './ServiceTile'

// A static render is the server pass, where nothing is hydrated and no
// media query matches. These stand in for the browser after hydration.
const browser = vi.hoisted(() => ({ hydrated: true, canHover: false, reducedMotion: false }))
vi.mock('@/components/video/hooks', () => ({
  useHydrated: () => browser.hydrated,
  useMediaQuery: (query: string) => (query === '(hover: hover)' ? browser.canHover : browser.reducedMotion),
  useInView: () => false,
}))

const still: Photo = { src: '/photos/acupuncture-wide.jpg', alt: 'A patient on the table', position: '50% 50%' }
const tile: ComponentProps<typeof ServiceTile> = {
  title: 'Acupuncture',
  href: '/services/acupuncture',
  subject: 'Needles in a forearm',
  still,
  loop: 'https://example.com/loop.mp4',
}

function render(env: Partial<typeof browser>, props: Partial<typeof tile> = {}) {
  Object.assign(browser, { hydrated: true, canHover: false, reducedMotion: false }, env)
  return renderToStaticMarkup(<ServiceTile {...tile} {...props} />)
}

describe('ServiceTile', () => {
  it('gives a touch device a pause button for the loop once hydrated, outside the link', () => {
    const html = render({})
    expect(html.match(/<button/g)).toHaveLength(1)
    expect(html).toContain('aria-pressed="false"')
    expect(html).toContain('aria-label="Pause Acupuncture video"')
    // Never nested in the link: a button inside <a> is invalid and would navigate.
    expect(html.indexOf('<button')).toBeGreaterThan(html.indexOf('</a>'))
  })

  it('shows no button where the device can hover, the loop plays on hover there', () => {
    expect(render({ canHover: true })).not.toContain('<button')
  })

  it('shows no button before hydration, under reduced motion, or without a loop', () => {
    expect(render({ hydrated: false })).not.toContain('<button')
    expect(render({ reducedMotion: true })).not.toContain('<button')
    expect(render({}, { loop: null })).not.toContain('<button')
  })

  it('names the link by the service, not the photo', () => {
    for (const html of [render({ canHover: true }), render({}, { loop: null }), render({}, { loop: null, still: null })]) {
      const link = html.slice(html.indexOf('<a '), html.indexOf('</a>'))
      expect(link).toContain('Acupuncture')
      expect(link).toContain('Learn more')
      // The media sits under aria-hidden, so neither the alt text nor the
      // placeholder's "Photo to come" brief joins the link's name.
      expect(link).toMatch(/^<a [^>]*><div aria-hidden="true"/)
    }
  })
})
