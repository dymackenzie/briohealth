import { defineArrayMember, defineField, defineType } from 'sanity'
import { HeartIcon } from '@sanity/icons'
import { pageBuilderField } from '../sections'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: HeartIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'details', title: 'Details' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', group: 'content', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'icon', type: 'string', title: 'Lucide icon name', group: 'content' }),
    defineField({ name: 'shortDescription', type: 'text', title: 'Short description (for cards)', group: 'content', rows: 3 }),
    defineField({ name: 'heroImage', type: 'image', title: 'Hero image', group: 'content', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt' }] }),
    defineField({ name: 'intro', type: 'richText', title: 'Intro text', group: 'content' }),
    { ...pageBuilderField, group: 'content' },
    defineField({
      name: 'whatItTreats',
      type: 'array',
      title: 'What it treats',
      group: 'details',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'title', type: 'string', title: 'Condition/Area', validation: (r: any) => r.required() },
          { name: 'description', type: 'text', title: 'Description', rows: 2 },
        ],
        preview: { select: { title: 'title' } },
      })],
    }),
    defineField({
      name: 'process',
      type: 'array',
      title: 'Process steps',
      group: 'details',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'stepLabel', type: 'string', title: 'Step label (e.g. Step 1)' },
          { name: 'title', type: 'string', title: 'Step title', validation: (r: any) => r.required() },
          { name: 'description', type: 'text', title: 'Description', rows: 3 },
        ],
        preview: { select: { title: 'title', subtitle: 'stepLabel' } },
      })],
    }),
    defineField({
      name: 'pricing',
      type: 'array',
      title: 'Pricing',
      group: 'details',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Service label', validation: (r: any) => r.required() },
          { name: 'detail', type: 'string', title: 'Detail (e.g. 30 min)' },
          { name: 'price', type: 'string', title: 'Price (e.g. $150)' },
        ],
        preview: { select: { title: 'label', subtitle: 'price' } },
      })],
    }),
    defineField({ name: 'pricingNote', type: 'text', title: 'Pricing note', group: 'details', rows: 2 }),
    defineField({ name: 'faqs', type: 'array', title: 'FAQs', group: 'details', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({ name: 'ctaText', type: 'string', title: 'CTA text', group: 'details' }),
    defineField({ name: 'featured', type: 'boolean', title: 'Featured?', group: 'details', initialValue: false }),
    defineField({ name: 'order', type: 'number', title: 'Display order', group: 'details' }),
    defineField({ name: 'seo', type: 'seo', title: 'SEO', group: 'seo' }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'shortDescription', media: 'heroImage' },
  },
})
