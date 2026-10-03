import { describe, expect, it } from 'vitest'
import { contactEmail, MAX_LENGTH, validateContact, validateNewsletter } from './forms'

const good = { name: 'Ada', email: 'ada@example.com', phone: '', message: 'Hello there', topic: null }

describe('validateContact', () => {
  it('accepts a complete message', () => {
    const result = validateContact(good)
    expect(result).toEqual({ ok: true, spam: false, data: { ...good } })
  })

  it('rejects non-object bodies', () => {
    expect(validateContact(null).ok).toBe(false)
    expect(validateContact('x').ok).toBe(false)
    expect(validateContact([]).ok).toBe(false)
  })

  it('rejects fields that are not strings without throwing', () => {
    expect(validateContact({ ...good, name: ['a'] }).ok).toBe(false)
    expect(validateContact({ ...good, message: { text: 'x' } }).ok).toBe(false)
    expect(validateContact({ ...good, email: 42 }).ok).toBe(false)
  })

  it('rejects a missing required field with a plain message', () => {
    const result = validateContact({ ...good, message: '   ' })
    expect(result).toEqual({ ok: false, error: 'Please fill in your name, email and message.', fields: ['message'] })
  })

  it('names every missing field, in form order, so the form can mark them', () => {
    const result = validateContact({ name: '', email: ' ', message: '' })
    expect(result).toEqual({
      ok: false,
      error: 'Please fill in your name, email and message.',
      fields: ['name', 'email', 'message'],
    })
  })

  it('rejects a malformed email', () => {
    const result = validateContact({ ...good, email: 'not-an-email' })
    expect(result).toEqual({ ok: false, error: 'That email address does not look right.', fields: ['email'] })
  })

  it('trims and caps field lengths', () => {
    const result = validateContact({ ...good, name: '  Ada  ', message: 'x'.repeat(6000) })
    expect(result.ok && result.data.name).toBe('Ada')
    expect(result.ok && result.data.message.length).toBe(5000)
  })

  it('flags the honeypot as spam but still ok', () => {
    const result = validateContact({ ...good, website: 'http://spam.example' })
    expect(result).toMatchObject({ ok: true, spam: true })
  })
})

describe('contactEmail', () => {
  it('puts a blank line between who wrote and the message', () => {
    const { text } = contactEmail({ ...good, phone: '604 555 0100', message: 'First line.\nSecond line.' })
    expect(text).toBe('Name: Ada\nEmail: ada@example.com\nPhone: 604 555 0100\n\nFirst line.\nSecond line.')
  })

  it('leaves out an empty phone and keeps the blank line', () => {
    const { text } = contactEmail(good)
    expect(text).toBe('Name: Ada\nEmail: ada@example.com\n\nHello there')
  })

  it('keeps line breaks in the name out of the subject', () => {
    const { subject } = contactEmail({ ...good, name: 'Ada\r\nBcc: x@example.com' })
    expect(subject).toBe('Website enquiry from Ada Bcc: x@example.com')
    expect(subject).not.toMatch(/[\r\n]/)
  })
})

describe('MAX_LENGTH', () => {
  it('is what validateContact caps each field at', () => {
    const long = Object.fromEntries(Object.entries(MAX_LENGTH).map(([key, max]) => [key, 'a'.repeat(max + 10)]))
    const result = validateContact({ ...long, email: 'ada@example.com' })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.name).toHaveLength(MAX_LENGTH.name)
    expect(result.data.phone).toHaveLength(MAX_LENGTH.phone)
    expect(result.data.message).toHaveLength(MAX_LENGTH.message)
  })
})

describe('validateNewsletter', () => {
  it('lower-cases and trims a good address', () => {
    expect(validateNewsletter({ email: '  Ada@Example.com ' })).toEqual({ ok: true, email: 'ada@example.com' })
  })

  it('rejects a bad or missing address', () => {
    expect(validateNewsletter({ email: 'nope' })).toEqual({ ok: false, error: 'Please enter a valid email address.' })
    expect(validateNewsletter({}).ok).toBe(false)
    expect(validateNewsletter(null).ok).toBe(false)
    expect(validateNewsletter({ email: ['a@b.co'] }).ok).toBe(false)
  })
})

describe('lesson enquiries', () => {
  const body = { name: 'Pat', email: 'pat@example.com', phone: '', message: 'Two of us, beginners.' }

  it('marks a lesson enquiry in the subject', () => {
    const result = validateContact({ ...body, topic: 'lesson' })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.topic).toBe('lesson')
    expect(contactEmail(result.data).subject).toBe('Pickleball lesson enquiry from Pat')
  })

  it('treats a missing, unknown or non-string topic as a normal enquiry', () => {
    for (const topic of [undefined, 'other', 42, { x: 1 }, ['lesson']]) {
      const result = validateContact({ ...body, topic })
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.data.topic).toBeNull()
      expect(contactEmail(result.data).subject).toBe('Website enquiry from Pat')
    }
  })
})
