'use client'

import { useState } from 'react'

import { site } from '@/lib/site'

type State = 'idle' | 'sending' | 'sent' | 'error'

// A ring rather than the global outline: the outline sits 3px off the edge,
// which on a field reads as a second box around the first.
const field =
  'block w-full rounded-photo border border-ink-900/20 bg-paper px-4 py-3.5 text-base text-ink-900 ' +
  'placeholder:text-ink-500 transition-colors duration-300 hover:border-ink-900/40 ' +
  'focus-visible:border-clay-600 focus-visible:ring-2 focus-visible:ring-clay-600 focus-visible:outline-hidden'

const label = 'mb-2 block text-small font-medium text-ink-900'

export function ContactForm() {
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('sending')
    setError('')

    const data = Object.fromEntries(new FormData(event.currentTarget))

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error ?? 'Something went wrong.')
      }

      setState('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div role="status" className="rounded-photo bg-teal-50 px-6 py-8 sm:px-8">
        {/* The form is gone from under the cursor, so focus moves here and a
            screen reader hears the confirmation. */}
        <h3
          tabIndex={-1}
          ref={(node) => node?.focus()}
          className="text-h3 outline-hidden"
        >
          Thanks &mdash; that&rsquo;s sent.
        </h3>
        <p className="mt-3 text-ink-700">
          We&rsquo;ll get back to you shortly. If it&rsquo;s urgent, call{' '}
          <a href={site.phoneHref} className="font-medium text-teal-700 underline underline-offset-4">
            {site.phone}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={label}>
            Name
          </label>
          <input id="contact-name" name="name" required autoComplete="name" className={field} />
        </div>

        <div>
          <label htmlFor="contact-email" className={label}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className={label}>
          Phone <span className="font-normal text-ink-500">(optional)</span>
        </label>
        <input id="contact-phone" name="phone" type="tel" autoComplete="tel" className={field} />
      </div>

      <div>
        <label htmlFor="contact-message" className={label}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="What would you like to ask?"
          className={`${field} min-h-40 resize-y`}
        />
      </div>

      {/* Honeypot. Real people never see it; bots fill everything. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Leave this blank
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* clay-700 rather than the error red: red on cream is under 4.5:1 at
          this size, and the bar still says "error" at a glance. */}
      {state === 'error' && (
        <p role="alert" className="border-l-[3px] border-error pl-4 font-medium text-clay-700">
          {error}
        </p>
      )}

      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex shrink-0 items-center justify-center rounded-pill bg-clay-600 px-6 py-3.5 text-body font-medium tracking-tight text-canvas transition-colors duration-300 hover:bg-clay-700 disabled:cursor-wait disabled:opacity-70"
        >
          {state === 'sending' ? 'Sending…' : 'Send message'}
        </button>

        <p className="max-w-[46ch] text-small text-ink-500">
          Please don&rsquo;t include medical details you wouldn&rsquo;t want sent by
          email. For anything sensitive, call us instead.
        </p>
      </div>
    </form>
  )
}
