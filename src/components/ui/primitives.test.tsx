import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Bud } from '@/components/brand/Bud'
import type { SiteSettings } from '@/lib/site'
import { Accordion } from './Accordion'
import { Address } from './Address'
import { Button } from './Button'
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

describe('Accordion', () => {
  const items = [
    { question: 'First?', answer: 'One.' },
    { question: 'Second?', answer: 'Two.' },
  ]

  it('server-renders the first answer open, so it reads without JavaScript', () => {
    const html = renderToStaticMarkup(<Accordion items={items} />)
    const panels = html.match(/<div id="[^"]*-panel-\d"[^>]*>/g) ?? []

    expect(panels).toHaveLength(2)
    expect(panels[0]).not.toContain('inert')
    expect(panels[0]).toContain('grid-rows-[1fr]')
    expect(panels[1]).toContain('inert')
    expect(panels[1]).toContain('grid-rows-[0fr]')
    expect(html.match(/aria-expanded="(true|false)"/g)).toEqual(['aria-expanded="true"', 'aria-expanded="false"'])
  })

  it('snaps instead of animating under reduced motion', () => {
    const html = renderToStaticMarkup(<Accordion items={items} />)
    expect(html).toContain('motion-reduce:transition-none')
  })
})

describe('Button', () => {
  it('fills the primary button coral with an ink label on every surface', () => {
    for (const on of ['light', 'teal', 'dark'] as const) {
      const html = renderToStaticMarkup(<Button on={on}>Book Appointment</Button>)
      expect(html).toContain('bg-coral')
      expect(html).toContain('text-ink')
      expect(html).not.toContain('bg-ink ')
    }
  })

  it('draws the outline variant in the surface text colour', () => {
    expect(renderToStaticMarkup(<Button variant="outline">x</Button>)).toContain('border-ink')
    expect(renderToStaticMarkup(<Button variant="outline" on="teal">x</Button>)).toContain('border-on-teal')
    expect(renderToStaticMarkup(<Button variant="outline" on="dark">x</Button>)).toContain('border-paper')
  })

  it('renders an internal href as a link and an external one in a new tab', () => {
    // next/link writes class before href, so match the tag, not the order.
    const internal = renderToStaticMarkup(<Button href="/new-patient">x</Button>)
    expect(internal).toMatch(/^<a [^>]*href="\/new-patient"/)
    expect(internal).not.toContain('target=')
    expect(renderToStaticMarkup(<Button href="https://yourbriohealth.janeapp.com">x</Button>)).toContain('target="_blank"')
  })
})

describe('Bud', () => {
  it('is a dot burst that blooms on reveal, sized and coloured by name', () => {
    const html = renderToStaticMarkup(<Bud size="large" colour="teal" className="top-4 right-4" />)
    expect(html).toContain('data-reveal="up"')
    expect(html).toContain('data-animate="reveal"')
    expect(html).toContain('w-[130px]')
    expect(html).toContain('text-teal')
    expect(html).toContain('top-4 right-4')
    expect(html).toContain('aria-hidden="true"')
  })

  it('sizes medium and small, colours paper, and hides below md unless told not to', () => {
    expect(renderToStaticMarkup(<Bud size="medium" colour="paper" />)).toContain('w-[70px]')
    expect(renderToStaticMarkup(<Bud size="small" colour="paper" />)).toContain('w-[45px]')
    expect(renderToStaticMarkup(<Bud size="small" colour="paper" />)).toContain('text-paper')
    expect(renderToStaticMarkup(<Bud size="small" colour="teal" />)).toContain('hidden md:block')
    expect(renderToStaticMarkup(<Bud size="small" colour="teal" hideBelowMd={false} />)).not.toContain('hidden md:block')
  })
})
