import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import rehypeParse from 'rehype-parse'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { unified } from 'unified'
import { SKIP, visit } from 'unist-util-visit'
import type { Element, ElementContent, Root } from 'hast'

import { WP_HOST } from './client'
import type { Rendered } from './types'

/**
 * Turns WordPress post HTML into React.
 *
 * Two shapes come out of this install. Older posts (2009-2023, the bulk) are
 * clean classic HTML inside <div class="brio_archived_post">. Newer ones are
 * Avada/Fusion builder markup: nested layout divs, fusion-* classes, --awb-*
 * inline styles, with the real content buried inside. This flattens the
 * second into the first, then sanitises.
 */

/** An upload on the WordPress install, with or without www or a scheme. */
const WP_UPLOADS = /^(?:https?:)?\/\/(?:www\.)?yourbriohealth\.com\/wp-content\//i

/** Layout-only wrappers. Their children get lifted; the div goes. */
const FUSION_WRAPPERS = [
  'fusion-fullwidth',
  'fusion-builder-row',
  'fusion-row',
  'fusion-layout-column',
  'fusion-column-wrapper',
  'fusion-flex-container',
  'fusion-content-boxes',
  'fusion-separator',
  'fusion-title',
  'fusion-text',
  'fusion-builder-module-element',
]

/** Removed with their contents. rehype-sanitize would keep the text inside. */
const NOISE = new Set(['style', 'script', 'noscript', 'link', 'meta', 'form'])

/** Avada's schema.org spans, hidden by CSS we no longer ship. */
const HIDDEN = ['rich-snippet-hidden', 'screen-reader-text', 'fusion-meta-hidden']

/**
 * Uploads from the pre-WordPress Drupal site. The files are gone (404 on the
 * live site too), so an image pointing there would only be a broken icon.
 */
const DEAD_MEDIA = /\/sites\/yourbriohealth\.com\/files\//i

/** Wrappers that mean nothing once they have nothing in them. */
const DROP_WHEN_EMPTY = new Set(['div', 'p', 'span', 'a'])
const INLINE = new Set(['span', 'a'])

function classes(node: Element): string[] {
  const value: unknown = node.properties?.className
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') return value.split(/\s+/)
  return []
}

function isFusionWrapper(node: Element): boolean {
  if (node.tagName !== 'div' && node.tagName !== 'span') return false
  return classes(node).some((c) => FUSION_WRAPPERS.some((w) => c.startsWith(w)))
}

function isNoise(el: Element): boolean {
  if (NOISE.has(el.tagName)) return true
  if (classes(el).some((c) => HIDDEN.includes(c))) return true

  if (el.tagName !== 'img') return false
  const src = el.properties.dataOrigSrc || el.properties.src

  // A spacer GIF with nothing lazy-loaded behind it.
  if (typeof src !== 'string' || src === '' || src.startsWith('data:')) return true
  return DEAD_MEDIA.test(src)
}

function dropNoise() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return
      if (isNoise(node)) {
        parent.children.splice(index, 1)
        // Siblings slide into the gap; revisit the same index.
        return index
      }
    })
  }
}

function unwrapFusion() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return
      if (!isFusionWrapper(node)) return
      parent.children.splice(index, 1, ...node.children)
      return index
    })
  }
}

/**
 * Uploads point at wherever the API lives, always over https: a 2010 post
 * links its images as http://, which would be mixed content on this site.
 */
function rewriteHost(url: string): string {
  return url.replace(WP_UPLOADS, `https://${WP_HOST}/wp-content/`)
}

/** The players the clinic's posts embed. Every other iframe goes. */
const EMBED_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
])

/** The embed's URL over https, or null when it is not from a known player. */
function embedSrc(src: unknown): string | null {
  if (typeof src !== 'string' || !src.trim()) return null
  let url: URL
  try {
    // A protocol-relative src ("//www.youtube.com/...") resolves to https.
    url = new URL(src.trim(), 'https://relative.invalid')
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null

  const map = (url.hostname === 'www.google.com' || url.hostname === 'google.com') && url.pathname.startsWith('/maps')
  if (!EMBED_HOSTS.has(url.hostname) && !map) return null

  url.protocol = 'https:'
  return url.href
}

/** Runs after convertShortcodes, so the embeds it makes are vetted too. */
function vetEmbeds() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'iframe' || !parent || index === undefined) return
      const src = embedSrc(node.properties.src)
      if (!src) {
        parent.children.splice(index, 1)
        return index
      }
      node.properties.src = src
    })
  }
}

