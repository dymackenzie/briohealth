import { defineArrayMember, defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'
import { pageBuilderField } from '../sections'

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'icon', type: 'string', title: 'Lucide icon name' }),
    defineField({ name: 'shortDescription', type: 'text', title: 'Short description', rows: 3 }),
    defineField({ name: 'heroImage', type: 'image', title: 'Hero image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt' }] }),
    defineField({ name: 'intro', type: 'richText', title: 'Intro text' }),
    pageBuilderField,
    defineField({ name: 'format', type: 'string', title: 'Format (e.g. 12-week program)' }),
    defineField({ name: 'schedule', type: 'string', title: 'Schedule / days' }),
    defineField({ name: 'nextSession', type: 'string', title: 'Next session date' }),
    defineField({ name: 'registrationUrl', type: 'url', title: 'Registration URL (Eventbrite/Jane)' }),
    defineField({ name: 'videoUrl', type: 'url', title: 'Video URL (YouTube/Vimeo)' }),
    defineField({
      name: 'pricing',
      type: 'array',
      title: 'Pricing',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label', validation: (r: any) => r.required() },
          { name: 'detail', type: 'string', title: 'Detail' },
          { name: 'price', type: 'string', title: 'Price' },
        ],
        preview: { select: { title: 'label', subtitle: 'price' } },
      })],
    }),
    defineField({ name: 'faqs', type: 'array', title: 'FAQs', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({ name: 'featured', type: 'boolean', title: 'Featured?', initialValue: false }),
    defineField({ name: 'order', type: 'number', title: 'Display order' }),
    defineField({ name: 'seo', type: 'seo', title: 'SEO' }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'format', media: 'heroImage' },
  },
})
