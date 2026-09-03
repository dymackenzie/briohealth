import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Meta' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', group: 'content', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'excerpt', type: 'text', title: 'Excerpt', group: 'content', rows: 3 }),
    defineField({ name: 'heroImage', type: 'image', title: 'Hero image', group: 'content', options: { hotspot: true }, fields: [
      { name: 'alt', type: 'string', title: 'Alt' },
      { name: 'credit', type: 'string', title: 'Image credit' },
    ] }),
    defineField({ name: 'body', type: 'richText', title: 'Body', group: 'content' }),
    defineField({ name: 'publishedAt', type: 'datetime', title: 'Published at', group: 'meta' }),
    defineField({ name: 'updatedAt', type: 'datetime', title: 'Updated at', group: 'meta' }),
    defineField({ name: 'author', type: 'reference', title: 'Author', group: 'meta', to: [{ type: 'author' }] }),
    defineField({ name: 'categories', type: 'array', title: 'Categories', group: 'meta', of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })] }),
    defineField({ name: 'featured', type: 'boolean', title: 'Featured?', group: 'meta', initialValue: false }),
    defineField({ name: 'archived', type: 'boolean', title: 'Archived (hide from blog)?', group: 'meta', initialValue: false }),
    defineField({ name: 'legacySlug', type: 'string', title: 'Legacy WordPress slug (for redirects)', group: 'meta' }),
    defineField({ name: 'legacyImageUrl', type: 'string', title: 'Legacy image URL', group: 'meta' }),
    defineField({ name: 'seo', type: 'seo', title: 'SEO', group: 'seo' }),
  ],
  orderings: [
    { title: 'Published (newest)', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Published (oldest)', name: 'publishedAsc', by: [{ field: 'publishedAt', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'heroImage' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'No date',
        media,
      }
    },
  },
})

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'avatar', type: 'image', title: 'Avatar', options: { hotspot: true } }),
    defineField({ name: 'bio', type: 'text', title: 'Bio', rows: 4 }),
    defineField({ name: 'teamMemberRef', type: 'reference', title: 'Team member (link to bio)', to: [{ type: 'teamMember' }] }),
  ],
  preview: { select: { title: 'name', media: 'avatar' } },
})

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'text', title: 'Description', rows: 2 }),
    defineField({ name: 'color', type: 'string', title: 'Color token (e.g. teal, coral)', initialValue: 'teal' }),
  ],
  preview: { select: { title: 'title', subtitle: 'description' } },
})
