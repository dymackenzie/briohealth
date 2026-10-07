import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { groups } from './field-groups.mjs'

const out = fileURLToPath(new URL('../brio-headless/acf-json/', import.meta.url))
mkdirSync(out, { recursive: true })
for (const file of readdirSync(out)) if (file.endsWith('.json')) rmSync(join(out, file))

for (const group of groups) {
  writeFileSync(join(out, `${group.key}.json`), JSON.stringify(group, null, 4) + '\n')
  console.log(`wrote ${group.key}.json (${group.fields.length} fields)`)
}
