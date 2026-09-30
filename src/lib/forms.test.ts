import { describe, expect, it } from 'vitest'
import { validateContact, validateNewsletter } from './forms'

const good = { name: 'Ada', email: 'ada@example.com', phone: '', message: 'Hello there' }

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
