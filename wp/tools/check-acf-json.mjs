import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const theme = fileURLToPath(new URL('../brio-headless/', import.meta.url))
const dir = join(theme, 'acf-json')
const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
const keys = new Set()
const problems = []
const DASH = new RegExp('[\\u2013\\u2014]')

/** Every group's fields by dotted path (`hours.days`), for the reader checks below. */
const byPath = {}

function editorText(field) {
  const choices = field.choices && typeof field.choices === 'object' ? Object.values(field.choices) : []
  return [field.label, field.instructions, field.default_value, field.message, field.button_label, field.placeholder, ...choices]
}

function walk(fields, groupKey, path) {
  for (const field of fields) {
    const where = `${groupKey} > ${path}${field.name || field.key}`
    if (!field.key || !field.type || !field.label) problems.push(`${where}: missing key, type or label`)
    if (keys.has(field.key)) problems.push(`${where}: duplicate key ${field.key}`)
    keys.add(field.key)
    if (field.type !== 'tab') {
      if (!field.name) problems.push(`${where}: missing name`)
      if (typeof field.instructions !== 'string' || !field.instructions.trim()) problems.push(`${where}: no instructions`)
      byPath[groupKey][`${path}${field.name}`] = field
    }
    // A suggested length on every text field, enforced by the input as well as the instructions.
    if (['text', 'textarea'].includes(field.type) && !(Number(field.maxlength) > 0)) problems.push(`${where}: text field has no maxlength`)
    if (field.type === 'image' && field.return_format !== 'array') problems.push(`${where}: image must return an array`)
    if (/eyebrow|accent/i.test(field.name ?? '')) problems.push(`${where}: eyebrow and accent fields were dropped from the design`)
    for (const s of editorText(field)) {
      if (typeof s === 'string' && DASH.test(s)) problems.push(`${where}: em or en dash in editor-facing text`)
    }
    if (field.sub_fields) walk(field.sub_fields, groupKey, `${path}${field.name}.`)
  }
}

const groups = {}
for (const file of files) {
  let group
  try {
    group = JSON.parse(readFileSync(join(dir, file), 'utf8'))
  } catch (e) {
    problems.push(`${file}: invalid JSON (${e.message})`)
    continue
  }
  groups[group.key] = group
  byPath[group.key] = {}
  if (`${group.key}.json` !== file) problems.push(`${file}: key ${group.key} does not match the filename`)
  if (!Array.isArray(group.location) || !group.location.length) problems.push(`${file}: no location`)
  if (group.show_in_rest !== 1) problems.push(`${file}: show_in_rest must be 1`)
  for (const s of [group.title, group.description]) if (typeof s === 'string' && DASH.test(s)) problems.push(`${file}: em or en dash in the group title or description`)
  for (const rule of (group.location ?? []).flat()) {
    if (rule.param === 'page' || rule.param === 'post') problems.push(`${file}: bound to an ID; bind to a template or post type`)
    if (rule.param === 'page_template' && !existsSync(join(theme, rule.value))) problems.push(`${file}: template ${rule.value} does not exist in the theme`)
    if (rule.param === 'post_type' && !['post', 'page', 'service', 'testimonial', 'faq'].includes(rule.value)) problems.push(`${file}: unexpected post type ${rule.value}`)
  }
  walk(group.fields, group.key, '')
}

const expected = [
  'group_brio_settings', 'group_brio_home_hero', 'group_brio_home_stakes', 'group_brio_home_services', 'group_brio_home_trust',
  'group_brio_home_plan', 'group_brio_home_explain', 'group_brio_service', 'group_brio_testimonial', 'group_brio_faq',
  'group_brio_seo', 'group_brio_about', 'group_brio_contact', 'group_brio_new_patient', 'group_brio_pickleball',
]
for (const key of expected) if (!files.includes(`${key}.json`)) problems.push(`missing ${key}.json`)
for (const file of files) if (!expected.includes(file.replace(/\.json$/, ''))) problems.push(`${file}: not an expected group`)

/*
 * The readers. Top-level settings names are pulled from inc/options.php
 * itself; its row keys and the CPT shapes (src/lib/wp/types.ts) are listed
 * by hand because they sit inside PHP arrays and TS interfaces.
 */
const optionsPhp = readFileSync(join(theme, 'inc/options.php'), 'utf8')
const phpNames = [...optionsPhp.matchAll(/\$(?:get|text)\(\s*'([a-z_]+)'\s*\)/g)].map((m) => m[1])
if (phpNames.length < 10) problems.push(`inc/options.php: only found ${phpNames.length} field reads; has the reader changed shape?`)

const readers = {
  group_brio_settings: [...new Set(phpNames), 'hours.days', 'hours.opens', 'hours.closes', 'hours.closed', 'social.label', 'social.url', 'announcement.enabled', 'announcement.text', 'announcement.url'],
  group_brio_service: ['body', 'closing', 'video_loop', 'video_poster', 'video_youtube', 'image', 'image_position', 'faq_heading', 'faqs'],
  group_brio_testimonial: ['quote', 'name', 'service'],
  group_brio_faq: ['question', 'answer', 'faq_group'],
}
let readCount = 0
for (const [groupKey, paths] of Object.entries(readers)) {
  for (const path of paths) {
    readCount++
    if (!byPath[groupKey]?.[path]) problems.push(`${groupKey}: the reader expects ${path}, which is not defined`)
  }
}
// The post types define nothing the reader leaves out: an unread field is text the editor types and the site never shows.
for (const groupKey of ['group_brio_service', 'group_brio_testimonial', 'group_brio_faq']) {
  for (const path of Object.keys(byPath[groupKey] ?? {})) if (!readers[groupKey].includes(path)) problems.push(`${groupKey}: ${path} is not read by src/lib/wp/types.ts`)
}

// Shapes the readers depend on, not just names.
const days = byPath.group_brio_settings?.['hours.days']
if (days && (days.type !== 'checkbox' || days.return_format !== 'value')) problems.push('settings hours.days must be a checkbox returning values')
const loop = byPath.group_brio_service?.video_loop
if (loop && (loop.type !== 'file' || loop.return_format !== 'url' || loop.mime_types !== 'mp4')) problems.push('service video_loop must be a file field returning a url, mp4 only')
const faqGroup = byPath.group_brio_faq?.faq_group
if (faqGroup && Object.keys(faqGroup.choices).join() !== 'booking,naturopathic,acupuncture,iv-therapy') problems.push('faq faq_group must offer booking, naturopathic, acupuncture, iv-therapy (FaqGroup)')
for (const [key, fields] of Object.entries(byPath)) for (const [path, field] of Object.entries(fields)) {
  if (/(^|[._/])(fee|fees|price|amount)([._/]|$)/.test(path)) problems.push(`${key}: ${path} looks like a fee field; fees live only in the FAQ answers`)
  if (field.type === 'wysiwyg' && field.media_upload !== 0) problems.push(`${key}: ${path} must not allow media uploads; media go in their own fields`)
}

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(`${files.length} field groups, ${keys.size} fields, all valid; ${readCount} reader fields present`)
