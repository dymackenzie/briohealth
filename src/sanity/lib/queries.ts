import { groq } from 'next-sanity'

// Fragments
const seoFragment = groq`seo { metaTitle, metaDescription, ogImage, noIndex }`
const imageFragment = groq`{ ..., asset->{ _id, url, metadata { lqip, dimensions } } }`
const ctaFragment = groq`{ label, style, link { kind, href, anchor, openInNewTab, reference->{ _type, slug } } }`
const linkFragment = groq`{ kind, href, anchor, openInNewTab, reference->{ _type, slug } }`

const sectionFields = groq`
  _key,
  _type,
  ...select(
    _type == 'section.hero' => {
      eyebrow, heading, emphasisWord, subtext, variant, background, imageArched,
      ctas[] { ${ctaFragment} },
      image ${imageFragment}
    },
    _type == 'section.richText' => { body, background },
    _type == 'section.featureGrid' => {
      eyebrow, heading, subtext, columns, background,
      items[] { icon, title, text, link { ${linkFragment} } }
    },
    _type == 'section.serviceGrid' => {
      eyebrow, heading, background,
      services[]->{ _id, title, slug, shortDescription, icon, heroImage ${imageFragment} }
    },
    _type == 'section.programGrid' => {
      eyebrow, heading, background,
      programs[]->{ _id, title, slug, shortDescription, icon, heroImage ${imageFragment} }
    },
    _type == 'section.teamGrid' => {
      eyebrow, heading, background,
      members[]->{ _id, name, slug, role, credentials, photo ${imageFragment} }
    },
    _type == 'section.imageWithText' => {
      imagePosition, eyebrow, heading, body, background, imageArched,
      image ${imageFragment},
      cta { ${ctaFragment} }
    },
    _type == 'section.statBand' => { heading, items[] { value, label } },
    _type == 'section.quoteBand' => { quote, attribution, background, photo ${imageFragment} },
    _type == 'section.testimonialCarousel' => {
      eyebrow, heading, background,
      testimonials[]->{ _id, quote, attribution, context, rating, avatar ${imageFragment} }
    },
    _type == 'section.faqSection' => {
      eyebrow, heading, background,
      faqs[]->{ _id, question, answer },
      inlineFaqs[] { question, answer }
    },
    _type == 'section.ctaBand' => {
      eyebrow, heading, subtext, background,
      primaryCta { ${ctaFragment} },
      secondaryCta { ${ctaFragment} }
    },
    _type == 'section.newsletterSignup' => { heading, subtext, background },
    _type == 'section.logoCloud' => { eyebrow, background, logos[] { link, image ${imageFragment} } },
    _type == 'section.videoEmbed' => { heading, url, caption, background, poster ${imageFragment} },
    _type == 'section.gallery' => { eyebrow, heading, background, images[] ${imageFragment} },
    _type == 'section.processSteps' => {
      eyebrow, heading, background,
      steps[] { stepLabel, title, description }
    },
    _type == 'section.twoColumnText' => { leftBody, rightBody, background },
    _type == 'section.accordion' => { heading, background, items[] { question, answer } },
    _type == 'section.blogTeaser' => {
      eyebrow, heading, count, background,
      category->{ title, slug }
    }
  )
`

// Singletons
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  title, tagline, phone, email, addressLine, city, mapUrl, hoursNote,
  hours[] { day, open, close },
  janeUrl, bookingLabel,
  social[] { platform, url },
  newsletterProvider, mailchimpActionUrl, audienceTag,
  newsletterHeading, newsletterSubtext, newsletterSuccess,
  announcementEnabled, announcementText, announcementLink, announcementTone,
  metaTitle, metaDescription,
  ogImage ${imageFragment},
  logo ${imageFragment},
  logoLight ${imageFragment},
  footerBlurb
}`

export const navigationQuery = groq`*[_type == "navigation"][0] {
  primary[] {
    label, type,
    link { ${linkFragment} },
    columns[] {
      heading,
      items[] { label, description, icon, link { ${linkFragment} } }
    }
  },
  ctaButton { label, link { ${linkFragment} } },
  footerColumns[] {
    heading,
    items[] { label, link { ${linkFragment} } }
  }
}`

export const homePageQuery = groq`*[_type == "homePage"][0] {
  sections[] { ${sectionFields} },
  ${seoFragment}
}`

export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
  sections[] { ${sectionFields} },
  ${seoFragment}
}`

