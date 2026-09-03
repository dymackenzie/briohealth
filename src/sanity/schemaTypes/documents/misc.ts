import { defineArrayMember, defineField, defineType } from 'sanity'
import { StarIcon, HelpCircleIcon, DocumentIcon, ArrowRightIcon } from '@sanity/icons'
import { pageBuilderField } from '../sections'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({ name: 'quote', type: 'text', title: 'Quote', rows: 5, validation: (r) => r.required() }),
    defineField({ name: 'attribution', type: 'string', title: 'Name / attribution', validation: (r) => r.required() }),
    defineField({ name: 'context', type: 'string', title: 'Context (e.g. Pickleball lessons)' }),
    defineField({ name: 'rating', type: 'number', title: 'Rating (1-5)', validation: (r) => r.min(1).max(5) }),
    defineField({ name: 'avatar', type: 'image', title: 'Photo', options: { hotspot: true } }),
    defineField({ name: 'serviceRef', type: 'reference', title: 'Service', to: [{ type: 'service' }] }),
  ],
  preview: {
    select: { title: 'attribution', subtitle: 'context' },
  },
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'question', type: 'string', title: 'Question', validation: (r) => r.required() }),
    defineField({ name: 'answer', type: 'richText', title: 'Answer', validation: (r) => r.required() }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: { list: ['Booking', 'Naturopathic', 'Acupuncture', 'IV Therapy', 'Laser', 'Massage', 'Programs', 'General'] },
    }),
  ],
  orderings: [{ title: 'Category', name: 'categoryAsc', by: [{ field: 'category', direction: 'asc' }] }],
  preview: { select: { title: 'question', subtitle: 'category' } },
})

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name: 'mode',
      type: 'string',
      title: 'Page mode',
      options: { list: ['pageBuilder', 'legal'], layout: 'radio' },
      initialValue: 'pageBuilder',
    }),
    { ...pageBuilderField, hidden: ({ document }: any) => document?.mode !== 'pageBuilder' },
    defineField({ name: 'legalBody', type: 'richText', title: 'Legal content', hidden: ({ document }) => document?.mode !== 'legal' }),
    defineField({ name: 'seo', type: 'seo', title: 'SEO' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: ArrowRightIcon,
  fields: [
    defineField({ name: 'from', type: 'string', title: 'From path (e.g. /old-page/)', validation: (r) => r.required() }),
    defineField({ name: 'to', type: 'string', title: 'To path (e.g. /new-page)', validation: (r) => r.required() }),
    defineField({ name: 'permanent', type: 'boolean', title: 'Permanent (301)?', initialValue: true }),
  ],
  preview: { select: { title: 'from', subtitle: 'to' } },
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    pageBuilderField,
    defineField({ name: 'seo', type: 'seo', title: 'SEO' }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    pageBuilderField,
    defineField({ name: 'seo', type: 'seo', title: 'SEO' }),
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
})
