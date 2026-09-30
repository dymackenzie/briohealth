import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))

import { revalidateTag } from 'next/cache'
import { POST } from './route'

function post(body: unknown, secret?: string) {
  return new Request('https://yourbriohealth.com/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(secret ? { 'x-revalidate-secret': secret } : {}) },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    process.env.WP_REVALIDATE_SECRET = 'shh'
    vi.mocked(revalidateTag).mockClear()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    delete process.env.WP_REVALIDATE_SECRET
    vi.restoreAllMocks()
  })

  it('rejects a missing secret with 401 and busts nothing', async () => {
    const res = await POST(post({ post_type: 'post', slug: 'x' }))
    expect(res.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('rejects a wrong secret', async () => {
    const res = await POST(post({ post_type: 'post', slug: 'x' }, 'nope'))
    expect(res.status).toBe(401)
  })

  it('returns 500 when the secret is not configured', async () => {
    delete process.env.WP_REVALIDATE_SECRET
    const res = await POST(post({ post_type: 'post' }, 'shh'))
    expect(res.status).toBe(500)
  })

  it('rejects invalid JSON with 400', async () => {
    const res = await POST(post('{not json', 'shh'))
    expect(res.status).toBe(400)
  })

  it('rejects a JSON body that is not an object with 400, not a crash', async () => {
    expect((await POST(post('null', 'shh'))).status).toBe(400)
    expect((await POST(post('"post"', 'shh'))).status).toBe(400)
  })

  it('rejects a payload without post_type', async () => {
    const res = await POST(post({ slug: 'x' }, 'shh'))
    expect(res.status).toBe(400)
  })

  it('busts the post tags with the two-argument form', async () => {
    const res = await POST(post({ post_type: 'post', slug: 'hello' }, 'shh'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ revalidated: ['posts', 'categories', 'post:hello'] })
    expect(revalidateTag).toHaveBeenCalledWith('posts', 'max')
    expect(revalidateTag).toHaveBeenCalledWith('post:hello', 'max')
  })

  it('busts site settings for the options page', async () => {
    const res = await POST(post({ post_type: 'site-settings', slug: null }, 'shh'))
    expect(await res.json()).toEqual({ revalidated: ['site-settings'] })
  })

  it('maps an unknown custom type to type and type:slug tags', async () => {
    const res = await POST(post({ post_type: 'service', slug: 'acupuncture' }, 'shh'))
    expect(await res.json()).toEqual({ revalidated: ['service', 'service:acupuncture'] })
  })

  it('copes with a missing slug on a custom type', async () => {
    const res = await POST(post({ post_type: 'faq' }, 'shh'))
    expect(await res.json()).toEqual({ revalidated: ['faq'] })
  })
})
