import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { tags, wpFetchAll, wpFetchBySlug, wpFetchMany, wpFetchOne } from './client'

function jsonResponse(body: unknown, init: { status?: number; headers?: Record<string, string> } = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })
}

describe('wp client', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    fetchMock.mockReset()
  })

  it('returns an empty collection on a network error instead of throwing', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    await expect(wpFetchMany('wp/v2/posts')).resolves.toEqual({ items: [], total: 0, totalPages: 0 })
    expect(console.error).toHaveBeenCalled()
  })

  it('returns null on a network error for a single resource', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    await expect(wpFetchOne('brio/v1/settings')).resolves.toBeNull()
  })

  it('returns null on a non-200 and logs it', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ code: 'rest_no_route' }, { status: 500 }))
    await expect(wpFetchOne('brio/v1/settings')).resolves.toBeNull()
    expect(console.error).toHaveBeenCalled()
  })

  it('treats a 404 as null without logging an error', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 404 }))
    await expect(wpFetchOne('wp/v2/pages/999')).resolves.toBeNull()
    expect(console.error).not.toHaveBeenCalled()
  })

  it('returns an empty collection on malformed JSON', async () => {
    fetchMock.mockResolvedValue(new Response('<html>maintenance</html>', { status: 200 }))
    await expect(wpFetchMany('wp/v2/posts')).resolves.toEqual({ items: [], total: 0, totalPages: 0 })
  })

  it('reads totals from the headers', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse([{ id: 1 }], { headers: { 'x-wp-total': '418', 'x-wp-totalpages': '35' } }),
    )
    await expect(wpFetchMany('wp/v2/posts')).resolves.toEqual({ items: [{ id: 1 }], total: 418, totalPages: 35 })
  })

  it('builds the url from the wp-json root, the path and the query', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]))
    await wpFetchMany('wp/v2/posts', { query: { per_page: 12, page: 2, skip: undefined } })
    const url = new URL(fetchMock.mock.calls[0][0] as string)
    expect(url.pathname).toBe('/wp-json/wp/v2/posts')
    expect(url.searchParams.get('per_page')).toBe('12')
    expect(url.searchParams.get('page')).toBe('2')
    expect(url.searchParams.has('skip')).toBe(false)
  })

  it('looks a slug up through ?slug= and returns the first match', async () => {
    fetchMock.mockResolvedValue(jsonResponse([{ slug: 'hello' }]))
    await expect(wpFetchBySlug('wp/v2/posts', 'hello')).resolves.toEqual({ slug: 'hello' })
    const url = new URL(fetchMock.mock.calls[0][0] as string)
    expect(url.searchParams.get('slug')).toBe('hello')
    expect(url.searchParams.get('per_page')).toBe('1')
  })

  it('walks every page for wpFetchAll', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse([{ id: 1 }], { headers: { 'x-wp-totalpages': '2' } }))
      .mockResolvedValueOnce(jsonResponse([{ id: 2 }], { headers: { 'x-wp-totalpages': '2' } }))
    await expect(wpFetchAll('wp/v2/posts')).resolves.toEqual([{ id: 1 }, { id: 2 }])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('stops after the first page when the totalpages header is missing', async () => {
    fetchMock.mockResolvedValue(jsonResponse([{ id: 1 }]))
    await expect(wpFetchAll('wp/v2/posts')).resolves.toEqual([{ id: 1 }])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('stops early when a later page comes back empty', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse([{ id: 1 }], { headers: { 'x-wp-totalpages': '5' } }))
      .mockResolvedValueOnce(jsonResponse([]))
    await expect(wpFetchAll('wp/v2/posts')).resolves.toEqual([{ id: 1 }])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('exposes stable tag names', () => {
    expect(tags.posts).toBe('posts')
    expect(tags.post('x')).toBe('post:x')
    expect(tags.siteSettings).toBe('site-settings')
    expect(tags.typeSlug('service', 'acupuncture')).toBe('service:acupuncture')
  })
})
