const JANE_URL = process.env.NEXT_PUBLIC_JANE_URL || 'https://yourbriohealth.janeapp.com'

type LinkKind = 'internal' | 'external' | 'booking' | 'anchor'

interface SanityLink {
  kind: LinkKind
  href?: string
  anchor?: string
  openInNewTab?: boolean
  reference?: {
    _type: string
    slug?: { current: string }
  }
}

export function resolveHref(link: SanityLink | null | undefined): string {
  if (!link) return '#'
  const { kind, href, anchor, reference } = link

  switch (kind) {
    case 'external':
      return href || '#'
    case 'booking':
      return JANE_URL
    case 'anchor':
      return anchor ? `#${anchor}` : '#'
    case 'internal': {
      if (!reference) return '/'
      const slug = reference.slug?.current
      switch (reference._type) {
        case 'service': return `/services/${slug}`
        case 'program': return `/programs/${slug}`
        case 'post': return `/blog/${slug}`
        case 'teamMember': return `/about/team/${slug}`
        case 'page': return `/${slug}`
        default: return `/${slug}`
      }
    }
    default:
      return '/'
  }
}
