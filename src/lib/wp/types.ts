// Only the wp/v2 fields we actually read. Verified against the live API.

export interface Rendered {
  rendered: string
}

export type WPStatus = 'publish' | 'future' | 'draft' | 'pending' | 'private'

export interface WPMedia {
  id: number
  source_url: string
  alt_text: string
  mime_type: string
  media_details: {
    width?: number
    height?: number
    sizes?: Record<string, { source_url: string; width: number; height: number }>
  }
}

export interface WPAuthor {
  id: number
  name: string
  slug: string
  description: string
  avatar_urls?: Record<string, string>
}

export interface WPTerm {
  id: number
  name: string
  slug: string
  taxonomy: 'category' | 'post_tag' | string
  count?: number
  description?: string
  parent?: number
}

export interface WPEmbedded {
  author?: WPAuthor[]
  'wp:featuredmedia'?: WPMedia[]
  /** One inner array per taxonomy — needs .flat() to read. */
  'wp:term'?: WPTerm[][]
}

interface WPContentBase {
  id: number
  slug: string
  status: WPStatus
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
  tags: number[]
  sticky: boolean
}

export interface WPPage extends WPContentBase {
  type: 'page'
  parent: number
  featured_media: number
  /** SCF fields. Absent until the WordPress side is set up. */
  acf?: Record<string, unknown>
}

export interface WPCustomPost extends WPContentBase {
  type: 'service' | 'program' | 'team_member' | 'testimonial' | 'faq'
  featured_media: number
  acf?: Record<string, unknown>
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
