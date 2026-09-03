import type { StructureResolver } from 'sanity/structure'
import { CogIcon, HomeIcon, InfoOutlineIcon, DocumentsIcon, UsersIcon, CalendarIcon, HeartIcon, DocumentTextIcon, CommentIcon, HelpCircleIcon, ArrowRightIcon } from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Brio Health')
    .items([
      // Singletons
      S.listItem().title('Site Settings').icon(CogIcon).child(
        S.document().schemaType('siteSettings').documentId('siteSettings')
      ),
      S.listItem().title('Navigation').icon(DocumentsIcon).child(
        S.document().schemaType('navigation').documentId('navigation')
      ),
      S.divider(),
      S.listItem().title('Home Page').icon(HomeIcon).child(
        S.document().schemaType('homePage').documentId('homePage')
      ),
      S.listItem().title('About Page').icon(InfoOutlineIcon).child(
        S.document().schemaType('aboutPage').documentId('aboutPage')
      ),
      S.divider(),
      // Content
      S.listItem().title('Services').icon(HeartIcon).child(
        S.documentTypeList('service').title('Services')
      ),
      S.listItem().title('Programs').icon(CalendarIcon).child(
        S.documentTypeList('program').title('Programs')
      ),
      S.listItem().title('Team').icon(UsersIcon).child(
        S.documentTypeList('teamMember').title('Team Members')
      ),
      S.divider(),
      S.listItem().title('Blog').icon(DocumentTextIcon).child(
        S.list().title('Blog').items([
          S.listItem().title('Posts').icon(DocumentTextIcon).child(
            S.documentTypeList('post').title('Posts')
          ),
          S.listItem().title('Categories').icon(DocumentsIcon).child(
            S.documentTypeList('category').title('Categories')
          ),
          S.listItem().title('Authors').icon(UsersIcon).child(
            S.documentTypeList('author').title('Authors')
          ),
        ])
      ),
      S.divider(),
      S.listItem().title('Testimonials').icon(CommentIcon).child(
        S.documentTypeList('testimonial').title('Testimonials')
      ),
      S.listItem().title('FAQs').icon(HelpCircleIcon).child(
        S.documentTypeList('faq').title('FAQs')
      ),
      S.listItem().title('Pages').icon(DocumentsIcon).child(
        S.documentTypeList('page').title('Pages')
      ),
      S.listItem().title('Redirects').icon(ArrowRightIcon).child(
        S.documentTypeList('redirect').title('Redirects')
      ),
    ])
