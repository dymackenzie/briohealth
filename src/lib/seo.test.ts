import { describe, expect, it } from 'vitest'
import { buildMetadata } from './seo'
import { absoluteUrl, defaultDescription } from './site'

describe('buildMetadata', () => {
  it('passes a plain title through for the layout template to wrap', () => {
    const meta = buildMetadata({ title: 'Acupuncture', path: '/services/acupuncture' })
    expect(meta.title).toBe('Acupuncture')
    expect(meta.openGraph?.title).toBe('Acupuncture')
  })

  it('passes an absolute title through unchanged, so the template is skipped', () => {
    const title = { absolute: 'Brio Health: naturopathic medicine in Richmond, BC' }
    const meta = buildMetadata({ title })
    expect(meta.title).toEqual(title)
    expect(meta.openGraph?.title).toEqual(title)
  })

  it('makes the canonical and og:url absolute', () => {
    const meta = buildMetadata({ title: 'Blog', path: '/blog' })
    expect(meta.alternates?.canonical).toBe(absoluteUrl('/blog'))
    expect(meta.openGraph?.url).toBe(absoluteUrl('/blog'))
  })

  it('uses the site description when none is given', () => {
    const meta = buildMetadata({ title: 'Contact', path: '/contact' })
    expect(meta.description).toBe(defaultDescription)
    expect(meta.openGraph?.description).toBe(defaultDescription)
  })

  it('keeps the site share image unless the page has its own', () => {
    const plain = buildMetadata({ title: 'About', path: '/about' })
    expect(plain.openGraph?.images).toEqual([
      expect.objectContaining({ url: absoluteUrl('/brio_social_2.png') }),
    ])

    const own = buildMetadata({ title: 'A post', path: '/blog/a', image: 'https://yourbriohealth.com/x.jpg' })
    expect(own.openGraph?.images).toEqual([{ url: 'https://yourbriohealth.com/x.jpg' }])
  })

  it('sets noindex only when asked', () => {
    expect(buildMetadata({ title: 'x' }).robots).toBeUndefined()
    expect(buildMetadata({ title: 'x', noindex: true }).robots).toEqual({ index: false, follow: false })
  })
})
