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
]

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
  return list.some((c) => FUSION_WRAPPERS.some((w) => c.startsWith(w)))
}

/**
 * Flatten the builder scaffolding.
 *
 * Runs repeatedly because the wrappers nest several deep and lifting one
 * exposes the next. Capped so a pathological document can't spin.
 */
function unwrapFusion() {
  return (tree: Root) => {
    for (let pass = 0; pass < 12; pass++) {
      let changed = false

      visit(tree, 'element', (node, index, parent) => {
        if (!parent || index === undefined) return
        if (!isFusionWrapper(node as Element)) return

        parent.children.splice(index, 1, ...node.children)
        changed = true
        // Re-inspect the children we just lifted; without this the nesting
        // needs a fresh pass per level.
        return index
      })

      if (!changed) break
    }
  }
}

function cleanAttributes() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const props = node.properties
      if (!props) return

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
        const original = props['dataOrigSrc'] ?? props['data-orig-src']
        if (typeof original === 'string' && original) props.src = original

        delete props['dataOrigSrc']
        delete props['data-orig-src']
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
 * block was printing its own stylesheet into the middle of the page.
 */
const NOISE = new Set(['style', 'script', 'noscript', 'link', 'meta'])

// Avada's FAQ accordion writes its schema.org markup as real spans and hides
// them in CSS. We drop the CSS, so without this the questions print twice with
// the author login and an ISO timestamp between them.
const HIDDEN = ['rich-snippet-hidden', 'screen-reader-text', 'fusion-meta-hidden']

function dropNoise() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return
      const el = node as Element
      if (NOISE.has(el.tagName) || classes(el).some((c) => HIDDEN.includes(c))) {
        parent.children.splice(index, 1)
        // The three hidden spans are siblings; without rewinding, visit skips
        // whichever one slides into the gap.
        return index
      }
    })
  }
}

/** Drop wrappers left holding nothing after the passes above. */
function dropEmpty() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return
      const el = node as Element
      if (el.tagName !== 'div' && el.tagName !== 'p' && el.tagName !== 'span') return

      const hasContent = el.children.some(
        (c) =>
          (c.type === 'text' && c.value.trim() !== '') ||
          (c.type === 'element' && (c as Element).tagName !== 'br'),
      )
      if (!hasContent) {
        parent.children.splice(index, 1)
        // Same rewind as dropNoise — empty wrappers come in runs, and without
        // it every second one survives.
        return index
      }
    })
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
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'id'],
  },
  // YouTube embeds are all over the older posts.
  tagNames: [...(defaultSchema.tagNames ?? []), 'iframe', 'figure', 'figcaption'],
}

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(dropNoise)
  .use(unwrapFusion)
  .use(cleanAttributes)
  .use(dropEmpty)
  .use(rehypeSanitize, schema)

export function renderContent(html: string) {
  if (!html?.trim()) return null

  const tree = processor.runSync(processor.parse(html)) as Root

  return toJsxRuntime(tree, { Fragment, jsx, jsxs })
}

/**
 * Entities WordPress bakes into titles and excerpts. One table — the two
 * callers had grown separate lists, so a curly apostrophe decoded in a title
 * and printed as `&rsquo;` in the excerpt right below it.
 */
const ENTITIES: [RegExp, string][] = [
  [/&#8217;|&rsquo;/g, '’'],
  [/&#8216;|&lsquo;/g, '‘'],
  [/&#8220;|&ldquo;/g, '“'],
  [/&#8221;|&rdquo;/g, '”'],
  [/&#8211;|&ndash;/g, '–'],
  [/&#8212;|&mdash;/g, '—'],
  [/&hellip;/g, '…'],
  [/&nbsp;/g, ' '],
  [/&amp;/g, '&'],
]

const TAGS = /<[^>]+>/g
const NUMERIC_ENTITY = /&#(\d+);/g

function stripAndDecode(html: string, tagReplacement: string): string {
  let text = html.replace(TAGS, tagReplacement)
  for (const [pattern, replacement] of ENTITIES) {
    text = text.replace(pattern, replacement)
  }
  return text.replace(NUMERIC_ENTITY, (_, code) =>
    String.fromCharCode(Number(code)),
  )
}

/** Excerpts come with a "Continue reading" link and entities baked in. */
export function plainExcerpt(html: string, limit = 180): string {
  const text = stripAndDecode(html, ' ')
    .replace(/\s*Continue reading.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= limit) return text
  return text.slice(0, text.lastIndexOf(' ', limit)).trimEnd() + '…'
}

export function decodeTitle(html: string): string {
  return stripAndDecode(html, '').trim()
}
