'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { WarningCircle } from '@phosphor-icons/react'

import { Button } from '@/components/ui/Button'
import { type ContactField, MAX_LENGTH, validateContact } from '@/lib/forms'

type State = 'idle' | 'sending' | 'sent' | 'error'

const input =
  'w-full min-w-0 rounded-brand border border-ink-soft bg-paper px-4 py-3 text-ink ' +
  'aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink'

// One message covers every marked field, so it has one id to point at.
const FIELD_ERROR_ID = 'contact-field-error'

/** An error in words and an icon: there is no second colour to carry it. */
function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="flex items-start gap-2 font-medium">
      <WarningCircle size={20} className="mt-0.5 shrink-0" aria-hidden />
      {children}
    </p>
  )
}

/**
 * Labels above inputs, a honeypot real people never see. The check is
 * validateContact, the same one /api/contact runs, so the two can never
 * disagree. The browser's own bubbles are off so every error looks and
 * reads the same: every field with a problem is marked, the message sits
 * below the first of them, and that field takes focus. Success replaces the
 * form and takes focus itself, so it isn't lost.
 */
export function ContactForm({
  phone,
  phoneHref,
  note,
  topic,
}: {
  phone: string
  phoneHref: string
  note?: string
  /** 'lesson' on /pickleball: the email's subject says it is a lesson enquiry. */
  topic?: 'lesson'
}) {
  const [state, setState] = useState<State>('idle')
  const [invalid, setInvalid] = useState<ContactField[]>([])
  const [problem, setProblem] = useState('')
  const [failure, setFailure] = useState('')
  const sentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state === 'sent') sentRef.current?.focus()
  }, [state])

  const unreachable = `We couldn't send that just now. Please try again, or call us at ${phone}.`

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const result = validateContact(Object.fromEntries(data))
    setFailure('')
    if (!result.ok) {
      const fields = result.fields ?? []
      setInvalid(fields)
      setProblem(result.error)
      if (fields.length) {
        form.querySelector<HTMLElement>(`[name="${fields[0]}"]`)?.focus()
      } else {
        setFailure(result.error)
        setState('error')
      }
      return
    }
    setInvalid([])

    setState('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data)),
      })
      if (!response.ok) {
        // The route's own validation message is plain words; anything else
        // (a proxy page, a crash) gets the fixed line.
        const body = await response.json().catch(() => null)
        throw new Error(typeof body?.error === 'string' && body.error ? body.error : unreachable)
      }
      setState('sent')
    } catch (err) {
      // fetch rejects with a TypeError ("Failed to fetch") when offline.
      setFailure(err instanceof Error && !(err instanceof TypeError) ? err.message : unreachable)
      setState('error')
    }
  }

  // Typing in a marked field unmarks it; the message moves to the next one.
  function clear(name: ContactField) {
    if (invalid.includes(name)) setInvalid((current) => current.filter((field) => field !== name))
  }

  if (state === 'sent') {
    return (
      <div ref={sentRef} tabIndex={-1} role="status" className="border-t-2 border-teal pt-6">
        <h3 className="text-h3">Thanks, that is sent.</h3>
        <p className="mt-3 max-w-[46ch] text-ink-soft">
          We will get back to you shortly. If it is urgent, call{' '}
          <a href={phoneHref} className="link-quiet">
            {phone}
          </a>
          .
        </p>
      </div>
    )
  }

  const isInvalid = (name: ContactField) => invalid.includes(name) || undefined
  const describe = (name: ContactField) => (invalid.includes(name) ? FIELD_ERROR_ID : undefined)
  const errorBelow = (name: ContactField) =>
    invalid[0] === name && <ErrorText id={FIELD_ERROR_ID}>{problem}</ErrorText>

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid content-start gap-2">
          <label htmlFor="contact-name" className="font-medium">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            maxLength={MAX_LENGTH.name}
            autoComplete="name"
            aria-invalid={isInvalid('name')}
            aria-describedby={describe('name')}
            onChange={() => clear('name')}
            className={input}
          />
          {errorBelow('name')}
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor="contact-email" className="font-medium">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={MAX_LENGTH.email}
            autoComplete="email"
            aria-invalid={isInvalid('email')}
            aria-describedby={describe('email')}
            onChange={() => clear('email')}
            className={input}
          />
          {errorBelow('email')}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-phone" className="font-medium">
          Phone <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          maxLength={MAX_LENGTH.phone}
          autoComplete="tel"
          className={input}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-message" className="font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={MAX_LENGTH.message}
          rows={6}
          aria-invalid={isInvalid('message')}
          aria-describedby={describe('message')}
          onChange={() => clear('message')}
          className={input}
        />
        {errorBelow('message')}
      </div>

      {topic && <input type="hidden" name="topic" value={topic} />}

      {/* Honeypot. Real people never see it; bots fill everything. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Leave this blank
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state === 'error' && failure && <ErrorText id="contact-failure">{failure}</ErrorText>}

      <div>
        <Button type="submit" variant="outline" on="light" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending' : 'Send message'}
        </Button>
      </div>

      {note && <p className="max-w-[56ch] text-small text-ink-soft">{note}</p>}
    </form>
  )
}
