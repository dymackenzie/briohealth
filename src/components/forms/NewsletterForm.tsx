'use client'

import { useState } from 'react'

type State = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Lives in the footer, on teal-900. The field is solid cream rather than a
 * see-through outline on the dark band: it reads as a place to type at a
 * glance, and ink on cream is the contrast the rest of the forms use.
 */
export function NewsletterForm() {
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('sending')

    const email = new FormData(event.currentTarget).get('email')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const body = await response.json().catch(() => ({}))

      if (!response.ok) throw new Error(body.error ?? 'Could not subscribe.')

      setMessage(body.message ?? 'You’re on the list.')
      setState('sent')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not subscribe.')
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <p
        role="status"
        className="rounded-photo border border-clay-300/60 px-5 py-4 font-medium text-canvas"
      >
        {message}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="newsletter-email" className="block text-small font-medium text-canvas/85">
        Email address
      </label>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={state === 'error' || undefined}
          aria-describedby={state === 'error' ? 'newsletter-error' : undefined}
          className="min-w-0 grow rounded-photo border border-ink-900/20 bg-canvas px-4 py-3.5 text-base text-ink-900 placeholder:text-ink-500 focus-visible:ring-2 focus-visible:ring-clay-300 focus-visible:outline-hidden"
        />

        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex shrink-0 items-center justify-center rounded-pill bg-clay-300 px-6 py-3.5 text-body font-medium tracking-tight text-ink-900 transition-colors duration-300 hover:bg-clay-100 disabled:cursor-wait disabled:opacity-70"
        >
          {state === 'sending' ? 'Signing up…' : 'Sign up'}
        </button>
      </div>

      {state === 'error' && (
        <p id="newsletter-error" role="alert" className="mt-3 text-small text-clay-300">
          {message}
        </p>
      )}
    </form>
  )
}
