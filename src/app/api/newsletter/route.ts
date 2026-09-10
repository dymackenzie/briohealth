import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { EMAIL_PATTERN } from '@/lib/site'

export async function POST(request: Request) {
  const key = process.env.MAILCHIMP_API_KEY
  const audience = process.env.MAILCHIMP_AUDIENCE_ID
  const prefix = process.env.MAILCHIMP_SERVER_PREFIX

  if (!key || !audience || !prefix) {
    console.error('[newsletter] Mailchimp env vars are not set')
    return NextResponse.json({ error: 'Not configured yet.' }, { status: 500 })
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase().slice(0, 200)
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
  }

  // Mailchimp keys member records by the MD5 of the lowercased address, so a
  // PUT is an upsert — resubscribing an existing address won't 400.
  const id = createHash('md5').update(email).digest('hex')
  const url = `https://${prefix}.api.mailchimp.com/3.0/lists/${audience}/members/${id}`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email, status_if_new: 'subscribed' }),
    })

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}))

      // Someone who previously unsubscribed has to opt back in themselves.
      if (detail.title === 'Member In Compliance State') {
        return NextResponse.json(
          { error: 'Please use the link in a previous email to resubscribe.' },
          { status: 400 },
        )
      }

      console.error('[newsletter] mailchimp rejected', response.status, detail.title)
      return NextResponse.json({ error: 'Could not subscribe right now.' }, { status: 502 })
    }
  } catch (error) {
    console.error('[newsletter] request failed', error)
    return NextResponse.json({ error: 'Could not subscribe right now.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, message: 'You’re on the list — thanks!' })
}
