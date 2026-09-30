// The docs call it unstable_doesProxyMatch; 16.2 still ships the middleware name.
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { config, proxy } from './proxy'

describe('proxy', () => {
  it('301s an old post permalink to /blog and keeps the query string', () => {
    const res = proxy(new NextRequest('https://yourbriohealth.com/some-post?utm_source=newsletter'))
    expect(res.status).toBe(301)
    expect(res.headers.get('location')).toBe('https://yourbriohealth.com/blog/some-post?utm_source=newsletter')
  })

  it('passes a real route through', () => {
    for (const path of ['/about', '/services', '/contact', '/privacy-policy']) {
      const res = proxy(new NextRequest(`https://yourbriohealth.com${path}`))
      expect(res.status).toBe(200)
      expect(res.headers.get('location')).toBeNull()
    }
  })

  it('only runs on single-segment paths', () => {
    const matches = (url: string) => unstable_doesMiddlewareMatch({ config, url })
    expect(matches('/some-post')).toBe(true)
    expect(matches('/')).toBe(false)
    expect(matches('/blog/some-post')).toBe(false)
    expect(matches('/_next/static/chunks/app.js')).toBe(false)
  })
})
