'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import SanityImage from '@/components/media/SanityImage'
import Placeholder from '@/components/media/Placeholder'
import { ArrowRight } from 'lucide-react'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200' }

export default function ProgramGridSection({ section }: { section: any }) {
  const { eyebrow, heading, programs = [], background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        {(eyebrow || heading) && (
          <SectionHeading eyebrow={eyebrow} heading={heading || ''} className="mb-12" />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p: any, i: number) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/programs/${p.slug?.current}`} className="group block bg-paper rounded-[var(--r-lg)] shadow-sm border border-sand-300 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="h-44 overflow-hidden relative">
                  {p.heroImage ? (
                    <SanityImage image={p.heroImage} fill alt={p.title} className="group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" />
                  ) : (
                    <Placeholder label={`${p.title}`} className="h-full" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-[1.125rem] text-ink-900 mb-2">{p.title}</h3>
                  {p.shortDescription && (
                    <p className="text-ink-500 text-[0.875rem] leading-relaxed line-clamp-2 mb-3">{p.shortDescription}</p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-teal-500 font-semibold text-[0.875rem] group-hover:gap-2.5 transition-all">
                    Learn more <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