function cleanAttributes() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const props = node.properties

      // Avada puts the page title in the body as an h1; the page has one.
      if (node.tagName === 'h1') node.tagName = 'h2'

      if (typeof props.style === 'string' && props.style.includes('--awb-')) {
        delete props.style
      }

      const kept = classes(node).filter((c) => c && !c.startsWith('fusion-') && !c.startsWith('awb-'))
      if (kept.length) props.className = kept
      else delete props.className

      if (node.tagName === 'img') {
        // Fusion's lazyloader: base64 GIF in src, real URL in data-orig-src.
        if (typeof props.dataOrigSrc === 'string' && props.dataOrigSrc) {
          props.src = props.dataOrigSrc
        }
        delete props.dataOrigSrc
        delete props.srcSet
        delete props.sizes
        props.loading = 'lazy'
        props.decoding = 'async'
      }

      // An embed code's width and height only ever force a box; the prose
      // styles size iframes at the column's width and 16/9. Images and video
      // keep theirs: they reserve the box before the file arrives.
      if (node.tagName === 'iframe') {
        delete props.width
        delete props.height
      }

      // Embed codes write allowfullscreen="true", which parses as the string
      // "true"; presence is what the attribute means, so make it a boolean.
      if (props.allowFullScreen !== undefined) props.allowFullScreen = true

      // Table and image layout hints from the 2010s. The default allowlist
      // keeps them, React doesn't know them, and the prose styles set layout.
      delete props.vAlign
      delete props.hSpace

      if (typeof props.src === 'string') props.src = rewriteHost(props.src)
      if (typeof props.href === 'string') props.href = rewriteHost(props.href)
      if (typeof props.poster === 'string') props.poster = rewriteHost(props.poster)
    })
  }
}

function hasContent(node: Element): boolean {
  // An empty <a id> or <a name> is a jump target, not an empty link.
  if (node.tagName === 'a' && (node.properties.id || node.properties.name)) return true
  // trim() strips U+00A0 too, so a `&nbsp;` spacer counts as empty
  return node.children.some(
    (c) => (c.type === 'text' && c.value.trim() !== '') || (c.type === 'element' && c.tagName !== 'br'),
  )
}

/**
 * Children first, so a div holding only an empty p is itself empty by the
 * time it is checked.
 */
function pruneEmpty(parent: Root | Element) {
  for (let i = parent.children.length - 1; i >= 0; i--) {
    const child = parent.children[i]
    if (child.type !== 'element') continue
    pruneEmpty(child)
    if (!DROP_WHEN_EMPTY.has(child.tagName) || hasContent(child)) continue

    // "According to<a> </a><a>Chiff.com</a>": the empty inline element was
    // the only space between two words, so leave the space behind.
    const spaced = INLINE.has(child.tagName) && child.children.some((c) => c.type === 'text' && c.value !== '')
    if (spaced) parent.children.splice(i, 1, { type: 'text', value: ' ' })
    else parent.children.splice(i, 1)
  }
}

function dropEmpty() {
  return (tree: Root) => {
    pruneEmpty(tree)
  }
}

/**
 * Avada shortcodes from 2016-2017 posts whose plugin no longer renders them,
 * left in the body as text: `[tagline_box shadow="no" ...]` around a recipe,
 * `[/tagline_box]` after it. Only a tag with attributes or a closing tag
 * goes, so a bracketed word in prose ("[sic]") stays. The words inside are
 * kept; the markup around them was only ever styling.
 */
const SHORTCODE = /\[(?:[a-z][\w-]*\s+[\w-]+=[^\]]*|\/[a-z][\w-]*)\]/gi

/** An excerpt cut off by WordPress partway through an opening tag. */
const CUT_SHORTCODE = /\[[a-z][\w-]*\s+[\w-]+=[^\]]*$/i

function stripShortcodes(text: string): string {
  return text.replace(SHORTCODE, '')
}

/**
 * Avada's `[youtube id=”…″ width=”600″]` (one 2010s post; the quotes are
 * wptexturize's curly ones). It becomes a real embed rather than going with
 * the rest, so the post keeps its video. Also reads a URL or a positional id.
 */
