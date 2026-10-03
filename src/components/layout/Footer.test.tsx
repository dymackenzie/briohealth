import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { site } from '@/lib/site'
import { Footer } from './Footer'

describe('Footer', () => {
  const html = renderToStaticMarkup(<Footer settings={site} />)

  it('carries the map the top bar links to', () => {
    expect(html).toMatch(/<section [^>]*id="map"/)
    expect(html).toContain('output=embed')
  })

  it("uses the wireframe's line as written", () => {
    expect(html).toContain('Don&#x27;t be at the Mercy of your symptoms')
  })

  it('keeps coral for Book Appointment only', () => {
    const coral = html.match(/<(?:a|button) [^>]*bg-coral[^>]*>[^<]*/g) ?? []
    expect(coral).toHaveLength(1)
    expect(coral[0]).toContain(site.ctaLabel)
  })
})
