'use client'

import { motion } from 'motion/react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200' }

export default function ProcessStepsSection({ section }: { section: any }) {
  const { eyebrow, heading, steps = [], background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        {(eyebrow || heading) && (
          <SectionHeading eyebrow={eyebrow} heading={heading || ''} align="center" className="mb-12" />
        )}
        <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
          {steps.map((step: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-teal-500 text-white font-display text-2xl flex items-center justify-center mx-auto mb-5">
                {i + 1}
              </div>
              {step.stepLabel && (
                <p className="text-[0.75rem] font-semibold tracking-widest uppercase text-teal-500 mb-1">{step.stepLabel}</p>
              )}
              <h3 className="font-display text-[1.375rem] text-ink-900 mb-2">{step.title}</h3>
              {step.description && (
                <p className="text-ink-500 text-[0.9375rem] leading-relaxed">{step.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