const YOUTUBE = /\[youtube\b([^\]]*)\]/gi
const VIDEO_ID = '([\\w-]{11})(?![\\w-])'
const ID_FORMS = [
  new RegExp(`(?:youtu\\.be/|[?&]v=|/embed/|/shorts/)${VIDEO_ID}`),
  new RegExp(`\\bid\\s*=\\s*\\W?${VIDEO_ID}`),
  new RegExp(`^\\s*${VIDEO_ID}\\s*$`),
]

function youtubeId(attributes: string): string | null {
  for (const form of ID_FORMS) {
    const match = attributes.match(form)
    if (match) return match[1]
  }
  return null
}

/** Sized by the prose styles: block, full width, 16/9. */
function youtubeEmbed(id: string): Element {
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: ['video-embed'] },
    children: [
      {
        type: 'element',
        tagName: 'iframe',
        properties: {
          src: `https://www.youtube-nocookie.com/embed/${id}`,
          title: 'YouTube video',
          loading: 'lazy',
          allowFullScreen: true,
        },
        children: [],
      },
    ],
  }
}

/** Runs before sanitising, so the iframe it makes is vetted like any other. */
function convertShortcodes() {
  return (tree: Root) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return
      // Shortcodes shown as code are meant to be read.
      if (parent.type === 'element' && (parent.tagName === 'code' || parent.tagName === 'pre')) return

      const parts: ElementContent[] = []
      let last = 0
      for (const match of node.value.matchAll(YOUTUBE)) {
        parts.push({ type: 'text', value: stripShortcodes(node.value.slice(last, match.index)) })
        const id = youtubeId(match[1])
        if (id) parts.push(youtubeEmbed(id))
        last = match.index + match[0].length
      }

      if (!parts.length) {
        node.value = stripShortcodes(node.value)
        return
      }

      parts.push({ type: 'text', value: stripShortcodes(node.value.slice(last)) })
      const kept = parts.filter((part) => part.type !== 'text' || part.value !== '')
      parent.children.splice(index, 1, ...kept)
      return index + kept.length
    })
  }
}

// The default schema pins className on h2, ul, ol, li, a, code and section to
// GitHub's footnote and task-list classes. A tag-specific rule beats '*', so
// every other class on those tags is filtered out and they render class="".
const defaultAttributes = Object.fromEntries(
  Object.entries(defaultSchema.attributes ?? {}).map(([tag, allowed]) => [
    tag,
    allowed.filter((rule) => !(Array.isArray(rule) && rule[0] === 'className')),
  ]),
)

const schema = {
  ...defaultSchema,
  // The default prefixes ids ("user-content-intro") but leaves href="#intro"
  // alone, which breaks every in-post table of contents. This is the clinic's
  // own HTML, still sanitised, so ids stay as written.
  clobberPrefix: '',
  attributes: {
    ...defaultAttributes,
    img: [...(defaultAttributes.img ?? []), 'loading', 'decoding', 'width', 'height'],
    // No `allow`: a post does not get to grant an embed the camera, payment
    // or anything else past the browser's defaults.
    iframe: ['src', 'title', 'allowFullScreen', 'loading'],
    video: ['controls', 'poster', 'width', 'height'],
    source: ['src', 'type'],
    '*': [...(defaultAttributes['*'] ?? []), 'className', 'id'],
  },
  // YouTube embeds are all over the older posts; the pickleball page has a
  // self-hosted video.
  tagNames: [...(defaultSchema.tagNames ?? []), 'iframe', 'video', 'source', 'figure', 'figcaption'],
  protocols: { ...defaultSchema.protocols, poster: ['http', 'https'] },
}

/**
 * An image shows at its own size, capped by the column and 80% of the
 * screen's height. The width attribute is a fixed width, so CSS can't cap
 * the height without distorting it; capping the width at the height limit
 * times the ratio can. Set after sanitising, which drops every style a post
 * brings, so this is the only one an image carries.
 */
function imageRatios() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img') return
      const width = Number(node.properties.width)
      const height = Number(node.properties.height)
      const ratio = width / height
      if (width > 0 && height > 0 && Number.isFinite(ratio) && ratio >= 0.01) node.properties.style = `--ratio:${ratio.toFixed(4)}`
    })
  }
}

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(dropNoise)
  .use(convertShortcodes)
  .use(vetEmbeds)
  .use(unwrapFusion)
  .use(cleanAttributes)
  .use(dropEmpty)
  .use(rehypeSanitize, schema)
  .use(imageRatios)

function textContent(node: Root | Element): string {
  const parts: string[] = []
  visit(node, 'text', (text) => {
    parts.push(text.value)
  })
  return stripShortcodes(parts.join('')).replace(/\s+/g, ' ').trim()
}

