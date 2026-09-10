import { NextResponse } from 'next/server'

import { EMAIL_PATTERN, site } from '@/lib/site'

const MAX = { name: 120, email: 200, phone: 40, message: 5000 }

// Enough to stop a bot loop; not a substitute for a real limiter if this ever
// gets hammered. Resets on cold start, which is fine for a clinic contact form.
const seen = new Map<string, number[]>()
const WINDOW = 60_000
const LIMIT = 3

function rateLimited(ip: string) {
  const now = Date.now()

  // Entries were only ever filtered on read, so the map kept a key for every
  // address that had ever posted, for the life of the lambda.
  for (const [key, hits] of seen) {
    const live = hits.filter((t) => now - t < WINDOW)
    if (live.length) seen.set(key, live)
    else seen.delete(key)
  }

  const hits = seen.get(ip) ?? []
  hits.push(now)
  seen.set(ip, hits)
  return hits.length > LIMIT
}

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[contact] RESEND_API_KEY is not set')
    return NextResponse.json(
      { error: 'The form is not configured yet. Please call us instead.' },
      { status: 500 },
    )
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many messages. Please try again in a minute.' },
      { status: 429 },
    )
  }

  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot — a real visitor never sees this field.
  if (body.website) return NextResponse.json({ ok: true })

  const name = (body.name ?? '').trim().slice(0, MAX.name)
  const email = (body.email ?? '').trim().slice(0, MAX.email)
  const phone = (body.phone ?? '').trim().slice(0, MAX.phone)
  const message = (body.message ?? '').trim().slice(0, MAX.message)

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Please fill in every field.' }, { status: 400 })
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'That email doesn&rsquo;t look right.' }, { status: 400 })
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    '',
    message,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? 'Brio Health <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO ?? site.email],
        reply_to: email,
        subject: `Website enquiry — ${name}`,
        text,
      }),
    })

    if (!response.ok) {
      console.error('[contact] resend rejected', response.status, await response.text())
      return NextResponse.json(
        { error: 'We could not send that. Please call us instead.' },
        { status: 502 },
      )
    }
  } catch (error) {
    console.error('[contact] send failed', error)
    return NextResponse.json(
      { error: 'We could not send that. Please call us instead.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
