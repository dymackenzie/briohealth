import { defineArrayMember, defineType } from 'sanity'
import { ImageIcon, LinkIcon } from '@sanity/icons'

export const richTextType = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            icon: LinkIcon,
            fields: [
              { name: 'href', type: 'url', title: 'URL' },
              { name: 'openInNewTab', type: 'boolean', title: 'Open in new tab', initialValue: false },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text', validation: (r: any) => r.required() },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
      options: { hotspot: true },
    }),
    defineArrayMember({
      name: 'callout',
      type: 'object',
      title: 'Callout',
      fields: [
        {
          name: 'tone',
          type: 'string',
          options: { list: ['info', 'tip', 'warning'], layout: 'radio' },
          initialValue: 'info',
        },
        { name: 'body', type: 'text', title: 'Content' },
      ],
      preview: { select: { title: 'body', subtitle: 'tone' } },
    }),
    defineArrayMember({
      name: 'ctaBlock',
      type: 'object',
      title: 'CTA Button',
      fields: [
        { name: 'label', type: 'string', title: 'Label' },
        { name: 'href', type: 'url', title: 'URL' },
        {
          name: 'style',
          type: 'string',
          options: { list: ['primary', 'secondary', 'accent'], layout: 'radio' },
          initialValue: 'primary',
        },
      ],
    }),
  ],
})
