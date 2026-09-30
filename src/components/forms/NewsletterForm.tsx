'use client'

import { useEffect, useRef, useState } from 'react'
import { WarningCircle } from '@phosphor-icons/react'

import { Button } from '@/components/ui/Button'
import { MAX_LENGTH, validateNewsletter } from '@/lib/forms'

type State = 'idle' | 'sending' | 'sent' | 'error'

// fetch rejecting says "Failed to fetch"; nobody should read that.
const UNREACHABLE = "We couldn't sign you up just now. Please try again in a minute."

/**
 * One field, label above it, error below it in words and an icon (no
 * second colour on the site, so state is never colour alone). The check is
 * validateNewsletter, the same one /api/newsletter runs, and the browser's
 * own bubble is off so its wording never differs from ours.
 */
export function NewsletterForm() {
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')
  const sentRef = useRef<HTMLParagraphElement>(null)

  // The form, and the button that had focus, are gone; keep focus somewhere.
  useEffect(() => {
    if (state === 'sent') sentRef.current?.focus()
  }, [state])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    const result = validateNewsletter({ email: new FormData(form).get('email') })
    if (!result.ok) {
      setMessage(result.error)
      setState('error')
      form.querySelector<HTMLElement>('[name="email"]')?.focus()
      return
    }

    setState('sending')
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: result.email }),
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) {
        // The route's own messages are plain words; anything else (a proxy
        // page, a crash) gets the fixed line.
        setMessage(typeof body?.error === 'string' && body.error ? body.error : UNREACHABLE)
        setState('error')
        return
      }

      setMessage(typeof body?.message === 'string' && body.message ? body.message : "You're on the list. Thanks.")
      setState('sent')
    } catch {
      setMessage(UNREACHABLE)
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <p ref={sentRef} tabIndex={-1} role="status" className="text-body">
        {message}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-3">
      <label htmlFor="newsletter-email" className="text-small font-medium">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          maxLength={MAX_LENGTH.email}
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
