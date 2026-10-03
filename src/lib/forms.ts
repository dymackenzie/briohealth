import { EMAIL_PATTERN } from './site'

/**
 * One rule set for the contact and newsletter forms, run twice: in the
 * browser before sending and in the API route on arrival. Anything can POST
 * JSON, so every field is checked for type before it is trusted; a bad body
 * is a 400 with a sentence a person can read, never a 500.
 */

export interface ContactInput {
  name: string
  email: string
  phone: string
  message: string
  /** 'lesson' from the pickleball page; anything else is a normal enquiry. */
  topic: 'lesson' | null
}

/** The contact fields a person has to fill in, in the order the form shows them. */
export type ContactField = 'name' | 'email' | 'message'

export type ContactResult =
  | { ok: true; data: ContactInput; spam: boolean }
  // `fields` says which inputs to mark; it is absent when the body itself is bad.
  | { ok: false; error: string; fields?: ContactField[] }

/** Longest accepted value per field. The form's inputs carry the same limits. */
export const MAX_LENGTH = { name: 120, email: 200, phone: 40, message: 5000 } as const
const REQUIRED: ContactField[] = ['name', 'email', 'message']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function validateContact(body: unknown): ContactResult {
  if (!isRecord(body)) return { ok: false, error: 'Invalid request.' }

  for (const key of Object.keys(MAX_LENGTH) as (keyof typeof MAX_LENGTH)[]) {
    const value = body[key]
    if (value !== undefined && typeof value !== 'string') {
      return { ok: false, error: 'Invalid request.' }
    }
  }

  const field = (key: keyof typeof MAX_LENGTH) => {
    const value = body[key]
    return typeof value === 'string' ? value.trim().slice(0, MAX_LENGTH[key]) : ''
  }

  // Honeypot: real people never see the field; bots fill everything.
  const spam = typeof body.website === 'string' && body.website.trim() !== ''
  const topic = body.topic === 'lesson' ? 'lesson' : null

  const data: ContactInput = {
    name: field('name'),
    email: field('email'),
    phone: field('phone'),
    message: field('message'),
    topic,
  }

  const missing = REQUIRED.filter((key) => !data[key])
  if (missing.length) {
    return { ok: false, error: 'Please fill in your name, email and message.', fields: missing }
  }
  if (!EMAIL_PATTERN.test(data.email)) {
    return { ok: false, error: 'That email address does not look right.', fields: ['email'] }
  }

  return { ok: true, data, spam }
}

export function validateNewsletter(body: unknown): { ok: true; email: string } | { ok: false; error: string } {
  const raw = isRecord(body) ? body.email : undefined
  const email = typeof raw === 'string' ? raw.trim().toLowerCase().slice(0, MAX_LENGTH.email) : ''
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }
  return { ok: true, email }
}

/**
 * The email the clinic receives: who wrote, a blank line, then the message.
 * The name goes in the subject, so line breaks come out of it there. A
 * lesson enquiry from /pickleball says so in the subject.
 */
export function contactEmail({ name, email, phone, message, topic }: ContactInput): { subject: string; text: string } {
  const header = [`Name: ${name}`, `Email: ${email}`, ...(phone ? [`Phone: ${phone}`] : [])].join('\n')
  const who = name.replace(/[\r\n]+/g, ' ').trim()
  return {
    subject: topic === 'lesson' ? `Pickleball lesson enquiry from ${who}` : `Website enquiry from ${who}`,
    text: `${header}\n\n${message}`,
  }
}
