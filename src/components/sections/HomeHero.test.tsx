import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { home } from '@/lib/content/home'
import { photos } from '@/lib/content/photos'
import { BOOKING_PATH, site } from '@/lib/site'
import { HomeHero } from './HomeHero'

describe('HomeHero with the photo on', () => {
  const html = renderToStaticMarkup(<HomeHero content={home.hero} cta={site.ctaLabel} />)

  it('shows the photo, not the garden', () => {
    expect(html).toContain(`alt="${photos.heroPatient.alt}"`)
    expect(html).not.toContain('role="img"')
  })

  it('keeps the wireframe words and the booking button', () => {
    expect(html).toContain(home.hero.heading)
    expect(html).toContain(home.hero.sentence)
    expect(html).toContain(`href="${BOOKING_PATH}"`)
  })
})
