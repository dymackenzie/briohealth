import { defineArrayMember, defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'credentials', type: 'string', title: 'Credentials (e.g. N.D., R.Ac.)' }),
    defineField({ name: 'role', type: 'string', title: 'Role/Title' }),
    defineField({ name: 'photo', type: 'image', title: 'Photo', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt' }] }),
    defineField({ name: 'pullQuote', type: 'text', title: 'Pull quote', rows: 3 }),
    defineField({ name: 'bio', type: 'richText', title: 'Bio' }),
    defineField({ name: 'specialties', type: 'array', title: 'Specialties', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'order', type: 'number', title: 'Display order', initialValue: 99 }),
    defineField({ name: 'active', type: 'boolean', title: 'Active?', initialValue: true }),
    defineField({ name: 'seo', type: 'seo', title: 'SEO' }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})
