import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { decodeTitle, paragraphsOf, plainExcerpt, postSummary, renderContent, showsImage } from './renderContent'

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

  describe('dead Drupal-era images', () => {
    const DEAD = 'http://www.yourbriohealth.com/sites/yourbriohealth.com/files/u6/fruits.jpg'

    it('removes a bare dead image, whatever the scheme or host form', () => {
      expect(render(`<img src="${DEAD}" alt="">`)).toBe('')
      expect(render('<img src="https://yourbriohealth.com/sites/yourbriohealth.com/files/a.jpg" alt="">')).toBe('')
      expect(render('<img src="/sites/yourbriohealth.com/files/a b.jpg" alt="">')).toBe('')
    })

    it('removes the paragraph a dead image leaves empty', () => {
      expect(render(`<p><img src="${DEAD}" alt=""></p><p>Kept</p>`)).toBe('<p>Kept</p>')
    })

    it('removes a link left with nothing in it, but keeps a link with text', () => {
      expect(render(`<p>See <a href="${DEAD}"><img src="${DEAD}" alt=""></a></p>`)).toBe('<p>See </p>')
      expect(render(`<a href="${DEAD}"><img src="${DEAD}" alt="">Fruit chart</a>`)).toBe(`<a href="${DEAD}">Fruit chart</a>`)
    })

    it('keeps the word space an emptied inline element was carrying', () => {
      expect(render('<p>According to<a href="https://a.b/"> </a><a href="https://a.b/">Chiff</a></p>')).toBe(
        '<p>According to <a href="https://a.b/">Chiff</a></p>',
      )
      expect(render('<p>Hello<span> </span>world</p>')).toBe('<p>Hello world</p>')
    })

    it('keeps an empty anchor that is a link target', () => {
      expect(render('<a id="top"></a><p>Body</p>')).toBe('<a id="top"></a><p>Body</p>')
    })

    it('leaves a live wp-content image alone', () => {
      const out = render('<p><img src="https://yourbriohealth.com/wp-content/uploads/a.jpg" alt="A"></p>')
      expect(out).toContain('src="https://yourbriohealth.com/wp-content/uploads/a.jpg"')
    })
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

  describe('embeds', () => {
    it('drops an iframe from a host that is not a known player, and the paragraph it leaves empty', () => {
      const out = render('<p><iframe src="https://evil.example/embed/x" title="x"></iframe></p><p>After.</p>')
      expect(out).toBe('<p>After.</p>')
    })

    it('drops an iframe with a javascript, data, relative or missing src', () => {
      for (const src of ['javascript:alert(1)', 'data:text/html,<b>x</b>', '/embed/x', '']) {
        expect(render(`<iframe src="${src}"></iframe>`)).toBe('')
      }
      expect(render('<iframe title="no src"></iframe>')).toBe('')
    })

    it('does not accept a player name inside another host', () => {
      expect(render('<iframe src="https://www.youtube.com.evil.example/embed/x"></iframe>')).toBe('')
      expect(render('<iframe src="https://www.google.com/search?q=maps"></iframe>')).toBe('')
    })

    it('keeps YouTube, Vimeo and Google Maps embeds, over https', () => {
      expect(render('<iframe src="//www.youtube.com/embed/x"></iframe>')).toBe(
        '<iframe src="https://www.youtube.com/embed/x"></iframe>',
      )
      expect(render('<iframe src="http://www.youtube-nocookie.com/embed/x"></iframe>')).toBe(
        '<iframe src="https://www.youtube-nocookie.com/embed/x"></iframe>',
      )
      expect(render('<iframe src="https://player.vimeo.com/video/1"></iframe>')).toContain('player.vimeo.com/video/1')
      expect(render('<iframe src="https://www.google.com/maps/embed?pb=1"></iframe>')).toContain(
        'https://www.google.com/maps/embed?pb=1',
      )
    })

    it('drops the allow attribute', () => {
      const out = render('<iframe src="https://www.youtube.com/embed/x" allow="camera; payment; autoplay"></iframe>')
      expect(out).toBe('<iframe src="https://www.youtube.com/embed/x"></iframe>')
    })
  })

  it('points uploads at our host over https', () => {
    const out = render(
      '<p><img src="http://yourbriohealth.com/wp-content/uploads/a.jpg" alt="A"><a href="http://www.yourbriohealth.com/wp-content/uploads/b.pdf">PDF</a></p>',
    )
    expect(out).toContain('src="https://yourbriohealth.com/wp-content/uploads/a.jpg"')
    expect(out).toContain('href="https://yourbriohealth.com/wp-content/uploads/b.pdf"')
    expect(out).not.toContain('http://')
  })

  it('leaves another site that mentions our uploads in its query alone', () => {
    const out = render('<p><a href="http://other.example/?u=//yourbriohealth.com/wp-content/a.jpg">x</a></p>')
    expect(out).toContain('href="http://other.example/?u=//yourbriohealth.com/wp-content/a.jpg"')
  })

  it('protocol-checks the video poster', () => {
    const bad = render('<video controls poster="javascript:alert(1)"><source src="/v.mp4"></video>')
    expect(bad).not.toContain('poster')
    const good = render('<video controls poster="http://yourbriohealth.com/wp-content/p.jpg"></video>')
    expect(good).toContain('poster="https://yourbriohealth.com/wp-content/p.jpg"')
  })

  it('sanitises event handlers and javascript urls', () => {
    const out = render('<a href="javascript:alert(1)" onclick="x()">x</a><img src="https://a.b/c.jpg" onerror="x()">')
    expect(out).not.toContain('onclick')
    expect(out).not.toContain('onerror')
    expect(out).not.toContain('javascript:')
  })
})

