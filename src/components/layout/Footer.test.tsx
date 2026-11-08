import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { reviewsUrl, site } from '@/lib/site'
import { Footer } from './Footer'

describe('Footer', () => {
  const html = renderToStaticMarkup(<Footer settings={site} />)

  it('carries the map the top bar links to', () => {
    expect(html).toMatch(/<section [^>]*id="map"/)
    expect(html).toContain('output=embed')
  })

  it('drops what the second wireframe struck: the service buttons and the Mercy line', () => {
    expect(html).not.toContain('Mercy of your symptoms')
    expect(html).not.toContain('href="/services/')
    expect(html).not.toContain('bg-clay')
  })

  it('links Testimonials to the Google reviews', () => {
    expect(html).toContain(`href="${reviewsUrl.replaceAll('&', '&amp;')}"`)
    expect(html).toMatch(/>Testimonials<\/a>/)
  })
})
