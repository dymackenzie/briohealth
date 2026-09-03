'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import SanityImage from '@/components/media/SanityImage'
import Placeholder from '@/components/media/Placeholder'
import { resolveHref } from '@/lib/resolveHref'

const BG_STYLES: Record<string, string> = {
  canvas: 'bg-canvas',
  sand: 'bg-sand-200',
  teal: 'bg-teal-700',
  coral: 'bg-coral-100',
}

interface HeroSectionProps {
  section: {
    eyebrow?: string
    heading: string
    emphasisWord?: string
    subtext?: string
    ctas?: any[]
    image?: any
    imageArched?: boolean
    variant?: 'split' | 'centered' | 'imageRight'
    background?: string
  }
}

export default function HeroSection({ section }: HeroSectionProps) {
  const { eyebrow, heading, emphasisWord, subtext, ctas, image, imageArched, variant = 'split', background = 'canvas' } = section
  const isDark = background === 'teal'
  const bg = BG_STYLES[background] || 'bg-canvas'

  const headingText = emphasisWord
    ? heading.replace(emphasisWord, `<em class="not-italic italic font-light">${emphasisWord}</em>`)
    : heading

  const stagger = {
    initial: {},
    animate: { transition: { staggerChildren: 0.08 } },
  }
  const item = {
    initial: { opacity: 0, y: 16 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
  }

  if (variant === 'centered') {
    return (
      <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
        <Container>
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-3xl mx-auto text-center"
          >
            {eyebrow && (
              <motion.p variants={item} className={`text-[0.8125rem] font-semibold tracking-[0.14em] uppercase mb-4 ${isDark ? 'text-teal-300' : 'text-teal-500'}`}>
                {eyebrow}
              </motion.p>
            )}
            <motion.h1
              variants={item}
              className={`font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.02] tracking-[-0.02em] mb-6 ${isDark ? 'text-white' : 'text-ink-900'}`}
              dangerouslySetInnerHTML={{ __html: headingText }}
            />
            {subtext && (
              <motion.p variants={item} className={`text-[1.1875rem] leading-relaxed mb-8 max-w-2xl mx-auto ${isDark ? 'text-teal-100' : 'text-ink-500'}`}>
                {subtext}
              </motion.p>
            )}
            {ctas && ctas.length > 0 && (
              <motion.div variants={item} className="flex flex-wrap gap-3 justify-center">
                {ctas.map((cta, i) => (
                  <Button
                    key={i}
                    href={resolveHref(cta.link)}
                    external={cta.link?.kind === 'external' || cta.link?.kind === 'booking'}
                    variant={cta.style || (i === 0 ? 'primary' : 'secondary')}
                    size="lg"
                  >
                    {cta.label}
                  </Button>
                ))}
              </motion.div>
            )}
          </motion.div>
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.3 } }}
              className="mt-12 max-w-4xl mx-auto"
            >
              <div className={`overflow-hidden ${imageArched ? 'rounded-t-[999px] rounded-b-[var(--r-xl)]' : 'rounded-[var(--r-xl)]'}`}>
                <SanityImage image={image} alt={image?.alt} sizes="(max-width: 768px) 100vw, 800px" priority placeholderLabel="Clinic hero image" />
              </div>
            </motion.div>
          )}
        </Container>
      </section>
    )
  }

  const imageOnRight = variant === 'imageRight'
  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${imageOnRight ? '' : 'lg:[&>:first-child]:order-2'}`}>
          {/* Text */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {eyebrow && (
              <motion.p variants={item} className={`text-[0.8125rem] font-semibold tracking-[0.14em] uppercase mb-4 ${isDark ? 'text-teal-300' : 'text-teal-500'}`}>
                {eyebrow}
              </motion.p>
            )}
            <motion.h1
              variants={item}
              className={`font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.02] tracking-[-0.02em] mb-6 ${isDark ? 'text-white' : 'text-ink-900'}`}
              dangerouslySetInnerHTML={{ __html: headingText }}
            />
            {subtext && (
              <motion.p variants={item} className={`text-[1.1875rem] leading-relaxed mb-8 max-w-xl ${isDark ? 'text-teal-100' : 'text-ink-500'}`}>
                {subtext}
              </motion.p>
            )}
            {ctas && ctas.length > 0 && (
              <motion.div variants={item} className="flex flex-wrap gap-3">
                {ctas.map((cta, i) => (
                  <Button
                    key={i}
                    href={resolveHref(cta.link)}
                    external={cta.link?.kind === 'external' || cta.link?.kind === 'booking'}
                    variant={cta.style || (i === 0 ? 'primary' : 'secondary')}
                    size="lg"
                  >
                    {cta.label}
                  </Button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.25 } }}
          >
            <div className={`overflow-hidden ${imageArched ? 'rounded-t-[999px] rounded-b-[var(--r-xl)]' : 'rounded-[var(--r-xl)]'}`}>
              {image ? (
                <SanityImage image={image} alt={image?.alt} sizes="(max-width: 768px) 100vw, 50vw" priority placeholderLabel="Clinic hero image" />
              ) : (
                <Placeholder label="Hero image — clinic / Dr. Lee" ratio="4/5" />
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
