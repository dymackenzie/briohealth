import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { articleJsonLd, breadcrumbJsonLd, clinicJsonLd, JsonLd } from './jsonld'
import { absoluteUrl, site, type SiteSettings } from './site'

describe('clinicJsonLd', () => {
  const settings: SiteSettings = {
    ...site,
    hours: [{ days: ['Monday', 'Tuesday', 'Thursday'], opens: '10:00', closes: '18:00' }],
    saturdayNote: 'Remote appointments every other Saturday. Ask when you book.',
  }
  const data = clinicJsonLd(settings)

  it('lists only the physical days', () => {
    const spec = data.openingHoursSpecification
    expect(spec).toHaveLength(1)
    expect(spec[0].dayOfWeek).toEqual([
      'https://schema.org/Monday',
      'https://schema.org/Tuesday',
      'https://schema.org/Thursday',
    ])
    expect(spec[0].opens).toBe('10:00')
    expect(spec[0].closes).toBe('18:00')
  })

  it('never mentions the remote Saturday', () => {
    expect(JSON.stringify(data)).not.toMatch(/Saturday/)
  })

  it('carries the NAP', () => {
    expect(data.telephone).toBe(settings.phone)
    expect(data.address.streetAddress).toBe(settings.address.street)
    expect(data.address.postalCode).toBe('V6X 3Z9')
  })
})

describe('JsonLd', () => {
  it('escapes a closing script tag inside the payload', () => {
    const html = renderToStaticMarkup(
      <JsonLd
        data={articleJsonLd({
          title: 'Bad </script><script>alert(1)</script> title',
          url: absoluteUrl('/blog/x'),
          published: '2024-01-01T00:00:00',
          author: 'Brio Health',
        })}
      />,
    )
    const inner = html.replace(/^.*?>/, '').replace(/<\/script>$/, '')
    expect(inner).not.toContain('</script>')
    expect(inner).toContain('\\u003c/script')
  })
})

describe('breadcrumbJsonLd', () => {
  it('numbers positions from one and makes absolute urls', () => {
    const data = breadcrumbJsonLd([
      { name: 'Blog', path: '/blog' },
      { name: 'A post', path: '/blog/a-post' },
    ])
    expect(data.itemListElement[0].position).toBe(1)
    expect(data.itemListElement[1].position).toBe(2)
    expect(data.itemListElement[1].item).toBe(absoluteUrl('/blog/a-post'))
  })
})
