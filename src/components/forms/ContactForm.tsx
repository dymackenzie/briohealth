'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { WarningCircle } from '@phosphor-icons/react'

import { Button } from '@/components/ui/Button'
import { EMAIL_PATTERN } from '@/lib/site'

type State = 'idle' | 'sending' | 'sent' | 'error'
type FieldName = 'name' | 'email' | 'message'
type Errors = Partial<Record<FieldName, string>>

const input =
  'w-full min-w-0 rounded-brand border border-ink-soft bg-paper px-4 py-3 text-ink ' +
  'aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink'

function check(data: FormData): Errors {
  const value = (key: FieldName) => String(data.get(key) ?? '').trim()
  const errors: Errors = {}
  if (!value('name')) errors.name = 'Please tell us your name.'
  if (!value('email')) errors.email = 'Please add your email address.'
  else if (!EMAIL_PATTERN.test(value('email'))) errors.email = 'That email address looks incomplete.'
  if (!value('message')) errors.message = 'Please write a message.'
  return errors
}

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
 * Labels above inputs, each error below its field, a honeypot real people
 * never see. The browser's own bubbles are off so every error looks and
 * reads the same; the first field with a problem takes focus. Success
 * replaces the form and takes focus itself, so it isn't lost.
 */
export function ContactForm({ phone, phoneHref, note }: { phone: string; phoneHref: string; note: string }) {
  const [state, setState] = useState<State>('idle')
  const [errors, setErrors] = useState<Errors>({})
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

    const found = check(data)
    setErrors(found)
    setFailure('')
    const first = Object.keys(found)[0]
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

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

  function clear(name: FieldName) {
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
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

  const describe = (name: FieldName) => (errors[name] ? `contact-${name}-error` : undefined)

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
            autoComplete="name"
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={describe('name')}
            onChange={() => clear('name')}
            className={input}
          />
          {errors.name && <ErrorText id="contact-name-error">{errors.name}</ErrorText>}
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
            autoComplete="email"
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={describe('email')}
            onChange={() => clear('email')}
            className={input}
          />
          {errors.email && <ErrorText id="contact-email-error">{errors.email}</ErrorText>}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-phone" className="font-medium">
          Phone <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <input id="contact-phone" name="phone" type="tel" autoComplete="tel" className={input} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-message" className="font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          aria-invalid={Boolean(errors.message) || undefined}
          aria-describedby={describe('message')}
          onChange={() => clear('message')}
          className={input}
        />
        {errors.message && <ErrorText id="contact-message-error">{errors.message}</ErrorText>}
      </div>

      {/* Honeypot. Real people never see it; bots fill everything. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Leave this blank
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state === 'error' && failure && <ErrorText id="contact-failure">{failure}</ErrorText>}

      <div>
        <Button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending' : 'Send message'}
        </Button>
      </div>

      <p className="max-w-[56ch] text-small text-ink-soft">{note}</p>
    </form>
  )
}
