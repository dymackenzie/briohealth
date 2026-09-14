'use client'

import { useState } from 'react'

import { site } from '@/lib/site'

type State = 'idle' | 'sending' | 'sent' | 'error'

const field =
  'w-full rounded-md border border-ink-900/15 bg-paper px-4 py-3 text-ink-900 ' +
  'placeholder:text-ink-300 focus:border-teal-500 focus:outline-none'

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
      <div className="rounded-lg bg-teal-50 px-6 py-7 text-center">
        <h3 className="text-base">Thanks — that&rsquo;s sent.</h3>
        <p className="mt-3 text-ink-500">
          We&rsquo;ll get back to you shortly. If it&rsquo;s urgent, call{' '}
          <a href={site.phoneHref} className="underline">
            {site.phone}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[0.9rem] font-medium">Name</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>

        <label className="block">
          <span className="mb-2 block text-[0.9rem] font-medium">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-[0.9rem] font-medium">
          Phone <span className="font-normal text-ink-300">(optional)</span>
        </span>
        <input name="phone" type="tel" autoComplete="tel" className={field} />
      </label>

      <label className="block">
        <span className="mb-2 block text-[0.9rem] font-medium">Message</span>
        <textarea name="message" required rows={6} className={field} />
      </label>

      {/* Honeypot. Real people never see it; bots fill everything. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Leave this blank
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state === 'error' && (
        <p role="alert" className="text-[0.95rem] text-error">
          {error}
        </p>
      )}

      <div className="mt-2">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex items-center justify-center rounded-pill bg-teal-700 px-5 py-3.5 font-medium text-canvas transition-colors hover:bg-teal-800 disabled:opacity-60"
        >
          {state === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>

      <p className="text-[0.85rem] text-ink-500">
        Please don&rsquo;t include medical details you wouldn&rsquo;t want sent by
        email. For anything sensitive, call us instead.
      </p>
    </form>
  )
}
