import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { WP_UPLOADS_URL } from '@/lib/wp/client'

import { GET } from './route'

const VTT = 'WEBVTT\n\n00:00.000 --> 00:02.000\nWelcome to Brio Health.\n'

function get(path: string[]) {
  return GET(new Request(`https://yourbriohealth.com/api/captions/${path.join('/')}`), { params: Promise.resolve({ path }) })
}

describe('GET /api/captions/[...path]', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue(new Response(VTT, { status: 200, headers: { 'Content-Type': 'text/plain' } }))
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('serves the media library file as text/vtt on this origin, cached', async () => {
    const res = await get(['2026', '10', 'naturopathic.vtt'])
    expect(res.status).toBe(200)
    expect(fetchMock.mock.calls[0][0]).toBe(`${WP_UPLOADS_URL}/2026/10/naturopathic.vtt`)
    expect(res.headers.get('Content-Type')).toBe('text/vtt; charset=utf-8')
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=')
    expect(await res.text()).toBe(VTT)
  })

  it('fetches nothing for a path that is not a .vtt under uploads', async () => {
    expect((await get(['2026', '10', 'naturopathic.mp4'])).status).toBe(404)
    expect((await get(['..', 'wp-config.vtt'])).status).toBe(404)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('answers 404 when the file is missing and 502 when the host is down', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 404 }))
    expect((await get(['gone.vtt'])).status).toBe(404)
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'))
    expect((await get(['down.vtt'])).status).toBe(502)
  })
})
