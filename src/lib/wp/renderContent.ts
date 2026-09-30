import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import rehypeParse from 'rehype-parse'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { unified } from 'unified'
import { SKIP, visit } from 'unist-util-visit'
import type { Element, Root } from 'hast'

import { WP_HOST } from './client'

/**
 * Turns WordPress post HTML into React.
 *
 * Two shapes come out of this install. Older posts (2009-2023, the bulk) are
 * clean classic HTML inside <div class="brio_archived_post">. Newer ones are
 * Avada/Fusion builder markup: nested layout divs, fusion-* classes, --awb-*
 * inline styles, with the real content buried inside. This flattens the
 * second into the first, then sanitises.
 */

const WP_HOSTS = ['yourbriohealth.com', 'www.yourbriohealth.com']

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

function rewriteHost(url: string): string {
  for (const host of WP_HOSTS) {
    if (url.includes(`//${host}/wp-content/`)) {
      return url.replace(`//${host}/`, `//${WP_HOST}/`)
    }
  }
  return url
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

      // Embed codes write allowfullscreen="true", which parses as the string
      // "true"; presence is what the attribute means, so make it a boolean.
      if (props.allowFullScreen !== undefined) props.allowFullScreen = true

      // Table and image layout hints from the 2010s. The default allowlist
      // keeps them, React doesn't know them, and the prose styles set layout.
      delete props.vAlign
      delete props.hSpace

      if (typeof props.src === 'string') props.src = rewriteHost(props.src)
      if (typeof props.href === 'string') props.href = rewriteHost(props.href)
    })
  }
}

function hasContent(node: Element): boolean {
  // An empty <a id> or <a name> is a jump target, not an empty link.
  if (node.tagName === 'a' && (node.properties.id || node.properties.name)) return true
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
    iframe: ['src', 'title', 'allow', 'allowFullScreen', 'width', 'height'],
    video: ['controls', 'poster', 'width', 'height'],
    source: ['src', 'type'],
    '*': [...(defaultAttributes['*'] ?? []), 'className', 'id'],
  },
  // YouTube embeds are all over the older posts; the pickleball page has a
  // self-hosted video.
  tagNames: [...(defaultSchema.tagNames ?? []), 'iframe', 'video', 'source', 'figure', 'figcaption'],
}

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(dropNoise)
  .use(unwrapFusion)
  .use(cleanAttributes)
  .use(dropEmpty)
  .use(rehypeSanitize, schema)

const MEDIA = new Set(['img', 'picture', 'video', 'audio', 'iframe', 'figure'])

function dropMedia(tree: Root) {
  visit(tree, 'element', (node, index, parent) => {
    if (!parent || index === undefined || !MEDIA.has(node.tagName)) return
    parent.children.splice(index, 1)
    return index
  })
  // The frames and wrappers that held them are empty now.
  pruneEmpty(tree)
}

function textContent(node: Root | Element): string {
  const parts: string[] = []
  visit(node, 'text', (text) => {
    parts.push(text.value)
  })
  return parts.join('').replace(/\s+/g, ' ').trim()
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
    media = true,
  }: {
    /** The page title, dropped when the body opens by repeating it. */
    title?: string
    /** false strips images, video and embeds, for a page that places its own photos. */
    media?: boolean
  } = {},
) {
  if (!html?.trim()) return null
  const tree = processor.runSync(processor.parse(html)) as Root
  if (title) dropLeadingTitle(tree, title)
  if (!media) dropMedia(tree)
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

/** Excerpts come with a "Continue reading" link and entities baked in. */
export function plainExcerpt(html: string, limit = 180): string {
  const text = textOf(html, ' ')
    .replace(/\s*Continue reading.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= limit) return text
  const cut = text.lastIndexOf(' ', limit)
  return text.slice(0, cut > 0 ? cut : limit).trimEnd() + '\u2026'
}

export function decodeTitle(html: string): string {
  return textOf(html, '').trim()
}