describe('renderContent title option', () => {
  const page = '<div class="fusion-title"><h1>Privacy Policy</h1></div><p>This website.</p><h2>Your Consent</h2>'

  it('drops a leading heading that repeats the title, and only that', () => {
    const out = renderToStaticMarkup(<>{renderContent(page, { title: ' privacy policy ' })}</>)
    expect(out).toBe('<p>This website.</p><h2>Your Consent</h2>')
    const kept = renderToStaticMarkup(<>{renderContent(page, { title: 'Your Consent' })}</>)
    expect(kept).toBe('<h2>Privacy Policy</h2><p>This website.</p><h2>Your Consent</h2>')
  })
})

describe('paragraphsOf', () => {
  it('returns each paragraph once, whitespace collapsed, entities decoded', () => {
    const html = '<p>Hello,  my name\n is Jeff &amp; I</p><p>Second.</p><p>Hello, my name is Jeff &amp; I</p><p> </p>'
    expect(paragraphsOf(html)).toEqual(['Hello, my name is Jeff & I', 'Second.'])
  })

  it('drops inline tags, as in the bold openings of the service pages', () => {
    const html = '<p><strong>Acupuncture can help.</strong> Our modern day lifestyle &amp; “Fight or Flight” mode.</p>'
    expect(paragraphsOf(html)).toEqual(['Acupuncture can help. Our modern day lifestyle & “Fight or Flight” mode.'])
  })

  it("skips Avada's mobile-only copy of a row", () => {
    const html =
      '<p><div class="fusion-fullwidth fusion-no-small-visibility"><p>Desktop words.</p></div></p>' +
      '<div class="fusion-fullwidth fusion-no-large-visibility"><p>Mobile words.</p></div><p>After.</p>'
    expect(paragraphsOf(html)).toEqual(['Desktop words.', 'After.'])
  })

  it('returns nothing for empty input', () => {
    expect(paragraphsOf('')).toEqual([])
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

describe('plainExcerpt and the WordPress "[…]" marker', () => {
  it('replaces the marker with an ellipsis on the last whole word', () => {
    expect(plainExcerpt('<p>Our November recipe is a warming [&hellip;]</p>')).toBe(
      'Our November recipe is a warming…',
    )
    expect(plainExcerpt('<p>Our November recipe [...]</p>')).toBe('Our November recipe…')
    expect(plainExcerpt('<p>Rest, eat well, [&hellip;]</p>')).toBe('Rest, eat well…')
  })

  it('adds nothing after a sentence that already ends', () => {
    expect(plainExcerpt('<p>Rest well. [&hellip;]</p>')).toBe('Rest well.')
  })

  it('strips it before a continue-reading link, and before clipping', () => {
    expect(plainExcerpt('<p>Eat well [&hellip;] <a class="more-link">Continue reading Eat</a></p>')).toBe('Eat well…')

    const long = plainExcerpt('<p>' + 'word '.repeat(80) + '[&hellip;]</p>', 50)
    expect(long).not.toContain('[')
    expect(long.endsWith('word…')).toBe(true)
    expect(long.length).toBeLessThanOrEqual(51)
  })

  it('is empty when the excerpt was only the marker', () => {
    expect(plainExcerpt('<p>[&hellip;]</p>')).toBe('')
    expect(plainExcerpt(' [...] ')).toBe('')
  })

  it('leaves a bracketed ellipsis inside the text alone', () => {
    expect(plainExcerpt('<p>He said [&hellip;] then left.</p>')).toBe('He said […] then left.')
  })
})

describe('decodeTitle', () => {
  it('decodes entities and strips tags', () => {
    expect(decodeTitle('Fall &#8211; the <em>best</em> season')).toBe('Fall \u2013 the best season')
    expect(decodeTitle('Q &amp; A')).toBe('Q & A')
  })
})

describe('postSummary', () => {
  const rendered = (value: string) => ({ rendered: value })

  it('uses the excerpt when WordPress has one', () => {
    const post = {
      title: rendered('Bone broth'),
      excerpt: rendered('<p>Our November recipe [&hellip;]</p>'),
      content: rendered('<p>Something else entirely.</p>'),
    }
    expect(postSummary(post)).toBe('Our November recipe\u2026')
  })

  it('falls back to the body when the excerpt is only the WordPress marker', () => {
    const post = {
      title: rendered('Bone broth'),
      excerpt: rendered('<p> [&hellip;]</p>'),
      content: rendered('<p>Broth is the base of every soup.</p>'),
    }
    expect(postSummary(post)).toBe('Broth is the base of every soup.')
  })

  it('falls back to the opening paragraphs when the excerpt is empty', () => {
    const post = {
      title: rendered('The Autumn Reset'),
      excerpt: rendered(''),
      content: rendered(
        '<div class="fusion-text"><style>.x{color:red}</style><p><strong>The Autumn Reset</strong></p><p>September has a way of making us want to reset.</p><p>Summer schedules shift.</p></div>',
      ),
    }
    expect(postSummary(post)).toBe('September has a way of making us want to reset. Summer schedules shift.')
  })

  it('clips the fallback on a word boundary', () => {
    const post = { title: rendered('T'), excerpt: rendered(''), content: rendered('<p>' + 'word '.repeat(80) + '</p>') }
    const text = postSummary(post, 50)
    expect(text.length).toBeLessThanOrEqual(51)
    expect(text.endsWith('\u2026')).toBe(true)
  })

  it('is empty without an excerpt or content', () => {
    expect(postSummary({ title: rendered('T'), excerpt: rendered('') })).toBe('')
  })
})

describe('showsImage', () => {
  const featured = 'https://yourbriohealth.com/wp-content/uploads/2014/12/bone-broth.jpg'

  it('finds the same upload in the body', () => {
    expect(showsImage('<p><img src="https://yourbriohealth.com/wp-content/uploads/2014/12/bone-broth.jpg"></p>', featured)).toBe(true)
  })

  it('finds it at another WordPress size', () => {
    expect(showsImage('<img data-orig-src="/wp-content/uploads/2014/12/bone-broth-300x200.jpg">', featured)).toBe(true)
    expect(
      showsImage('<img src="/uploads/2023/03/snacks-1024x683.jpeg">', 'https://x.test/uploads/2023/03/snacks-scaled.jpeg'),
    ).toBe(true)
  })

  it('does not match a different file that shares a prefix', () => {
    expect(showsImage('<img src="/uploads/bone-broth-soup.jpg">', featured)).toBe(false)
    expect(showsImage('<p>No images at all.</p>', featured)).toBe(false)
  })
})

describe('leftover Avada shortcodes', () => {
  const opener = '[tagline_box backgroundcolor=&#8221;&#8221; shadow=&#8221;no&#8221; title=&#8221;Healthy Popsicles&#8221;]'

  it('drops the tags from the body and keeps the words inside', () => {
    const html = renderToStaticMarkup(
      <>{renderContent(`<p>Intro.</p>${opener}<p>2 cups almond milk</p><p>Kyra, RHN[/tagline_box]</p>`)}</>,
    )
    expect(html).not.toContain('tagline_box')
    expect(html).toContain('<p>2 cups almond milk</p>')
    expect(html).toContain('<p>Kyra, RHN</p>')
  })

  it('leaves a bracketed word in prose alone', () => {
    const html = renderToStaticMarkup(<>{renderContent('<p>He said [sic] twice.</p>')}</>)
    expect(html).toContain('[sic]')
  })

  it('empties an excerpt that WordPress cut off inside a shortcode', () => {
    expect(plainExcerpt(`<p>[tagline_box backgroundcolor=&#8221;&#8221; link=&#8221;&#8221; [&hellip;]</p>`)).toBe('')
    expect(plainExcerpt(`<p>[tagline_box backgroundcolor=&#8221;&#8221; link=&#8221;</p>`)).toBe('')
  })

  it('keeps them out of the summary fallback', () => {
    const post = {
      title: { rendered: 'Popsicles' },
      excerpt: { rendered: `<p>${opener}</p>` },
      content: { rendered: `<p>${opener}</p><p>With this heat wave, I wanted something cold.</p>` },
    }
    expect(postSummary(post)).toBe('With this heat wave, I wanted something cold.')
  })
})

describe('[youtube] shortcodes', () => {
  const render = (html: string) => renderToStaticMarkup(<>{renderContent(html)}</>)
  const embed = 'src="https://www.youtube-nocookie.com/embed/mYhjmq7-1q8"'

  it('turns the bare-id form from the corpus into an embed, and strips its neighbours', () => {
    // As the low-level laser post has it: wptexturize's curly quotes, a separator first.
    const html = render(
      '<p>Watch our new video.</p>[separator style_type=&#8221;none&#8221; top_margin=&#8221;15&#8243;][youtube id=&#8221;mYhjmq7-1q8&#8243; width=&#8221;600&#8243; height=&#8221;350&#8243; autoplay=&#8221;no&#8221; api_params=&#8221;&#8221; class=&#8221;&#8221;]',
    )
    expect(html).toContain(embed)
    expect(html).toContain('title="YouTube video"')
    expect(html).toContain('loading="lazy"')
    expect(html).toContain('allowFullScreen=""')
    expect(html).toContain('<span class="video-embed"><iframe')
    expect(html).not.toMatch(/\[|separator|youtube id/)
  })

  it('takes a positional id', () => {
    expect(render('<p>[youtube mYhjmq7-1q8]</p>')).toContain(embed)
  })

  it('takes a URL', () => {
    expect(render('<p>[youtube https://www.youtube.com/watch?v=mYhjmq7-1q8&amp;t=10]</p>')).toContain(embed)
    expect(render('<p>[youtube url=&#8221;https://youtu.be/mYhjmq7-1q8&#8243;]</p>')).toContain(embed)
  })

  it('strips a youtube shortcode it cannot read an id from', () => {
    const html = render('<p>Before [youtube width=&#8221;600&#8243; height=&#8221;350&#8243;] after</p><p>[youtube]</p>')
    expect(html).not.toContain('<iframe')
    expect(html).not.toContain('youtube')
    expect(html).toContain('Before  after')
  })

  it('leaves a shortcode in a code block as text', () => {
    const html = render('<pre><code>[youtube id="mYhjmq7-1q8"]</code></pre>')
    expect(html).not.toContain('<iframe')
    expect(html).toContain('[youtube id=&quot;mYhjmq7-1q8&quot;]')
  })
})
