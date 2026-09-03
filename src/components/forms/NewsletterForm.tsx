'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-4 bg-teal-050 rounded-[var(--r-md)] text-teal-700 font-semibold text-center">
        You're subscribed! Check your inbox.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
      {/* Honeypot */}
      <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
        className="flex-1 px-4 py-3 rounded-[var(--r-md)] border border-sand-300 bg-paper text-ink-900 placeholder-ink-300 focus:outline-none focus:border-teal-500 text-[0.9375rem]"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-[var(--r-pill)] transition-colors cursor-pointer disabled:opacity-70 shrink-0"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-error text-[0.875rem] mt-1">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
