/**
 * Blog import script: brio_content.md → Sanity post documents
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=<token> npx ts-node --esm scripts/import-blog.ts
 *   SANITY_API_WRITE_TOKEN=<token> npx ts-node --esm scripts/import-blog.ts --dry-run
 *
 * Dependencies (install before running):
 *   yarn add -D ts-node marked @sanity/block-tools @sanity/schema jsdom @types/jsdom
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@sanity/client'

// ─── Config ───────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes('--dry-run')
const CONTENT_FILE = path.resolve(__dirname, '../planning/brio_content.md')
const REPORT_FILE = path.resolve(__dirname, '../import-report.csv')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// ─── Author map ───────────────────────────────────────────────────────────────

const AUTHOR_MAP: Record<string, string> = {
  drjeff: 'dr-jeffrey-lee',
  'dr-jeff': 'dr-jeffrey-lee',
  drneetu: 'dr-neetu-dhiman',
  'dr-neetu': 'dr-neetu-dhiman',
  'dr-carin': 'dr-carin-matsushita',
  brioblogging: 'brio-health-team',
  'brio-living': 'brio-health-team',
  support: 'brio-health-team',
}

// ─── Category heuristics ──────────────────────────────────────────────────────

function guessCategories(title: string, body: string): string[] {
  const text = (title + ' ' + body).toLowerCase()
  const cats: string[] = []
  if (/recipe|ingredient|tablespoon|teaspoon|cup of|bake|roast|soup|salad|smoothie|breakfast|dinner|lunch/.test(text)) cats.push('recipes')
  if (/closed|closure|holiday|hours|office|reopening|welcome|new staff|new team|promotion|give.*away|raffle|winner/.test(text)) cats.push('clinic-news')
  if (/healthy living 101|weight loss|detox|liver|program|workshop|register/.test(text)) cats.push('programs')
  if (/pickleball|ben johns|jordan briones|coaching/.test(text)) cats.push('wellness')
  if (cats.length === 0) {
    if (/vitamin|supplement|mineral|herb|naturo|acupuncture|iv therapy|laser|massage/.test(text)) cats.push('health-tips')
    else cats.push('wellness')
  }
  return cats
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96)
}

function extractLegacySlug(urlLine: string): string {
  // `yourbriohealth.com/some-slug/`  →  some-slug
  const match = urlLine.match(/yourbriohealth\.com\/([^/\s`]+)\/?/)
  return match ? match[1] : ''
}

// ─── Simple Markdown → Portable Text ─────────────────────────────────────────
// A lightweight converter — handles headings, paragraphs, bold, italic, links.
// For production, replace with @sanity/block-tools + htmlToBlocks + marked.

function markdownToPortableText(md: string): any[] {
  const blocks: any[] = []
  const lines = md.split('\n')
  let pendingParagraph: string[] = []

  const flush = () => {
    const text = pendingParagraph.join(' ').trim()
    if (text) {
      blocks.push(makeParagraph(text))
    }
    pendingParagraph = []
  }

  for (const line of lines) {
    const h3 = line.match(/^### (.+)/)
    const h2 = line.match(/^## (.+)/)
    const h1 = line.match(/^# (.+)/)
    const hr = line.match(/^---+$/)
    const li = line.match(/^[\*\-] (.+)/)
    const num = line.match(/^\d+\. (.+)/)

    if (h1 || h2 || h3) {
      flush()
      const level = h1 ? 'h1' : h2 ? 'h2' : 'h3'
      const text = (h1?.[1] || h2?.[1] || h3?.[1] || '').trim()
      if (!text.match(/^join our newsletter/i)) {
        blocks.push({
          _type: 'block',
          _key: randomKey(),
          style: level,
          children: [{ _type: 'span', _key: randomKey(), text: cleanInline(text), marks: [] }],
          markDefs: [],
        })
      }
    } else if (hr) {
      flush()
    } else if (li || num) {
      flush()
      const text = (li?.[1] || num?.[1] || '').trim()
      blocks.push(makeParagraph(cleanInline(text)))
    } else if (line.trim() === '') {
      flush()
    } else {
      pendingParagraph.push(line.trim())
    }
  }
  flush()
  return blocks
}

function makeParagraph(text: string): any {
  return {
    _type: 'block',
    _key: randomKey(),
    style: 'normal',
    children: inlineToSpans(text),
    markDefs: [],
  }
}

function cleanInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}

function inlineToSpans(text: string): any[] {
  // Strip markdown formatting for now — a full inline parser is complex
  const clean = cleanInline(text)
  return [{ _type: 'span', _key: randomKey(), text: clean, marks: [] }]
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

// ─── Archive detection ────────────────────────────────────────────────────────

const CLOSURE_PATTERN = /closed|closure|holiday hours|office.*closed|reopen|give.*away|raffle|winner|donation/i
const OLD_DATE_CUTOFF = new Date('2020-01-01')

function isArchiveCandidate(title: string, publishedAt: string | null): boolean {
  if (CLOSURE_PATTERN.test(title)) return true
  if (publishedAt && new Date(publishedAt) < OLD_DATE_CUTOFF) return true
  return false
}

// ─── Post parser ─────────────────────────────────────────────────────────────

interface ParsedPost {
  title: string
  legacySlug: string
  slug: string
  body: any[]
  categories: string[]
  archived: boolean
  publishedAt: string | null
  excerpt: string
}

function parseContent(markdown: string): ParsedPost[] {
  // Split on `---` delimiter (standalone line)
  const blocks = markdown.split(/\n---\n/)
  const posts: ParsedPost[] = []

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue

    // Extract title
    const titleMatch = trimmed.match(/^## (.+)/m)
    if (!titleMatch) continue
    const title = titleMatch[1].trim()

    // Skip table of contents and metadata sections
    if (title === 'Table of Contents' || title === 'Join our newsletter') continue
    if (trimmed.length < 50) continue // Skip very short blocks

    // Extract legacy URL/slug
    const urlMatch = trimmed.match(/`yourbriohealth\.com\/([^`\s]+)`/)
    const legacySlug = urlMatch ? urlMatch[1].replace(/\/$/, '') : slugify(title)

    // Remove the URL backtick line from body
    let bodyText = trimmed
      .replace(/^## .+\n/, '')
      .replace(/`yourbriohealth\.com\/[^`]+`\n?/, '')
      .replace(/## Join our newsletter[\s\S]*$/, '')
      .trim()

    const body = markdownToPortableText(bodyText)
    const categories = guessCategories(title, bodyText)
    const excerpt = bodyText.replace(/#+[^\n]*/g, '').replace(/\*\*/g, '').trim().slice(0, 200)

    // Try to extract a date from the content (e.g., "Posted: January 15, 2018")
    const dateMatch = bodyText.match(/(\d{4}-\d{2}-\d{2})|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+(\d{4})/)
    let publishedAt: string | null = null
    if (dateMatch) {
      if (dateMatch[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
        publishedAt = dateMatch[0]
      } else {
        try {
          const d = new Date(dateMatch[0])
          if (!isNaN(d.getTime())) publishedAt = d.toISOString()
        } catch { /* ignore */ }
      }
    }

    const archived = isArchiveCandidate(title, publishedAt)

    posts.push({
      title,
      legacySlug,
      slug: slugify(legacySlug || title),
      body,
      categories,
      archived,
      publishedAt,
      excerpt,
    })
  }

  return posts
}

