import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import rehypeParse from 'rehype-parse'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { Element, Root } from 'hast'

import { WP_HOST } from './client'

/**
 * Turns WordPress post HTML into React.
 *
 * Two shapes come out of this install. Older posts (2009-2023, the bulk) are
 * clean classic HTML. Newer ones are wrapped in Avada/Fusion builder markup —
 * nested layout divs, fusion-* classes, --awb-* inline styles — with the real
 * content buried inside. This flattens the second into the first.
 *
 * Once Avada is deactivated new posts come out clean and only the sanitize
 * step matters.
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
  'fusion-faq',
  'fusion-accordian',
  'fusion-panel',
  'fusion-toggle',
]

/**
 * Avada's older shortcodes emit Bootstrap class names with no prefix at all,
 * so the fusion-/awb- filter in cleanAttributes never sees them and they came
 * through as a stack of bare divs. Matched exactly rather than by prefix —
 * `title` and `collapse` are too generic to prefix-match safely.
 */
const BARE_WRAPPERS = new Set([
  'fullwidth-box',
  'accordian',
  'panel-group',
  'panel-default',
  'panel-heading',
  'panel-collapse',
  'panel-body',
  'collapse',
  'toggle-content',
  'post-content',
  'person-shortcode-image-wrapper',
  'person-image-container',
  'person-desc',
  'person-author',
  'icon-wrapper',
  'title',
])

function classes(node: Element): string[] {
  // hast types className as an array, but the parser hands back a string for
  // some nodes, so widen before narrowing.
  const value: unknown = node.properties?.className
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') return value.split(/\s+/)
  return []
}

function isFusionWrapper(node: Element): boolean {
  if (node.tagName !== 'div' && node.tagName !== 'span') return false
  const list = classes(node)
  return list.some(
    (c) => BARE_WRAPPERS.has(c) || FUSION_WRAPPERS.some((w) => c.startsWith(w)),
  )
}

/** Flatten the builder scaffolding. */
function unwrapFusion() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return
      if (!isFusionWrapper(node)) return

      parent.children.splice(index, 1, ...node.children)
      // Revisit from the same index so the lifted children, which are often
      // wrappers themselves, get checked too.
      return index
    })
  }
}

/** All the text under a node, tags ignored. */
function innerText(node: Element): string {
  const parts: string[] = []
  visit(node, 'text', (child) => {
    parts.push(child.value)
  })
  return parts.join('').replace(/\s+/g, ' ').trim()
}

/**
 * Avada's FAQ accordion is a Bootstrap collapse: the question is an anchor
 * that toggles a panel, and the panel is hidden in CSS until it fires.
 *
 * We serve neither Avada's CSS nor its JS, so the anchor was a dead link and
 * the answer was never hidden in the first place — every question rendered as
 * body-sized text with a pair of empty icon divs in front of it. The service
 * pages carry 15 to 19 of these each, so it was most of the page.
 *
 * Flattened to a heading with the answer beneath it. A <details> element would
 * also work, but the FAQ reads as prose here and the site's own sections don't
 * collapse either.
 */
function flattenToggles() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (!classes(node).includes('panel-title')) return

      const question = innerText(node)
      if (!question) return

      node.tagName = 'h3'
      node.properties = {}
      node.children = [{ type: 'text', value: question }]
    })
  }
}

/**
 * A one-cell table is a text box, not data. The table rules in globals.css are
 * for real tables, so the pickleball page's opening paragraphs came out inside
 * a full-width bordered box.
 *
 * Any <th>, or more than one cell, and it's left alone.
 */
function unwrapLayoutTables() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined || node.tagName !== 'table') return

      const cells: Element[] = []
      let hasHeader = false
      visit(node, 'element', (el: Element) => {
        if (el.tagName === 'th') hasHeader = true
        if (el.tagName === 'td') cells.push(el)
      })

      if (hasHeader || cells.length !== 1) return

      parent.children.splice(index, 1, ...cells[0].children)
      return index
    })
  }
}

/**
 * Avada leaves non-breaking spaces all through the copy — 26 on the pickleball
 * page alone, mostly trailing a word inside <strong>, where they stop a line
 * wrapping at the one place it needs to.
 */
function normalizeSpaces() {
  return (tree: Root) => {
    visit(tree, 'text', (node) => {
      node.value = node.value.replace(/\u00a0/g, ' ')
    })
  }
}

function cleanAttributes() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const props = node.properties

      // Avada puts the page title in the body as an h1, and the page already
      // has one.
      if (node.tagName === 'h1') node.tagName = 'h2'

      // Avada's inline custom properties. Nothing outside Avada reads them.
      if (typeof props.style === 'string' && props.style.includes('--awb-')) {
        delete props.style
      }

      const kept = classes(node).filter(
        (c) => !c.startsWith('fusion-') && !c.startsWith('awb-'),
      )
      if (kept.length) props.className = kept
      else delete props.className

      if (node.tagName === 'img') {
        // Fusion's lazyloader puts a base64 GIF in src and the real URL in
        // data-orig-src. Miss this and every image on a recent post is blank.
        if (typeof props.dataOrigSrc === 'string' && props.dataOrigSrc) {
          props.src = props.dataOrigSrc
        }

        delete props.dataOrigSrc
        delete props.srcSet
        delete props.sizes

        props.loading = 'lazy'
        props.decoding = 'async'
      }

      if (typeof props.src === 'string') props.src = rewriteHost(props.src)
      if (typeof props.href === 'string') props.href = rewriteHost(props.href)
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

