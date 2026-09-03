import { SchemaTypeDefinition } from 'sanity'

// Shared objects
import { linkObject, ctaObject } from './shared/link'
import { seoObject } from './shared/seo'
import { richTextType } from './shared/richText'

// Section types
import { allSections } from './sections/index'

// Documents
import { siteSettings } from './documents/siteSettings'
import { navigation } from './documents/navigation'
import { service } from './documents/service'
import { program } from './documents/program'
import { teamMember } from './documents/teamMember'
import { post, author, category } from './documents/post'
import { testimonial, faq, page, redirect, homePage, aboutPage } from './documents/misc'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Shared objects
  linkObject,
  ctaObject,
  seoObject,
  richTextType,

  // Section types
  ...allSections,

  // Singletons
  siteSettings,
  navigation,
  homePage,
  aboutPage,

  // Document types
  service,
  program,
  teamMember,
  post,
  author,
  category,
  testimonial,
  faq,
  page,
  redirect,
]
