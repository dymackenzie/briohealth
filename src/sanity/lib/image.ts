import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const imageBuilder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source)
}
