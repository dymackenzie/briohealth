'use client'

import { motion } from 'motion/react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { resolveHref } from '@/lib/resolveHref'

const BG: Record<string, string> = {
  teal: 'bg-teal-700',
  coral: 'bg-coral-500',
  sand: 'bg-sand-200',
  canvas: 'bg-canvas',
}

const TEXT: Record<string, { heading: string; sub: string }> = {
  teal: { heading: 'text-white', sub: 'text-teal-100/80' },
  coral: { heading: 'text-white', sub: 'text-white/80' },
  sand: { heading: 'text-ink-900', sub: 'text-ink-500' },
  canvas: { heading: 'text-ink-900', sub: 'text-ink-500' },
}

export default function CtaBandSection({ section }: { section: any }) {
  const { eyebrow, heading, subtext, primaryCta, secondaryCta, background = 'teal' } = section
  const bg = BG[background] || BG.teal
  const isDark = background === 'teal' || background === 'coral'
  const textStyle = TEXT[background] || TEXT.teal

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {eyebrow && (
            <p className={`text-[0.8125rem] font-semibold tracking-[0.14em] uppercase mb-4 ${isDark ? 'text-teal-300' : 'text-teal-500'}`}>
              {eyebrow}
            </p>
          )}
          <h2 className={`font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] mb-4 ${textStyle.heading}`}>
            {heading}
          </h2>
          {subtext && (
            <p className={`text-[1.1875rem] leading-relaxed mb-8 ${textStyle.sub}`}>
              {subtext}
            </p>
          )}
          <div className="flex flex-wrap gap-3 justify-center">
            {primaryCta?.label && (
              <Button
                href={resolveHref(primaryCta.link)}
                external={primaryCta.link?.kind === 'external' || primaryCta.link?.kind === 'booking'}
                variant={isDark ? 'accent' : 'primary'}
                size="lg"
              >
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta?.label && (
              <Button
                href={resolveHref(secondaryCta.link)}
                external={secondaryCta.link?.kind === 'external' || secondaryCta.link?.kind === 'booking'}
                variant="ghost"
                size="lg"
                className={isDark ? 'border-white/40 text-white hover:bg-white/10' : ''}
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
