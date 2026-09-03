'use client'

import { motion } from 'motion/react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import SanityImage from '@/components/media/SanityImage'
import Placeholder from '@/components/media/Placeholder'
import { PortableText } from '@portabletext/react'
import { resolveHref } from '@/lib/resolveHref'

const BG: Record<string, string> = {
  canvas: 'bg-canvas',
  sand: 'bg-sand-200',
  'teal-100': 'bg-teal-100',
}

export default function ImageWithTextSection({ section }: { section: any }) {
  const { imagePosition = 'left', image, imageArched, eyebrow, heading, body, cta, background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'
  const imageLeft = imagePosition === 'left'

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${imageLeft ? '' : 'lg:[&>:first-child]:order-2'}`}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: imageLeft ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
          >
            <div className={`overflow-hidden ${imageArched ? 'rounded-t-[999px] rounded-b-[var(--r-xl)]' : 'rounded-[var(--r-xl)]'}`}>
              {image ? (
                <SanityImage image={image} alt={image?.alt} sizes="(max-width: 768px) 100vw, 50vw" placeholderLabel="Section image" />
              ) : (
                <Placeholder label="Section image" ratio="5/6" />
              )}
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {eyebrow && (
              <p className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-teal-500 mb-3">{eyebrow}</p>
            )}
            {heading && (
              <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] text-ink-900 mb-5">{heading}</h2>
            )}
            {body && (
              <div className="prose text-ink-700 text-[1.0625rem] mb-6">
                <PortableText value={body} />
              </div>
            )}
            {cta?.label && (
              <Button
                href={resolveHref(cta.link)}
                external={cta.link?.kind === 'external' || cta.link?.kind === 'booking'}
                variant={cta.style || 'primary'}
                size="md"
              >
                {cta.label}
              </Button>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
