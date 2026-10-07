import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { site } from '@/lib/site'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  const html = renderToStaticMarkup(<TopBar settings={site} />)
  const phone = html.match(/<a [^>]*href="tel:[^"]*"[^>]*>/)?.[0] ?? ''

  it('gives the phone link a 44px, full-width tap target on phones', () => {
    expect(phone).toMatch(/\bmin-h-11\b/)
    expect(phone).toMatch(/\bw-full\b/)
  })

  it('keeps the desktop strip thin, with the link at its own size', () => {
    expect(html).toMatch(/\bmd:h-9\b/)
    expect(phone).toMatch(/\bmd:min-h-0\b/)
    expect(phone).toMatch(/\bmd:w-auto\b/)
  })
})
