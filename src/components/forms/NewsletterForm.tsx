'use client'

import { useState } from 'react'
import { WarningCircle } from '@phosphor-icons/react'

import { Button } from '@/components/ui/Button'

type State = 'idle' | 'sending' | 'sent' | 'error'

/**
 * One field, label above it, error below it in words and an icon (no
 * second colour on the site, so state is never colour alone).
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

      setMessage(body.message ?? "You're on the list. Thanks.")
      setState('sent')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not subscribe.')
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <p role="status" className="text-body">
        {message}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <label htmlFor="newsletter-email" className="text-small font-medium">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={state === 'error' || undefined}
          aria-describedby={state === 'error' ? 'newsletter-error' : undefined}
          className="w-full min-w-0 rounded-brand border border-ink-soft bg-paper px-4 py-3 text-ink"
        />
        <Button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Joining' : 'Sign up'}
        </Button>
      </div>
      {state === 'error' && (
        <p id="newsletter-error" role="alert" className="flex items-center gap-2 text-small font-medium">
          <WarningCircle size={18} aria-hidden />
          {message}
        </p>
      )}
    </form>
  )
}
