import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { POST } from './route'

function post(body: unknown, ip: string) {
  return new Request('https://yourbriohealth.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_test'
    fetchMock.mockReset().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    delete process.env.RESEND_API_KEY
    vi.unstubAllGlobals()
  })

  it('sends the clinic a readable email with the message below a blank line', async () => {
    const res = await POST(
      post({ name: 'Ada\nLovelace', email: 'ada@example.com', phone: '', message: 'Hello there.' }, '10.0.0.1'),
    )
    expect(res.status).toBe(200)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    const sent = JSON.parse(init.body)
    expect(sent.subject).toBe('Website enquiry from Ada Lovelace')
    expect(sent.reply_to).toBe('ada@example.com')
    expect(sent.text).toBe('Name: Ada\nLovelace\nEmail: ada@example.com\n\nHello there.')
  })

  it('marks only a lesson topic in the subject; any other topic is a normal enquiry, not an error', async () => {
    const base = { name: 'Pat', email: 'pat@example.com', message: 'Two of us, beginners.' }
    const subjects: string[] = []
    for (const [i, topic] of ['lesson', 'other', 42, { x: 1 }, null].entries()) {
      const res = await POST(post({ ...base, topic }, `10.0.1.${i}`))
      expect(res.status).toBe(200)
      subjects.push(JSON.parse(fetchMock.mock.calls[i][1].body).subject)
    }
    expect(subjects).toEqual([
      'Pickleball lesson enquiry from Pat',
      'Website enquiry from Pat',
      'Website enquiry from Pat',
      'Website enquiry from Pat',
      'Website enquiry from Pat',
    ])
  })

  it('sends nothing for a honeypot hit but still answers ok', async () => {
    const res = await POST(
      post({ name: 'Bot', email: 'bot@example.com', message: 'Buy', website: 'http://spam.example' }, '10.0.0.2'),
    )
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
