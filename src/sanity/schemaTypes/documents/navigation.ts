import { defineArrayMember, defineField, defineType } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'primary',
      title: 'Primary navigation',
      type: 'array',
      of: [defineArrayMember({
        name: 'navItem',
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label', validation: (r: any) => r.required() },
          {
            name: 'type',
            type: 'string',
            title: 'Type',
            options: { list: ['link', 'dropdown'], layout: 'radio' },
            initialValue: 'link',
          },
          { name: 'link', type: 'link', title: 'Link (for type: link)' },
          {
            name: 'columns',
            type: 'array',
            title: 'Dropdown columns',
            of: [defineArrayMember({
              name: 'dropdownColumn',
              type: 'object',
              fields: [
                { name: 'heading', type: 'string', title: 'Column heading' },
                {
                  name: 'items',
                  type: 'array',
                  title: 'Items',
                  of: [defineArrayMember({
                    name: 'dropdownItem',
                    type: 'object',
                    fields: [
                      { name: 'label', type: 'string', title: 'Label', validation: (r: any) => r.required() },
                      { name: 'link', type: 'link', title: 'Link' },
                      { name: 'description', type: 'string', title: 'Description (optional)' },
                      { name: 'icon', type: 'string', title: 'Lucide icon name (optional)' },
                    ],
                    preview: { select: { title: 'label', subtitle: 'description' } },
                  })],
                },
              ],
              preview: { select: { title: 'heading' } },
            })],
          },
        ],
        preview: { select: { title: 'label', subtitle: 'type' } },
      })],
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA button (Book Now)',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Label', initialValue: 'Book Now' },
        { name: 'link', type: 'link', title: 'Link' },
      ],
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      of: [defineArrayMember({
        name: 'footerColumn',
        type: 'object',
        fields: [
          { name: 'heading', type: 'string', title: 'Heading' },
          {
            name: 'items',
            type: 'array',
            title: 'Items',
            of: [defineArrayMember({
              name: 'footerItem',
              type: 'object',
              fields: [
                { name: 'label', type: 'string', title: 'Label' },
                { name: 'link', type: 'link', title: 'Link' },
              ],
              preview: { select: { title: 'label' } },
            })],
          },
        ],
        preview: { select: { title: 'heading' } },
      })],
    }),
  ],
  preview: { prepare: () => ({ title: 'Navigation' }) },
})
