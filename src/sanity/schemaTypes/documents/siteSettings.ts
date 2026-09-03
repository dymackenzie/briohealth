import { defineArrayMember, defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'brand', title: 'Brand' },
    { name: 'contact', title: 'Contact' },
    { name: 'booking', title: 'Booking' },
    { name: 'social', title: 'Social' },
    { name: 'newsletter', title: 'Newsletter' },
    { name: 'announcement', title: 'Announcement' },
    { name: 'seo', title: 'SEO' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Site title', group: 'brand', validation: (r) => r.required() }),
    defineField({ name: 'tagline', type: 'string', title: 'Tagline', group: 'brand' }),
    defineField({ name: 'logo', type: 'image', title: 'Logo', group: 'brand', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt' }] }),
    defineField({ name: 'logoLight', type: 'image', title: 'Logo (light / for dark bgs)', group: 'brand', options: { hotspot: true } }),
    defineField({ name: 'favicon', type: 'image', title: 'Favicon', group: 'brand' }),

    defineField({ name: 'phone', type: 'string', title: 'Phone', group: 'contact' }),
    defineField({ name: 'email', type: 'string', title: 'Email', group: 'contact' }),
    defineField({ name: 'addressLine', type: 'string', title: 'Address line', group: 'contact' }),
    defineField({ name: 'city', type: 'string', title: 'City', group: 'contact' }),
    defineField({ name: 'mapUrl', type: 'url', title: 'Google Maps embed URL', group: 'contact' }),
    defineField({
      name: 'hours',
      type: 'array',
      title: 'Hours',
      group: 'contact',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'day', type: 'string', title: 'Day(s)' },
          { name: 'open', type: 'string', title: 'Opens' },
          { name: 'close', type: 'string', title: 'Closes' },
        ],
        preview: { select: { title: 'day', subtitle: 'open' } },
      })],
    }),
    defineField({ name: 'hoursNote', type: 'text', title: 'Hours note (freeform)', group: 'contact' }),

    defineField({ name: 'janeUrl', type: 'url', title: 'Jane booking URL', group: 'booking', initialValue: 'https://yourbriohealth.janeapp.com' }),
    defineField({ name: 'bookingLabel', type: 'string', title: 'Book Now button label', group: 'booking', initialValue: 'Book Now' }),

    defineField({
      name: 'social',
      type: 'array',
      title: 'Social links',
      group: 'social',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'platform', type: 'string', title: 'Platform' },
          { name: 'url', type: 'url', title: 'URL' },
        ],
        preview: { select: { title: 'platform', subtitle: 'url' } },
      })],
    }),

    defineField({ name: 'newsletterProvider', type: 'string', title: 'Newsletter provider', group: 'newsletter', initialValue: 'mailchimp' }),
    defineField({ name: 'mailchimpActionUrl', type: 'url', title: 'Mailchimp action URL', group: 'newsletter' }),
    defineField({ name: 'audienceTag', type: 'string', title: 'Audience tag', group: 'newsletter' }),
    defineField({ name: 'newsletterHeading', type: 'string', title: 'Newsletter heading', group: 'newsletter' }),
    defineField({ name: 'newsletterSubtext', type: 'text', title: 'Newsletter subtext', group: 'newsletter' }),
    defineField({ name: 'newsletterSuccess', type: 'string', title: 'Success message', group: 'newsletter' }),

    defineField({ name: 'announcementEnabled', type: 'boolean', title: 'Show announcement bar?', group: 'announcement', initialValue: false }),
    defineField({ name: 'announcementText', type: 'string', title: 'Announcement text', group: 'announcement' }),
    defineField({ name: 'announcementLink', type: 'url', title: 'Announcement link (optional)', group: 'announcement' }),
    defineField({ name: 'announcementTone', type: 'string', title: 'Tone', group: 'announcement', options: { list: ['teal', 'coral', 'ink'], layout: 'radio' }, initialValue: 'teal' }),

    defineField({ name: 'metaTitle', type: 'string', title: 'Default meta title', group: 'seo' }),
    defineField({ name: 'metaDescription', type: 'text', title: 'Default meta description', group: 'seo', rows: 3 }),
    defineField({ name: 'ogImage', type: 'image', title: 'Default OG image', group: 'seo' }),

    defineField({ name: 'footerBlurb', type: 'text', title: 'Footer blurb', group: 'footer', rows: 3 }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})
