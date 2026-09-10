'use client'

import { useState } from 'react'

type State = 'idle' | 'sending' | 'sent' | 'error'

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

      setMessage(body.message ?? 'You&rsquo;re on the list.')
      setState('sent')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not subscribe.')
      setState('error')
    }
  }

  if (state === 'sent') {
    return <p className="text-[0.95rem] opacity-85">{message}</p>
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label className="grow">
        <span className="sr-only">Email address</span>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full rounded-pill border border-current/25 bg-transparent px-4 py-3 placeholder:text-current/40 focus:border-current/60 focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={state === 'sending'}
        className="rounded-pill bg-canvas px-4 py-3 font-medium text-teal-900 transition-colors hover:bg-paper disabled:opacity-60"
      >
        {state === 'sending' ? 'Joining…' : 'Sign up'}
      </button>

      {state === 'error' && (
        <p role="alert" className="text-[0.9rem] text-coral-300 sm:sr-only">
          {message}
        </p>
      )}
    </form>
  )
}
