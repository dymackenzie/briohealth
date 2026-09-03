'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data._hp) return // honeypot

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-6 bg-teal-050 rounded-[var(--r-lg)] text-teal-700 text-center">
        <p className="font-display text-xl mb-1">Message sent!</p>
        <p className="text-[0.9375rem]">We'll get back to you within 1-2 business days.</p>
      </div>
    )
  }

  const inputClass = 'w-full px-4 py-3 rounded-[var(--r-md)] border border-sand-300 bg-paper text-ink-900 placeholder-ink-300 focus:outline-none focus:border-teal-500 text-[0.9375rem]'
  const labelClass = 'block text-[0.875rem] font-semibold text-ink-700 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="your@email.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" placeholder="(604) 000-0000" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="message">Message</label>
        <textarea id="message" name="message" required rows={5} placeholder="How can we help?" className={`${inputClass} resize-y min-h-[120px]`} />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-[var(--r-pill)] transition-colors cursor-pointer disabled:opacity-70"
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'error' && (
        <p className="text-error text-[0.875rem]">Something went wrong. Please call us at (604) 271-9355.</p>
      )}
    </form>
  )
}
