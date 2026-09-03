import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, _hp } = await req.json()

    // Honeypot
    if (_hp) return NextResponse.json({ message: 'ok' })

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      // No Resend configured — just acknowledge
      console.log('Contact form submission:', { name, email, phone, message })
      return NextResponse.json({ message: 'Message received (dev mode)' })
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Brio Health Website <noreply@yourbriohealth.com>',
        to: ['info@yourbriohealth.com'],
        reply_to: email,
        subject: `New contact form message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'Not provided'}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Message sent successfully' })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
