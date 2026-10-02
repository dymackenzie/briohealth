import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { NewPatientForm } from './NewPatientForm'

const statements = ['I understand one.', 'I understand two.', 'I understand three.']

describe('NewPatientForm', () => {
  const html = renderToStaticMarkup(
    <NewPatientForm
      bookingUrl="https://yourbriohealth.janeapp.com"
      statements={statements}
      heading="Step 1: Answer the 3 questions below"
      returningLabel="Returning patient? Book directly"
    />,
  )

  it('is a GET form to the Jane URL', () => {
    expect(html).toMatch(/<form[^>]*method="get"/)
    expect(html).toMatch(/<form[^>]*action="https:\/\/yourbriohealth.janeapp.com"/)
  })

  it('has three required checkboxes with no name, so nothing reaches the query string', () => {
    const boxes = html.match(/<input[^>]*type="checkbox"[^>]*>/g) ?? []
    expect(boxes).toHaveLength(3)
    for (const box of boxes) {
      expect(box).toContain('required')
      expect(box).not.toMatch(/\sname=/)
    }
    expect(html).not.toContain('novalidate')
  })

  it('shows every statement with its label and the Get Started submit', () => {
    for (const s of statements) expect(html).toContain(s)
    expect(html).toMatch(/<button[^>]*type="submit"[^>]*>Get Started<\/button>/)
  })

  it('links returning patients straight to Jane, above the checkboxes', () => {
    expect(html).toContain('href="https://yourbriohealth.janeapp.com"')
    expect(html.indexOf('Returning patient? Book directly')).toBeLessThan(html.indexOf('type="checkbox"'))
  })
})