/** WordPress pages repeat their own title as the first heading of the body. */
function dropLeadingTitle(tree: Root, title: string) {
  const first = tree.children.findIndex((c) => c.type === 'element')
  const node = tree.children[first]
  if (node?.type !== 'element' || !/^h[1-6]$/.test(node.tagName)) return
  if (textContent(node).toLowerCase() === title.trim().toLowerCase()) tree.children.splice(first, 1)
}

export function renderContent(
  html: string,
  {
    title,
  }: {
    /** The page title, dropped when the body opens by repeating it. */
    title?: string
  } = {},
) {
  if (!html?.trim()) return null
  const tree = processor.runSync(processor.parse(html)) as Root
  if (title) dropLeadingTitle(tree, title)
  return toJsxRuntime(tree, { Fragment, jsx, jsxs })
}

/**
 * The text of every paragraph, in order, each once. For a page whose layout
 * is ours and only the words come from WordPress. Avada can carry a second,
 * mobile-only copy of a row (reworded, so not a plain repeat) that CSS we
 * don't ship hides on desktop; the desktop copy is the one kept.
 */
export function paragraphsOf(html: string): string[] {
  if (!html?.trim()) return []
  const found: string[] = []
  visit(parser.parse(html), 'element', (node) => {
    if (classes(node).includes('fusion-no-large-visibility')) return SKIP
    if (node.tagName !== 'p') return
    const text = textContent(node)
    if (text && !found.includes(text)) found.push(text)
  })
  return found
}

const parser = unified().use(rehypeParse, { fragment: true })

/** Text of a WordPress HTML snippet, entities decoded by the real parser. */
function textOf(html: string, separator: string): string {
  const parts: string[] = []
  visit(parser.parse(html), 'text', (node) => {
    parts.push(node.value)
  })
  return parts.join(separator)
}

/**
 * WordPress's excerpt_more, " [&hellip;]", where it cut the text short. It
 * never shows: the summary ends on our own ellipsis instead.
 */
const EXCERPT_MORE = /\s*\[\s*(?:…|\.{3})\s*\]$/u

/** Excerpts come with a "Continue reading" link and entities baked in. */
export function plainExcerpt(html: string, limit = 180): string {
  const text = stripShortcodes(textOf(html, ' '))
    .replace(CUT_SHORTCODE, '')
    .replace(/\s*Continue reading.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!EXCERPT_MORE.test(text)) return clip(text, limit)

  // An excerpt that was only the marker comes out empty, so postSummary
  // falls back to the body.
  const clipped = clip(text.replace(EXCERPT_MORE, ''), limit).replace(/[\s,;:]+$/, '')
  if (!clipped || /[.!?…]$/.test(clipped)) return clipped
  return clipped + '…'
}

function clip(text: string, limit: number): string {
  if (text.length <= limit) return text
  const cut = text.lastIndexOf(' ', limit)
  return text.slice(0, cut > 0 ? cut : limit).trimEnd() + '\u2026'
}

export function decodeTitle(html: string): string {
  return textOf(html, '').trim()
}

/**
 * Whether the body already shows this upload, at any of WordPress's sizes
 * (`-300x200`, `-scaled`, an edited `-e1687201635874`). Old posts often
 * open with their featured image, and showing it twice looks like a glitch.
 */
export function showsImage(html: string, imageUrl: string): boolean {
  const file = imageUrl.split(/[?#]/)[0].split('/').pop() ?? ''
  const stem = file.replace(/\.\w+$/, '').replace(/(-e\d+|-scaled|-\d+x\d+)+$/, '')
  if (stem.length < 3) return false

  const escaped = stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`/${escaped}(-e\\d+|-scaled|-\\d+x\\d+)*\\.\\w+`, 'i').test(html)
}

/**
 * A post's summary for the list, meta description and feed. Avada posts
 * come back from the API with an empty excerpt, so those fall back to their
 * opening paragraphs, skipping one that only repeats the title.
 */
export function postSummary(post: { title: Rendered; excerpt: Rendered; content?: Rendered }, limit = 180): string {
  const excerpt = plainExcerpt(post.excerpt.rendered, limit)
  if (excerpt || !post.content) return excerpt

  const title = decodeTitle(post.title.rendered).toLowerCase()
  const text = paragraphsOf(post.content.rendered)
    .filter((p) => p.toLowerCase() !== title)
    .join(' ')
  return clip(text, limit)
}
