import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import Placeholder from './Placeholder'

interface SanityImageProps {
  image: any
  alt?: string
  sizes?: string
  className?: string
  priority?: boolean
  placeholderLabel?: string
  fill?: boolean
  width?: number
  height?: number
}

export default function SanityImage({
  image,
  alt,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className = '',
  priority = false,
  placeholderLabel,
  fill,
  width,
  height,
}: SanityImageProps) {
  if (!image?.asset) {
    return <Placeholder label={placeholderLabel} className={className} />
  }

  const src = urlFor(image).auto('format').quality(85).url()
  const altText = alt || image.alt || ''
  const lqip = image.asset?.metadata?.lqip

  if (fill) {
    return (
      <Image
        src={src}
        alt={altText}
        fill
        sizes={sizes}
        className={`object-cover ${className}`}
        priority={priority}
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
      />
    )
  }

  const imgWidth = width || image.asset?.metadata?.dimensions?.width || 1200
  const imgHeight = height || image.asset?.metadata?.dimensions?.height || 800

  return (
    <Image
      src={src}
      alt={altText}
      width={imgWidth}
      height={imgHeight}
      sizes={sizes}
      className={`object-cover ${className}`}
      priority={priority}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
    />
  )
}
