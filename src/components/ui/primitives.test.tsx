import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { SiteSettings } from '@/lib/site'
import { Address } from './Address'
import { Hours } from './Hours'
import { StepList } from './StepList'

const steps = [
  { title: 'Book a consultation', body: 'Pick a time that suits you.' },
  { title: 'Talk it through', body: 'A 30-minute virtual assessment.' },
  { title: 'Start your plan', body: 'Treatment built around you.' },
]

describe('StepList', () => {
  it('renders one numbered item per step, in order', () => {
    const html = renderToStaticMarkup(<StepList steps={steps} />)
    const items = html.match(/<li[\s>][\s\S]*?<\/li>/g) ?? []

    expect(items).toHaveLength(3)
    items.forEach((item, i) => {
      expect(item).toContain(`>${i + 1}<`)
      expect(item).toContain(steps[i].title)
      expect(item).toContain(steps[i].body)
    })
  })

  it('hides the visible numeral from screen readers, which announce the list position', () => {
    const html = renderToStaticMarkup(<StepList steps={steps} />)

    expect(html.match(/<span aria-hidden="true"[^>]*>\d<\/span>/g)).toHaveLength(3)
  })

  it('renders only the <ol>, with nothing but <li> children', () => {
    const html = renderToStaticMarkup(<StepList steps={steps} className="plan" />)

    expect(html.startsWith('<ol')).toBe(true)
    expect(html.endsWith('</ol>')).toBe(true)

    const inner = html.replace(/^<ol[^>]*>/, '').replace(/<\/ol>$/, '')
    const children = inner.replace(/<li[\s>][\s\S]*?<\/li>/g, '')
    expect(children).toBe('')
  })

  it('switches the numeral colour for a teal field', () => {
    const light = renderToStaticMarkup(<StepList steps={steps} />)
    const teal = renderToStaticMarkup(<StepList steps={steps} surface="teal" />)

    expect(light).toContain('text-teal')
    expect(teal).not.toContain('text-teal ')
    expect(teal).toContain('text-paper')
  })
})

describe('Hours', () => {
  const hours: SiteSettings['hours'] = [
    { days: ['Monday', 'Tuesday', 'Thursday'], opens: '10:00', closes: '18:00' },
    { days: ['Friday'], opens: '09:30', closes: '13:00' },
  ]

  it('renders every row as a term and its times', () => {
    const html = renderToStaticMarkup(<Hours hours={hours} />)

    expect(html).toContain('<dl')
    expect(html.match(/<dt/g)).toHaveLength(2)
    expect(html.match(/<dd/g)).toHaveLength(2)
    expect(html).toContain('Monday, Tuesday and Thursday')
    expect(html).toContain('10am-6pm')
    expect(html).toContain('Friday')
    expect(html).toContain('9:30am-1pm')
  })

  it('renders the note on its own line when given', () => {
    const note = 'Remote appointments every other Saturday. Ask when you book.'
    const html = renderToStaticMarkup(<Hours hours={hours} note={note} />)

    expect(html).toMatch(new RegExp(`</dl><p[^>]*>${note}</p>`))
  })

  it('leaves the note out when there is none', () => {
    const html = renderToStaticMarkup(<Hours hours={hours} />)

    expect(html).not.toContain('<p')
  })

  it('uses no em or en dashes', () => {
    const html = renderToStaticMarkup(<Hours hours={hours} />)

    // U+2013 en dash, U+2014 em dash
    expect(html).not.toMatch(new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`))
  })
})

describe('Address', () => {
  const address: SiteSettings['address'] = {
    street: '2168-3779 Sexsmith Road',
    locality: 'Richmond',
    region: 'BC',
    postal: 'V6X 3Z9',
    country: 'CA',
  }

  it('renders an upright <address> with the street and locality lines', () => {
    const html = renderToStaticMarkup(<Address address={address} className="mt-4" />)

    expect(html).toMatch(/^<address class="[^"]*not-italic[^"]*mt-4[^"]*">/)
    expect(html).toContain('2168-3779 Sexsmith Road')
    expect(html).toContain('Richmond, BC V6X 3Z9')
    expect(html.indexOf('Sexsmith Road')).toBeLessThan(html.indexOf('Richmond, BC'))
  })
})
