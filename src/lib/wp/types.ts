// Only the fields we read. Verified against the live wp/v2 API; the brio/v1
// and acf shapes match wp/brio-headless (Tasks 16 and 17).
//
// SCF returns `false`, not null, for an empty image or relationship field,
// so those fields admit it and every reader treats it as empty.

export interface Rendered {
  rendered: string
}

export interface WPMedia {
  id: number
  source_url: string
  alt_text: string
  mime_type: string
  media_details: {
    width?: number
    height?: number
  }
}

export interface WPAuthor {
  id: number
  name: string
  slug: string
}

export interface WPTerm {
  id: number
  name: string
  slug: string
  taxonomy: 'category' | 'post_tag' | string
  count?: number
  description?: string
}

export interface WPEmbedded {
  author?: WPAuthor[]
  'wp:featuredmedia'?: WPMedia[]
  /** One inner array per taxonomy; needs .flat() to read. */
  'wp:term'?: WPTerm[][]
}

interface WPContentBase {
  id: number
  slug: string
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private'
  link: string
  date: string
  date_gmt: string
  modified: string
  modified_gmt: string
  title: Rendered
  content: Rendered
  excerpt: Rendered
  _embedded?: WPEmbedded
}

export interface WPPost extends WPContentBase {
  type: 'post'
  author: number
  featured_media: number
  categories: number[]
}

export interface WPPage extends WPContentBase {
  type: 'page'
  parent: number
  /** SCF fields for templated pages. Absent until the theme is installed. */
  acf?: Record<string, unknown>
}

export interface WPImageField {
  url: string
  alt: string
  width: number | null
  height: number | null
}

export interface WPService extends WPContentBase {
  type: 'service'
  acf?: {
    /** The page body as the editor wrote it (wysiwyg). */
    body?: string
    closing?: string
    /** File field, return format url. */
    video_loop?: string | false | null
    video_poster?: WPImageField | false | null
    video_youtube?: string | false | null
    image?: WPImageField | false | null
    image_position?: string
    faq_heading?: string
    faqs?: number[] | false
  }
}

export interface WPTestimonial {
  id: number
  slug: string
  title: Rendered
  acf?: {
    quote?: string
    name?: string
    /** Relationship field, return format id. */
    service?: number[] | false | null
  }
}

export interface WPFaq {
  id: number
  slug: string
  title: Rendered
  acf?: {
    question?: string
    answer?: string
    faq_group?: string
  }
}

/** /wp-json/brio/v1/settings, as inc/options.php returns it. */
export interface WPSettings {
  phone?: string | false | null
  email?: string | false | null
  address?: {
    street?: string | false | null
    locality?: string | false | null
    region?: string | false | null
    postal?: string | false | null
    country?: string | false | null
  } | false | null
  bookingUrl?: string | false | null
  ctaLabel?: string | false | null
  hours?: { days: string[] | false; opens: string | false | null; closes: string | false | null; closed: boolean }[] | false
  saturdayNote?: string | false | null
  social?: { label: string; href: string }[] | false | null
  announcement?: { text: string; href: string | null } | false | null
  ogImage?: WPImageField | false | null
}

export type WPCategory = WPTerm & { taxonomy: 'category' }

/** Totals come from response headers, not the body. */
export interface WPPagination {
  total: number
  totalPages: number
}

export interface WPCollection<T> extends WPPagination {
  items: T[]
}
