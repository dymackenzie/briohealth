'use client'

import { motion } from 'motion/react'
import * as LucideIcons from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { resolveHref } from '@/lib/resolveHref'
import Link from 'next/link'

const BG: Record<string, string> = {
  canvas: 'bg-canvas',
  sand: 'bg-sand-200',
  'teal-100': 'bg-teal-100',
}

const colClass: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export default function FeatureGridSection({ section }: { section: any }) {
  const { eyebrow, heading, subtext, items = [], columns = 3, background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        {(eyebrow || heading) && (
          <SectionHeading
            eyebrow={eyebrow}
            heading={heading || ''}
            subtext={subtext}
            className="mb-12"
          />
        )}
        <div className={`grid ${colClass[columns] || colClass[3]} gap-6`}>
          {items.map((item: any, i: number) => {
            const IconComp = item.icon ? (LucideIcons as any)[item.icon.replace(/(^\w|-\w)/g, (c: string) => c.replace('-', '').toUpperCase())] : null
            const card = (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-paper rounded-[var(--r-lg)] shadow-sm p-6 border border-sand-300 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                {IconComp && (
                  <div className="w-11 h-11 rounded-[var(--r-md)] bg-teal-050 flex items-center justify-center mb-4">
                    <IconComp size={22} className="text-teal-500" />
                  </div>
                )}
                <h3 className="font-display text-[1.375rem] text-ink-900 mb-2">{item.title}</h3>
                {item.text && <p className="text-ink-500 text-[0.9375rem] leading-relaxed">{item.text}</p>}
              </motion.div>
            )

            if (item.link) {
              return (
                <Link key={i} href={resolveHref(item.link) || '#'}>
                  {card}
                </Link>
              )
            }
            return card
          })}
        </div>
      </Container>
    </section>
  )
}