/**
 * Take out <style> and friends, contents and all.
 *
 * rehype-sanitize drops the tag but keeps its text children, so an Avada FAQ
 * block was printing its own stylesheet into the middle of the page. Forms go
 * the same way: Avada's post back to a WordPress page that no longer exists,
 * and sanitized they came out as a row of disabled checkboxes.
 */
const NOISE = new Set(['style', 'script', 'noscript', 'link', 'meta', 'form'])

// Avada's FAQ accordion writes its schema.org markup as real spans and hides
// them in CSS. We drop the CSS, so without this the questions print twice with
// the author login and an ISO timestamp between them.
const HIDDEN = ['rich-snippet-hidden', 'screen-reader-text', 'fusion-meta-hidden']

/**
 * Blocks whose content the templates already render themselves.
 *
 * `fusion-person` is Avada's person card — portrait, name, credentials, and
 * nothing else. About shows all three in its own Figure and PageHero, so the
 * card came out as a second portrait of Dr. Lee under the first.
 *
 * `reading-box` is Avada's pull-quote. The only page with one is About, where
 * it quotes the sentence the template already sets as its blockquote directly
 * above — and a bordered box is not a device this design uses anyway.
 */
const DUPLICATED = ['fusion-person', 'reading-box']

/**
 * Avada's responsive visibility classes.
 *
 * The builder duplicates a block and hides one copy per breakpoint in CSS we
 * don't serve, so both copies rendered — About printed Dr. Lee's entire
 * biography twice, and two of the service pages did the same. Keeping the
 * large-viewport copy means dropping whatever is marked hidden there; it's the
 * fuller of the two, and the layout here is responsive enough to carry it down
 * to a phone on its own.
 */
const HIDDEN_AT_LARGE = 'fusion-no-large-visibility'

function isNoise(el: Element): boolean {
  if (NOISE.has(el.tagName)) return true
  if (classes(el).some((c) => HIDDEN.includes(c))) return true
  if (classes(el).includes(HIDDEN_AT_LARGE)) return true
  if (classes(el).some((c) => DUPLICATED.some((d) => c.startsWith(d)))) return true

  // Avada's spacer images are a data: GIF with nothing lazy-loaded behind
  // them. Sanitize strips the data: URL and leaves an img with no src.
  if (el.tagName !== 'img' || el.properties.dataOrigSrc) return false
  const src = el.properties.src
  return typeof src !== 'string' || src === '' || src.startsWith('data:')
}

function dropNoise() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return
      if (isNoise(node)) {
        parent.children.splice(index, 1)
        // The three hidden spans are siblings; without rewinding, visit skips
        // whichever one slides into the gap.
        return index
      }
    })
  }
}

/**
 * Drop wrappers left holding nothing after the passes above.
 *
 * `i` is here for Avada's icons — Font Awesome glyphs drawn from a stylesheet
 * we don't serve, so they take up a slot in the markup and draw nothing.
 */
const PRUNE_EMPTY = new Set(['div', 'p', 'span', 'i'])

function dropEmpty() {
  return (tree: Root) => {
    // Emptying a node can empty its parent, and visit runs top-down, so by then
    // the parent has already been walked past. Repeat until a pass is quiet.
    let changed = true

    while (changed) {
      changed = false

      visit(tree, 'element', (node, index, parent) => {
        if (!parent || index === undefined) return
        if (!PRUNE_EMPTY.has(node.tagName)) return

        const hasContent = node.children.some(
          (c) =>
            (c.type === 'text' && c.value.trim() !== '') ||
            (c.type === 'element' && c.tagName !== 'br'),
        )
        if (!hasContent) {
          parent.children.splice(index, 1)
          changed = true
          // Same rewind as dropNoise — empty wrappers come in runs, and without
          // it every second one survives.
          return index
        }
      })
    }
  }
}

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      'loading',
      'decoding',
      'width',
      'height',
    ],
    iframe: ['src', 'title', 'allow', 'allowFullScreen', 'width', 'height'],
    video: ['controls', 'poster', 'width', 'height'],
    source: ['src', 'type'],
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'id'],
  },
  // YouTube embeds are all over the older posts, and the pickleball page has
  // a self-hosted video.
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'iframe',
    'video',
    'source',
    'figure',
    'figcaption',
  ],
}

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(normalizeSpaces)
  .use(dropNoise)
  .use(flattenToggles)
  .use(unwrapFusion)
  .use(unwrapLayoutTables)
  .use(cleanAttributes)
  .use(dropEmpty)
  .use(rehypeSanitize, schema)

export function renderContent(html: string) {
  if (!html?.trim()) return null

  const tree = processor.runSync(processor.parse(html)) as Root

  return toJsxRuntime(tree, { Fragment, jsx, jsxs })
}

const parser = unified().use(rehypeParse, { fragment: true })

/**
 * The text of a snippet of WordPress HTML, entities decoded. Goes through the
 * real parser because the hand-kept entity table it replaced kept missing
 * ones — `&quot;` was printing as-is in excerpts.
 */
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
  return text.slice(0, cut > 0 ? cut : limit).trimEnd() + '…'
}

export function decodeTitle(html: string): string {
  return textOf(html, '').trim()
}
