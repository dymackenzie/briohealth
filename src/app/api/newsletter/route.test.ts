import { createHash } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { POST } from './route'

const ENV = { MAILCHIMP_API_KEY: 'key-us7', MAILCHIMP_AUDIENCE_ID: 'aud123', MAILCHIMP_SERVER_PREFIX: 'us7' }

function post(body: unknown) {
  return new Request('https://yourbriohealth.com/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/newsletter', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    Object.assign(process.env, ENV)
    fetchMock.mockReset().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    for (const key of Object.keys(ENV)) delete process.env[key]
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('sends the API key through HTTP Basic auth to the prefixed data centre', async () => {
    const res = await POST(post({ email: 'Ada@Example.com' }))
    expect(res.status).toBe(200)

    const [url, init] = fetchMock.mock.calls[0]
    const id = createHash('md5').update('ada@example.com').digest('hex')
    expect(url).toBe(`https://us7.api.mailchimp.com/3.0/lists/aud123/members/${id}`)
    expect(init.headers.Authorization).toBe(`Basic ${Buffer.from('brio:key-us7').toString('base64')}`)
  })

  it.each(Object.keys(ENV))('answers with the fixed sentence, not a 500, when %s is missing', async (name) => {
    delete process.env[name]
    const res = await POST(post({ email: 'ada@example.com' }))
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ error: 'Sign-up is not set up yet.' })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
