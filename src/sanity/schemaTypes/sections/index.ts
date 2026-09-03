import { defineArrayMember, defineField, defineType } from 'sanity'
import {
  BlockContentIcon, DashboardIcon, UsersIcon, ImagesIcon, TrendUpwardIcon,
  CommentIcon, StarFilledIcon, OlistIcon, DocumentIcon, LinkIcon,
  EnvelopeIcon, PlayIcon, ImageIcon, MenuIcon, SplitVerticalIcon
} from '@sanity/icons'

export const heroSection = defineType({
  name: 'section.hero',
  title: 'Hero',
  type: 'object',
  icon: StarFilledIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow label' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading', validation: (r) => r.required() }),
    defineField({ name: 'emphasisWord', type: 'string', title: 'Italic emphasis word' }),
    defineField({ name: 'subtext', type: 'text', title: 'Subtext', rows: 3 }),
    defineField({ name: 'ctas', type: 'array', title: 'CTAs', of: [defineArrayMember({ type: 'cta' })] }),
    defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt' }] }),
    defineField({ name: 'imageArched', type: 'boolean', title: 'Arch-top image?', initialValue: true }),
    defineField({ name: 'variant', type: 'string', title: 'Variant', options: { list: ['split', 'centered', 'imageRight'], layout: 'radio' }, initialValue: 'split' }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand', 'teal', 'coral'], layout: 'radio' }, initialValue: 'canvas' }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: `Hero: ${title}` }) },
})

export const richTextSection = defineType({
  name: 'section.richText',
  title: 'Rich Text',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({ name: 'body', type: 'richText', title: 'Content', validation: (r) => r.required() }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand', 'paper'] }, initialValue: 'canvas' }),
  ],
  preview: { prepare: () => ({ title: 'Rich Text Block' }) },
})

export const featureGridSection = defineType({
  name: 'section.featureGrid',
  title: 'Feature Grid',
  type: 'object',
  icon: DashboardIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'subtext', type: 'text', title: 'Subtext', rows: 2 }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'icon', type: 'string', title: 'Lucide icon name' },
          { name: 'title', type: 'string', title: 'Title', validation: (r: any) => r.required() },
          { name: 'text', type: 'text', title: 'Description', rows: 3 },
          { name: 'link', type: 'link', title: 'Link (optional)' },
        ],
        preview: { select: { title: 'title' } },
      })],
    }),
    defineField({ name: 'columns', type: 'number', title: 'Columns', options: { list: [2, 3, 4] }, initialValue: 3 }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand', 'teal-100'] }, initialValue: 'canvas' }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: `Feature Grid: ${title}` }) },
})

export const serviceGridSection = defineType({
  name: 'section.serviceGrid',
  title: 'Service Grid',
  type: 'object',
  icon: DashboardIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'services', type: 'array', title: 'Services (leave empty for all)', of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })] }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'sand' }),
  ],
  preview: { prepare: () => ({ title: 'Service Grid' }) },
})

export const programGridSection = defineType({
  name: 'section.programGrid',
  title: 'Program Grid',
  type: 'object',
  icon: DashboardIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'programs', type: 'array', title: 'Programs (leave empty for all)', of: [defineArrayMember({ type: 'reference', to: [{ type: 'program' }] })] }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'canvas' }),
  ],
  preview: { prepare: () => ({ title: 'Program Grid' }) },
})

export const teamGridSection = defineType({
  name: 'section.teamGrid',
  title: 'Team Grid',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'members', type: 'array', title: 'Members (leave empty for all)', of: [defineArrayMember({ type: 'reference', to: [{ type: 'teamMember' }] })] }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'sand' }),
  ],
  preview: { prepare: () => ({ title: 'Team Grid' }) },
})

export const imageWithTextSection = defineType({
  name: 'section.imageWithText',
  title: 'Image with Text',
  type: 'object',
  icon: SplitVerticalIcon,
  fields: [
    defineField({ name: 'imagePosition', type: 'string', title: 'Image position', options: { list: ['left', 'right'], layout: 'radio' }, initialValue: 'left' }),
    defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt' }] }),
    defineField({ name: 'imageArched', type: 'boolean', title: 'Arch-top image?', initialValue: false }),
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'body', type: 'richText', title: 'Body' }),
    defineField({ name: 'cta', type: 'cta', title: 'CTA button' }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand', 'teal-100'] }, initialValue: 'canvas' }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: `Image+Text: ${title}` }) },
})

export const statBandSection = defineType({
  name: 'section.statBand',
  title: 'Stat Band',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading (optional)' }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Stats',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'value', type: 'string', title: 'Value (e.g. 18+)', validation: (r: any) => r.required() },
          { name: 'label', type: 'string', title: 'Label', validation: (r: any) => r.required() },
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      })],
    }),
  ],
  preview: { prepare: () => ({ title: 'Stat Band (deep teal)' }) },
})

export const quoteBandSection = defineType({
  name: 'section.quoteBand',
  title: 'Quote Band',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({ name: 'quote', type: 'text', title: 'Quote', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'attribution', type: 'string', title: 'Attribution' }),
    defineField({ name: 'photo', type: 'image', title: 'Photo', options: { hotspot: true } }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['teal', 'sand', 'coral'] }, initialValue: 'teal' }),
  ],
  preview: { select: { title: 'quote' }, prepare: ({ title }) => ({ title: `Quote: "${title?.slice(0, 50)}…"` }) },
})

export const testimonialCarouselSection = defineType({
  name: 'section.testimonialCarousel',
  title: 'Testimonial Carousel',
  type: 'object',
  icon: StarFilledIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'testimonials', type: 'array', title: 'Testimonials', of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })] }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'sand' }),
  ],
  preview: { prepare: () => ({ title: 'Testimonial Carousel' }) },
})