// Services
export const servicesQuery = groq`*[_type == "service"] | order(order asc) {
  _id, title, slug, shortDescription, icon, heroImage ${imageFragment}
}`

export const serviceBySlugQuery = groq`*[_type == "service" && slug.current == $slug][0] {
  _id, title, slug, shortDescription, icon,
  heroImage ${imageFragment},
  intro, process, pricing, pricingNote, ctaText,
  whatItTreats[] { title, description },
  sections[] { ${sectionFields} },
  faqs[]->{ _id, question, answer },
  ${seoFragment}
}`

// Programs
export const programsQuery = groq`*[_type == "program"] | order(order asc) {
  _id, title, slug, shortDescription, icon, heroImage ${imageFragment}
}`

export const programBySlugQuery = groq`*[_type == "program" && slug.current == $slug][0] {
  _id, title, slug, shortDescription, icon, format, schedule, nextSession,
  registrationUrl, videoUrl,
  heroImage ${imageFragment},
  intro, pricing, pricingNote,
  sections[] { ${sectionFields} },
  faqs[]->{ _id, question, answer },
  ${seoFragment}
}`

// Team
export const teamMembersQuery = groq`*[_type == "teamMember" && active == true] | order(order asc) {
  _id, name, slug, role, credentials, photo ${imageFragment}
}`

export const teamMemberBySlugQuery = groq`*[_type == "teamMember" && slug.current == $slug][0] {
  _id, name, slug, role, credentials, pullQuote, specialties,
  photo ${imageFragment},
  bio,
  ${seoFragment}
}`

// Blog
export const postsQuery = groq`*[_type == "post" && !archived] | order(publishedAt desc) [$start...$end] {
  _id, title, slug, excerpt, publishedAt,
  heroImage ${imageFragment},
  author->{ name, slug, avatar ${imageFragment} },
  categories[]->{ title, slug, color }
}`

export const totalPostsQuery = groq`count(*[_type == "post" && !archived])`

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id, title, slug, excerpt, publishedAt, updatedAt, legacySlug,
  heroImage ${imageFragment},
  body,
  author->{ name, slug, bio, avatar ${imageFragment} },
  categories[]->{ title, slug, color },
  ${seoFragment}
}`

export const featuredPostsQuery = groq`*[_type == "post" && featured == true && !archived] | order(publishedAt desc) [0...3] {
  _id, title, slug, excerpt, publishedAt,
  heroImage ${imageFragment},
  author->{ name, slug },
  categories[]->{ title, slug, color }
}`

export const postsByCategoryQuery = groq`*[_type == "post" && $categorySlug in categories[]->slug.current && !archived] | order(publishedAt desc) [$start...$end] {
  _id, title, slug, excerpt, publishedAt,
  heroImage ${imageFragment},
  author->{ name, slug },
  categories[]->{ title, slug, color }
}`

export const categoriesQuery = groq`*[_type == "category"] | order(title asc) {
  _id, title, slug, description, color
}`

export const categoryBySlugQuery = groq`*[_type == "category" && slug.current == $slug][0] {
  _id, title, slug, description, color
}`

// Pages
export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0] {
  _id, title, slug, mode, legalBody,
  sections[] { ${sectionFields} },
  ${seoFragment}
}`

// Redirects (for dynamic redirect generation)
export const redirectsQuery = groq`*[_type == "redirect"] { from, to, permanent }`

// Blog teasers used inside section renderer
export const latestPostsQuery = groq`*[_type == "post" && !archived] | order(publishedAt desc) [0...$count] {
  _id, title, slug, excerpt, publishedAt,
  heroImage ${imageFragment},
  author->{ name, slug },
  categories[]->{ title, slug, color }
}`
