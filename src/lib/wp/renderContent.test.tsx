import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { decodeTitle, plainExcerpt, renderContent } from './renderContent'

function render(html: string) {
  return renderToStaticMarkup(<>{renderContent(html)}</>)
}

const GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

describe('renderContent', () => {
  it('returns null for empty input', () => {
    expect(renderContent('')).toBeNull()
    expect(renderContent('   \n')).toBeNull()
  })

  it('keeps a classic archived post intact', () => {
    const html = '<div class="brio_archived_post"><h2>Sleep</h2><p>Go to <a href="https://example.com">bed</a>.</p><ul><li>One</li></ul></div>'
    const out = render(html)
    expect(out).toContain('<h2>Sleep</h2>')
    expect(out).toContain('<a href="https://example.com">bed</a>')
    expect(out).toContain('<li>One</li>')
  })

  it('promotes data-orig-src on Fusion lazy images and drops srcset', () => {
    const html = `<img class="lazyload" src="${GIF}" data-orig-src="https://yourbriohealth.com/wp-content/uploads/a.jpg" srcset="x 1x" sizes="100vw" alt="A">`
    const out = render(html)
    expect(out).toContain('src="https://yourbriohealth.com/wp-content/uploads/a.jpg"')
    expect(out).not.toContain('data:image')
    expect(out).not.toContain('srcset')
    expect(out).toContain('loading="lazy"')
  })

  it('drops a spacer image that has only a data: src', () => {
    expect(render(`<p><img src="${GIF}" alt=""></p>`)).toBe('')
  })

  it('flattens Fusion wrappers and strips fusion classes and awb styles', () => {
    const html =
      '<div class="fusion-fullwidth" style="--awb-padding-top:10px"><div class="fusion-builder-row fusion-row"><div class="fusion-layout-column"><div class="fusion-text"><p class="fusion-x keep">Hello</p></div></div></div></div>'
    const out = render(html)
    expect(out).toBe('<p class="keep">Hello</p>')
  })

  it('keeps classes on headings and lists instead of emptying them', () => {
    const html = '<h2 class="fusion-title-heading title-heading-left">T</h2><ul class="checklist"><li class="done">x</li></ul>'
    expect(render(html)).toBe('<h2 class="title-heading-left">T</h2><ul class="checklist"><li class="done">x</li></ul>')
  })

  it('demotes an in-body h1 to h2', () => {
    expect(render('<h1>Title</h1>')).toBe('<h2>Title</h2>')
  })

  it('removes style, script and form elements with their contents', () => {
    const html = '<style>.x{}</style><script>alert(1)</script><form><input type="checkbox"></form><p>Body</p>'
    expect(render(html)).toBe('<p>Body</p>')
  })

  it("drops Avada's hidden rich-snippet spans", () => {
    const html = '<p>Q?</p><span class="rich-snippet-hidden">admin 2024-01-01</span>'
    expect(render(html)).toBe('<p>Q?</p>')
  })

  it('drops wrappers left empty', () => {
    expect(render('<div><p>  </p><span></span></div><p>Kept</p>')).toBe('<p>Kept</p>')
  })

  it('keeps in-post anchors and their targets matching', () => {
    const out = render('<p><a href="#intro">Jump</a></p><h2 id="intro">Intro</h2>')
    expect(out).toContain('<a href="#intro">Jump</a>')
    expect(out).toContain('<h2 id="intro">Intro</h2>')
  })

  it('keeps YouTube iframes and self-hosted video', () => {
    const html = '<iframe src="https://www.youtube.com/embed/x" title="v"></iframe><video controls><source src="/v.mp4" type="video/mp4"></video>'
    const out = render(html)
    expect(out).toContain('<iframe src="https://www.youtube.com/embed/x" title="v"></iframe>')
    expect(out).toContain('<video controls=""')
  })

  it('turns legacy embed and table attributes into props React accepts', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const out = render(
        '<iframe src="https://www.youtube.com/embed/x" allowfullscreen="true"></iframe><table><tbody><tr><td valign="top"><img src="https://a.b/c.jpg" hspace="5" alt="">x</td></tr></tbody></table>',
      )
      expect(errors).not.toHaveBeenCalled()
      expect(out).toContain('allowFullScreen=""')
      expect(out).not.toMatch(/valign|hspace/i)
    } finally {
      errors.mockRestore()
    }
  })

  it('sanitises event handlers and javascript urls', () => {
    const out = render('<a href="javascript:alert(1)" onclick="x()">x</a><img src="https://a.b/c.jpg" onerror="x()">')
    expect(out).not.toContain('onclick')
    expect(out).not.toContain('onerror')
    expect(out).not.toContain('javascript:')
  })
})

describe('plainExcerpt', () => {
  it('strips tags, decodes entities and removes the continue-reading tail', () => {
    const html = '<p>Eat &quot;real&quot; food &amp; rest. <a class="more-link">Continue reading Eat well</a></p>'
    expect(plainExcerpt(html)).toBe('Eat "real" food & rest.')
  })

  it('cuts on a word boundary and adds an ellipsis', () => {
    const text = plainExcerpt('<p>' + 'word '.repeat(80) + '</p>', 50)
    expect(text.length).toBeLessThanOrEqual(51)
    expect(text.endsWith('\u2026')).toBe(true)
    expect(text).not.toMatch(/\s\u2026$/)
  })
})

describe('decodeTitle', () => {
  it('decodes entities and strips tags', () => {
    expect(decodeTitle('Fall &#8211; the <em>best</em> season')).toBe('Fall \u2013 the best season')
    expect(decodeTitle('Q &amp; A')).toBe('Q & A')
  })
})
