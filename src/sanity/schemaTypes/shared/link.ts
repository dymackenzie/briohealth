import { defineField, defineType } from 'sanity'

export const linkObject = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal page', value: 'internal' },
          { title: 'External URL', value: 'external' },
          { title: 'Book Now (Jane)', value: 'booking' },
          { title: 'Anchor (#)', value: 'anchor' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'reference',
      title: 'Internal page',
      type: 'reference',
      to: [
        { type: 'page' },
        { type: 'service' },
        { type: 'program' },
        { type: 'post' },
        { type: 'teamMember' },
      ],
      hidden: ({ parent }) => parent?.kind !== 'internal',
    }),
    defineField({
      name: 'href',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.kind !== 'external',
    }),
    defineField({
      name: 'anchor',
      title: 'Anchor ID',
      type: 'string',
      hidden: ({ parent }) => parent?.kind !== 'anchor',
    }),
    defineField({
      name: 'label',
      title: 'Link label',
      type: 'string',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'kind' },
  },
})

export const ctaObject = defineType({
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Button label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'link', title: 'Link', type: 'link' }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (teal filled)', value: 'primary' },
          { title: 'Secondary (outline)', value: 'secondary' },
          { title: 'Accent (coral)', value: 'accent' },
          { title: 'Ghost', value: 'ghost' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'style' },
  },
})
