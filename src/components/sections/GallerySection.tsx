'use client'

import { motion } from 'motion/react'
import SanityImage from '@/components/media/SanityImage'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const BG: Record<string, string> = {
  canvas: 'bg-canvas',
  sand: 'bg-sand-200',
}

interface GallerySectionProps {
  section: {
    eyebrow?: string
    heading?: string
    images?: any[]
    background?: string
  }
}

export default function GallerySection({ section }: GallerySectionProps) {
  const { eyebrow, heading, images = [], background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        {heading && (
          <SectionHeading eyebrow={eyebrow} heading={heading} align="center" className="mb-10" />
        )}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((img: any, i: number) => (
            <motion.div
              key={img._key || i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="break-inside-avoid overflow-hidden rounded-[var(--r-lg)]"
            >
              <SanityImage
                image={img}
                alt={img.alt ?? ''}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