// ─── Sanity helpers ───────────────────────────────────────────────────────────

async function getOrCreateAuthor(slug: string): Promise<string | null> {
  const existing = await client.fetch(`*[_type == "author" && slug.current == $slug][0]._id`, { slug })
  if (existing) return existing

  const doc = await client.create({
    _type: 'author',
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    slug: { _type: 'slug', current: slug },
  })
  return doc._id
}

async function getCategoryRef(slug: string): Promise<string | null> {
  return client.fetch(`*[_type == "category" && slug.current == $slug][0]._id`, { slug })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 Brio Blog Importer ${DRY_RUN ? '(DRY RUN)' : ''}`)
  console.log(`Reading: ${CONTENT_FILE}\n`)

  const markdown = fs.readFileSync(CONTENT_FILE, 'utf-8')
  const posts = parseContent(markdown)
  console.log(`Parsed ${posts.length} posts\n`)

  const report: string[] = ['title,slug,legacySlug,categories,archived,publishedAt,status']
  let imported = 0
  let skipped = 0
  let errors = 0

  // Pre-cache category IDs
  const categoryCache: Record<string, string | null> = {}
  for (const slug of ['recipes', 'health-tips', 'clinic-news', 'programs', 'wellness']) {
    categoryCache[slug] = await getCategoryRef(slug)
  }

  for (const post of posts) {
    try {
      const authorId = await getOrCreateAuthor('brio-health-team')
      const categoryRefs = post.categories
        .map((cat) => categoryCache[cat])
        .filter(Boolean)
        .map((id) => ({ _type: 'reference', _ref: id, _key: randomKey() }))

      const doc: any = {
        _type: 'post',
        _id: `post-${post.slug}`,
        title: post.title,
        slug: { _type: 'slug', current: post.slug },
        legacySlug: post.legacySlug,
        excerpt: post.excerpt,
        body: post.body,
        categories: categoryRefs,
        archived: post.archived,
        featured: false,
        ...(post.publishedAt && { publishedAt: post.publishedAt }),
        ...(authorId && { author: { _type: 'reference', _ref: authorId } }),
      }

      if (!DRY_RUN) {
        await client.createOrReplace(doc)
        imported++
      } else {
        skipped++
      }

      report.push(`"${post.title.replace(/"/g, '""')}","${post.slug}","${post.legacySlug}","${post.categories.join(';')}","${post.archived}","${post.publishedAt || ''}","${DRY_RUN ? 'dry-run' : 'imported'}"`)
    } catch (err) {
      errors++
      console.error(`Error importing "${post.title}":`, err)
      report.push(`"${post.title.replace(/"/g, '""')}","${post.slug}","${post.legacySlug}","${post.categories.join(';')}","${post.archived}","${post.publishedAt || ''}","error"`)
    }
  }

  fs.writeFileSync(REPORT_FILE, report.join('\n'))

  console.log(`\nDone!`)
  console.log(`  Imported: ${imported}`)
  console.log(`  Dry-run skipped: ${skipped}`)
  console.log(`  Errors: ${errors}`)
  console.log(`  Report: ${REPORT_FILE}\n`)

  const archivedCount = posts.filter((p) => p.archived).length
  if (archivedCount > 0) {
    console.log(`   ${archivedCount} posts marked as archived (old closure notices, holiday hours etc.)`)
    console.log(`   Review the CSV report and decide which to hide.\n`)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
