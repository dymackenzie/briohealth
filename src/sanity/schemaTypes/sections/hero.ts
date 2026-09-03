import { defineArrayMember, defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

export const heroSection = defineType({
  name: 'section.hero',
  title: 'Hero',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow label', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'emphasisWord', title: 'Word to italicize', type: 'string', description: 'This word in the heading will be styled in italic Fraunces' }),
    defineField({ name: 'subtext', title: 'Subtext', type: 'text', rows: 3 }),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [defineArrayMember({ type: 'cta' })],
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }),
    defineField({ name: 'imageArched', title: 'Arched top on image?', type: 'boolean', initialValue: true }),
    defineField({
      name: 'variant',
      title: 'Layout variant',
      type: 'string',
      options: { list: ['split', 'centered', 'imageRight'], layout: 'radio' },
      initialValue: 'split',
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: { list: ['canvas', 'sand', 'teal', 'coral'], layout: 'radio' },
      initialValue: 'canvas',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'variant' },
    prepare({ title, subtitle }) {
      return { title: `Hero: ${title}`, subtitle }
    },
  },
})
