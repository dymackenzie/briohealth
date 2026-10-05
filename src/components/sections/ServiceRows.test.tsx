import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { Photo } from '@/lib/content/photos'
import { ServiceRows, SIDE_QUERY, type ServiceRowItem } from './ServiceRows'

// A static render is the server pass, where nothing is hydrated and no
// media query matches. These stand in for the browser after hydration.
const browser = vi.hoisted(() => ({ hydrated: true, canHover: false, wide: false, reducedMotion: false }))
vi.mock('@/components/video/hooks', () => ({
  useHydrated: () => browser.hydrated,
  useMediaQuery: (query: string) =>
    query === '(hover: hover)' ? browser.canHover : query === '(min-width: 768px)' ? browser.wide : browser.reducedMotion,
  useInView: () => false,
}))

const poster: Photo = { src: '/photos/loop-still.jpg', alt: 'Needles in a forearm', position: '50% 50%' }
const row: ServiceRowItem = {
  slug: 'acupuncture',
  title: 'Acupuncture',
  href: '/services/acupuncture',
  brief: 'A short horizontal loop of acupuncture',
  poster,
  loop: 'https://example.com/loop.mp4',
}

const desk = { canHover: true, wide: true }

function render(env: Partial<typeof browser>, props: Partial<ServiceRowItem> = {}) {
  Object.assign(browser, { hydrated: true, canHover: false, wide: false, reducedMotion: false }, env)
  return renderToStaticMarkup(<ServiceRows label="Services" items={[{ ...row, ...props }]} />)
}

const link = (html: string) => html.slice(html.indexOf('<a '), html.indexOf('</a>') + 4)

describe('ServiceRows', () => {
  it('keys the side panel to the md query the markup uses', () => {
    expect(SIDE_QUERY).toBe('(min-width: 768px)')
  })

  it('names each link by the service alone and keeps the media out of it', () => {
    for (const html of [render(desk), render({}), render({ hydrated: false }), render({}, { poster: null })]) {
      expect(link(html)).toMatch(/^<a [^>]*href="\/services\/acupuncture"[^>]*><span class="text-h2">Acupuncture<\/span><svg/)
      expect(link(html)).not.toContain('<img')
      expect(link(html)).not.toContain('to come')
    }
  })

  it('renders plain links before hydration (and without JavaScript): no panel, no buttons, no video', () => {
    const html = render({ hydrated: false, canHover: true, wide: true })
    expect(html).not.toContain('<button')
    expect(html).not.toContain('<video')
    expect(html).not.toContain('aspect-video')
    expect(html).not.toContain('col-span-7')
  })

  describe('beside the list (md and up, hover)', () => {
    it('puts one 16:9 panel beside the list, hidden from assistive tech, with no disclosure button', () => {
      const html = render(desk)
      expect(html).toContain('col-span-7')
      expect(html).toContain('<div aria-hidden="true" class="relative aspect-video')
      expect(html).not.toContain('aria-expanded')
      expect(html).not.toContain('inert')
    })

    it('puts the pause button on the panel, outside the hidden media and the list', () => {
      const html = render(desk)
      expect(html.match(/<button/g)).toHaveLength(1)
      expect(html).toContain('aria-label="Pause Acupuncture video"')
      expect(html.indexOf('<button')).toBeGreaterThan(html.indexOf('</ul>'))
      expect(html.indexOf('<button')).toBeGreaterThan(html.indexOf('aria-hidden="true" class="relative aspect-video'))
    })
  })

  describe('under the name (touch, or below md)', () => {
    it('gives a disclosure button beside the link, shut at first, wired to its panel', () => {
      for (const html of [render({}), render({ canHover: true, wide: false }), render({ wide: true })]) {
        expect(html.match(/<button/g)).toHaveLength(1)
        expect(html).toContain('aria-expanded="false"')
        expect(html).toContain('aria-label="Preview Acupuncture"')
        const controls = html.match(/aria-controls="([^"]+)"/)?.[1]
        expect(controls).toBeTruthy()
        expect(html).toContain(`id="${controls}"`)
        // Never nested in the link: a button inside <a> is invalid and would navigate.
        expect(html.indexOf('<button')).toBeGreaterThan(html.indexOf('</a>'))
        // The pause button belongs to an open row only.
        expect(html).not.toContain('Pause Acupuncture video')
      }
    })

    it('renders the panel shut and inert until the row opens', () => {
      const html = render({})
      expect(html).toContain('inert=""')
      expect(html).toContain('grid-rows-[0fr]')
      expect(html).not.toContain('grid-rows-[1fr]')
      expect(html).not.toContain('col-span-7')
    })
  })

  it('is 16:9, and shows the labelled video placeholder when there is no still, even with a loop', () => {
    for (const env of [desk, {}]) {
      const html = render(env, { poster: null })
      expect(html).toContain('aspect-video')
      expect(html).toContain('aria-label="Video to come: A short horizontal loop of acupuncture"')
      expect(html).not.toContain('<video')
      expect(html).not.toContain('aspect-[4/5]')
    }
  })

  it('never puts a video in the page under reduced motion: the still only, and no pause button', () => {
    for (const env of [desk, {}]) {
      const html = render({ ...env, reducedMotion: true })
      expect(html).not.toContain('<video')
      expect(html).not.toContain('Pause Acupuncture video')
      expect(html).toContain('alt="Needles in a forearm"')
    }
  })
})
