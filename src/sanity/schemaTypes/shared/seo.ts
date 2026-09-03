import { defineField, defineType } from 'sanity'

export const seoObject = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'string', validation: (r) => r.max(60) }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, validation: (r) => r.max(160) }),
    defineField({ name: 'ogImage', title: 'OG image', type: 'image' }),
    defineField({ name: 'noIndex', title: 'No index', type: 'boolean', initialValue: false }),
  ],
})
