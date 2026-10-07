import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'

import { validateNewsletter } from '@/lib/forms'

export async function POST(request: Request) {
  const key = process.env.MAILCHIMP_API_KEY
  const audience = process.env.MAILCHIMP_AUDIENCE_ID
  const prefix = process.env.MAILCHIMP_SERVER_PREFIX

  // Not configured is a known state, not a crash: 503 with a sentence the
  // form can show.
  if (!key || !audience || !prefix) {
    console.error('[newsletter] Mailchimp env vars are not set')
    return NextResponse.json({ error: 'Sign-up is not set up yet.' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const result = validateNewsletter(body)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

  // Mailchimp keys members by the MD5 of the lowercased address, so a PUT is
  // an upsert and resubscribing an existing address does not 400.
  const id = createHash('md5').update(result.email).digest('hex')
  const url = `https://${prefix}.api.mailchimp.com/3.0/lists/${audience}/members/${id}`

  // API keys go through HTTP Basic auth as `anystring:key`: the username is
  // ignored and the key is the password. Bearer is for OAuth tokens only.
  const auth = `Basic ${Buffer.from(`brio:${key}`).toString('base64')}`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_address: result.email, status_if_new: 'subscribed' }),
    })

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}))
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

  return NextResponse.json({ ok: true, message: "You're on the list. Thanks." })
}
