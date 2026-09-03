import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 })
    }

    const apiKey = process.env.MAILCHIMP_API_KEY
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us21'

    if (!apiKey || !audienceId) {
      // No Mailchimp configured — just acknowledge
      return NextResponse.json({ message: 'Subscribed (dev mode)' })
    }

    const response = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      // Already subscribed is fine
      if (error.title === 'Member Exists') {
        return NextResponse.json({ message: 'Already subscribed' })
      }
      return NextResponse.json({ message: 'Subscription failed' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
