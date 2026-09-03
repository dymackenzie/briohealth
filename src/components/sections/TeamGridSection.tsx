'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import SanityImage from '@/components/media/SanityImage'
import Placeholder from '@/components/media/Placeholder'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200' }

export default function TeamGridSection({ section }: { section: any }) {
  const { eyebrow, heading, members = [], background = 'sand' } = section
  const bg = BG[background] || 'bg-sand-200'

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        {(eyebrow || heading) && (
          <SectionHeading eyebrow={eyebrow} heading={heading || ''} className="mb-12" />
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((m: any, i: number) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/about/team/${m.slug?.current}`} className="group block text-center">
                <div className="mb-4 overflow-hidden rounded-t-[999px] rounded-b-[var(--r-xl)] aspect-[3/4]">
                  {m.photo ? (
                    <SanityImage image={m.photo} fill alt={m.name} className="group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 25vw" />
                  ) : (
                    <Placeholder label={`${m.name} portrait`} ratio="3/4" />
                  )}
                </div>
                <h3 className="font-display text-[1.125rem] text-ink-900 group-hover:text-teal-500 transition-colors">{m.name}</h3>
                <p className="text-ink-500 text-[0.875rem] mt-1">{m.role}</p>
                {m.credentials && <p className="text-teal-500 text-[0.8125rem] mt-0.5 font-semibold">{m.credentials}</p>}
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
