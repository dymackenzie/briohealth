'use client'

import { motion } from 'motion/react'
import Container from '@/components/ui/Container'

export default function StatBandSection({ section }: { section: any }) {
  const { heading, items = [] } = section

  return (
    <section className="bg-teal-700 py-[clamp(4rem,9vw,8rem)]">
      <Container>
        {heading && (
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-white text-center mb-12">
            {heading}
          </h2>
        )}
        <div className={`grid gap-8 sm:gap-12 ${items.length <= 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {items.map((stat: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-[clamp(2.5rem,5vw,4rem)] text-white leading-none mb-2">
                {stat.value}
                <span className="text-coral-500">.</span>
              </div>
              <p className="text-teal-100/80 font-body text-[1rem] tracking-wide uppercase text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
