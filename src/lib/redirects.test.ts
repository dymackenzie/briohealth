import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import nextConfig from '../../next.config'
import { blogRedirectFor, TOP_LEVEL_ROUTES } from './redirects'

describe('blogRedirectFor', () => {
  it('sends an unknown root slug to the blog', () => {
    expect(blogRedirectFor('/liver-detox-program')).toBe('/blog/liver-detox-program')
  })

  it('leaves real top-level routes alone', () => {
    for (const route of TOP_LEVEL_ROUTES) {
      expect(blogRedirectFor(`/${route}`)).toBeNull()
    }
  })

  it('leaves files alone: anything with a dot', () => {
    expect(blogRedirectFor('/robots.txt')).toBeNull()
    expect(blogRedirectFor('/brio-logo.svg')).toBeNull()
    expect(blogRedirectFor('/icon.png')).toBeNull()
  })

  it('leaves Next internals alone', () => {
    expect(blogRedirectFor('/_next')).toBeNull()
  })

  it('ignores the root and nested paths', () => {
    expect(blogRedirectFor('/')).toBeNull()
    expect(blogRedirectFor('/blog/some-post')).toBeNull()
  })

  it('tolerates a trailing slash', () => {
    expect(blogRedirectFor('/some-post/')).toBe('/blog/some-post')
  })

  it('keeps encoded characters as they are', () => {
    expect(blogRedirectFor('/caf%C3%A9-recipes')).toBe('/blog/caf%C3%A9-recipes')
  })
})

describe('TOP_LEVEL_ROUTES', () => {
  it('names every static top-level route folder in src/app', () => {
    const appDir = fileURLToPath(new URL('../app', import.meta.url))
    const folders = readdirSync(appDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !/^[[(_@]/.test(entry.name))
      .map((entry) => entry.name)

    expect(folders.length).toBeGreaterThan(0)
    for (const folder of folders) expect(TOP_LEVEL_ROUTES).toContain(folder)
  })

  it('names the CMS pages that src/app/[slug] serves', () => {
    expect(TOP_LEVEL_ROUTES).toContain('privacy-policy')
    expect(TOP_LEVEL_ROUTES).toContain('terms-of-use')
  })
})

describe('booking redirects', () => {
  it('lists new-patient as a route and keeps book only as a redirect source', () => {
    expect(TOP_LEVEL_ROUTES).toContain('new-patient')
    expect(blogRedirectFor('/new-patient')).toBeNull()
    expect(blogRedirectFor('/book')).toBeNull()
  })

  it('301s /book and /book-now to /new-patient in next.config', async () => {
    const redirects = await nextConfig.redirects!()
    expect(redirects).toContainEqual({ source: '/book', destination: '/new-patient', permanent: true })
    expect(redirects).toContainEqual({ source: '/book-now', destination: '/new-patient', permanent: true })
    expect(redirects.find((r) => r.destination === '/book')).toBeUndefined()
  })
})
