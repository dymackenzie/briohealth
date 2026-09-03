/**
 * Upload legacy WordPress images to Sanity
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=<token> npx ts-node --esm scripts/upload-legacy-images.ts
 *   SANITY_API_WRITE_TOKEN=<token> npx ts-node --esm scripts/upload-legacy-images.ts --dry-run
 *
 * Output: scripts/image-map.json — { "wp-content/uploads/path.jpg": "sanity-asset-id" }
 * The blog importer reads this map to attach images to posts.
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@sanity/client'

const DRY_RUN = process.argv.includes('--dry-run')
const UPLOADS_DIR = path.resolve(__dirname, '../../yourbriohealth.com/wp-content/uploads')
const MAP_FILE = path.resolve(__dirname, 'image-map.json')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'])
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm'])

async function walkDir(dir: string): Promise<string[]> {
  const files: string[] = []
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`)
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walkDir(full))
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (SUPPORTED_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext)) {
        files.push(full)
      }
    }
  }
  return files
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
  }
  return map[ext] || 'application/octet-stream'
}

async function main() {
  console.log(`\n🖼  Brio Legacy Image Uploader ${DRY_RUN ? '(DRY RUN)' : ''}`)
  console.log(`Scanning: ${UPLOADS_DIR}\n`)

  const files = await walkDir(UPLOADS_DIR)
  console.log(`Found ${files.length} files\n`)

  // Load existing map if it exists
  const map: Record<string, string> = fs.existsSync(MAP_FILE)
    ? JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'))
    : {}

  let uploaded = 0
  let skipped = 0
  let errors = 0

  for (const filePath of files) {
    const relPath = path.relative(path.resolve(__dirname, '../..'), filePath)
    const ext = path.extname(filePath).toLowerCase()
    const isVideo = VIDEO_EXTENSIONS.has(ext)
    const filename = path.basename(filePath)

    // Skip if already uploaded
    if (map[relPath]) {
      skipped++
      continue
    }

    if (DRY_RUN) {
      console.log(`[dry-run] Would upload: ${relPath}`)
      skipped++
      continue
    }

    try {
      const fileStream = fs.createReadStream(filePath)
      const mimeType = getMimeType(ext)

      let asset: any
      if (isVideo) {
        asset = await client.assets.upload('file', fileStream, {
          filename,
          contentType: mimeType,
        })
      } else {
        asset = await client.assets.upload('image', fileStream, {
          filename,
          contentType: mimeType,
        })
      }

      map[relPath] = asset._id
      uploaded++
      console.log(`${relPath} → ${asset._id}`)

      // Save map after each upload (in case of interruption)
      fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2))
    } catch (err) {
      errors++
      console.error(`Error uploading ${relPath}:`, err)
    }
  }

  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2))

  console.log(`\nDone!`)
  console.log(`  Uploaded: ${uploaded}`)
  console.log(`  Skipped (already done or dry-run): ${skipped}`)
  console.log(`  Errors: ${errors}`)
  console.log(`  Map saved to: ${MAP_FILE}\n`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