export const faqSectionSection = defineType({
  name: 'section.faqSection',
  title: 'FAQ Section',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'faqs', type: 'array', title: 'FAQs', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({
      name: 'inlineFaqs',
      type: 'array',
      title: 'Inline FAQs',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Question', validation: (r: any) => r.required() },
          { name: 'answer', type: 'richText', title: 'Answer' },
        ],
        preview: { select: { title: 'question' } },
      })],
    }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'canvas' }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: `FAQs: ${title}` }) },
})

export const ctaBandSection = defineType({
  name: 'section.ctaBand',
  title: 'CTA Band',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading', validation: (r) => r.required() }),
    defineField({ name: 'subtext', type: 'text', title: 'Subtext', rows: 2 }),
    defineField({ name: 'primaryCta', type: 'cta', title: 'Primary CTA' }),
    defineField({ name: 'secondaryCta', type: 'cta', title: 'Secondary CTA' }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['teal', 'coral', 'sand', 'canvas'] }, initialValue: 'teal' }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: `CTA: ${title}` }) },
})

export const newsletterSignupSection = defineType({
  name: 'section.newsletterSignup',
  title: 'Newsletter Signup',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'subtext', type: 'text', title: 'Subtext', rows: 2 }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand', 'teal-100'] }, initialValue: 'teal-100' }),
  ],
  preview: { prepare: () => ({ title: 'Newsletter Signup' }) },
})

export const logoCloudSection = defineType({
  name: 'section.logoCloud',
  title: 'Logo Cloud / Featured In',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow (e.g. "As seen in")' }),
    defineField({
      name: 'logos',
      type: 'array',
      title: 'Logos',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'image', type: 'image', title: 'Logo', fields: [{ name: 'alt', type: 'string', title: 'Alt' }] },
          { name: 'link', type: 'url', title: 'Link (optional)' },
        ],
        preview: { select: { title: 'image.alt' } },
      })],
    }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'canvas' }),
  ],
  preview: { prepare: () => ({ title: 'Logo Cloud' }) },
})

export const videoEmbedSection = defineType({
  name: 'section.videoEmbed',
  title: 'Video Embed',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'url', type: 'url', title: 'YouTube / Vimeo URL' }),
    defineField({ name: 'poster', type: 'image', title: 'Poster image', options: { hotspot: true } }),
    defineField({ name: 'caption', type: 'string', title: 'Caption' }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'canvas' }),
  ],
  preview: { select: { title: 'heading', subtitle: 'url' }, prepare: ({ title, subtitle }) => ({ title: `Video: ${title || subtitle}` }) },
})

export const gallerySection = defineType({
  name: 'section.gallery',
  title: 'Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [{ name: 'alt', type: 'string', title: 'Alt', validation: (r: any) => r.required() }],
      })],
    }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'canvas' }),
  ],
  preview: { prepare: () => ({ title: 'Gallery' }) },
})

export const processStepsSection = defineType({
  name: 'section.processSteps',
  title: 'Process Steps',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({
      name: 'steps',
      type: 'array',
      title: 'Steps',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'stepLabel', type: 'string', title: 'Step label (e.g. Step 1)' },
          { name: 'title', type: 'string', title: 'Title', validation: (r: any) => r.required() },
          { name: 'description', type: 'text', title: 'Description', rows: 3 },
        ],
        preview: { select: { title: 'title', subtitle: 'stepLabel' } },
      })],
    }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'canvas' }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: `Steps: ${title}` }) },
})

export const twoColumnTextSection = defineType({
  name: 'section.twoColumnText',
  title: 'Two-Column Text',
  type: 'object',
  icon: MenuIcon,
  fields: [
    defineField({ name: 'leftBody', type: 'richText', title: 'Left column' }),
    defineField({ name: 'rightBody', type: 'richText', title: 'Right column' }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'canvas' }),
  ],
  preview: { prepare: () => ({ title: 'Two-Column Text' }) },
})

export const accordionSection = defineType({
  name: 'section.accordion',
  title: 'Accordion',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Title/Question', validation: (r: any) => r.required() },
          { name: 'answer', type: 'richText', title: 'Answer/Body' },
        ],
        preview: { select: { title: 'question' } },
      })],
    }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'canvas' }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: `Accordion: ${title}` }) },
})

export const blogTeaserSection = defineType({
  name: 'section.blogTeaser',
  title: 'Blog Teaser',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'count', type: 'number', title: 'Number of posts', initialValue: 3 }),
    defineField({ name: 'category', type: 'reference', title: 'Filter by category (optional)', to: [{ type: 'category' }] }),
    defineField({ name: 'background', type: 'string', title: 'Background', options: { list: ['canvas', 'sand'] }, initialValue: 'sand' }),
  ],
  preview: { prepare: () => ({ title: 'Blog Teaser' }) },
})

export const allSections = [
  heroSection,
  richTextSection,
  featureGridSection,
  serviceGridSection,
  programGridSection,
  teamGridSection,
  imageWithTextSection,
  statBandSection,
  quoteBandSection,
  testimonialCarouselSection,
  faqSectionSection,
  ctaBandSection,
  newsletterSignupSection,
  logoCloudSection,
  videoEmbedSection,
  gallerySection,
  processStepsSection,
  twoColumnTextSection,
  accordionSection,
  blogTeaserSection,
]

export const pageBuilderField = defineField({
  name: 'sections',
  title: 'Page sections',
  type: 'array',
  of: allSections.map((s) => defineArrayMember({ type: s.name })),
})
