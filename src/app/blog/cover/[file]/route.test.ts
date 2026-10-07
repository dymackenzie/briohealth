import { describe, expect, it } from 'vitest'

import { GET } from './route'

function get(file: string) {
  return GET(new Request(`https://yourbriohealth.com/blog/cover/${file}`), { params: Promise.resolve({ file }) })
}

describe('GET /blog/cover/[file]', () => {
  it('answers 404 for anything but a post id as .webp', async () => {
    for (const file of ['abc.webp', '12.png', '12345678.webp', '12.webp.png', '-1.webp', '.webp']) {
      expect((await get(file)).status).toBe(404)
    }
  })

  it('serves a small WebP, cached for a year', async () => {
    const res = await get('1234.webp')
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('image/webp')
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable')
    const bytes = Buffer.from(await res.arrayBuffer())
    expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF')
    expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP')
    expect(bytes.length).toBeLessThan(15_000)
  })
})
