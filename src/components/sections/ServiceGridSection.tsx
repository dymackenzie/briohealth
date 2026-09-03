'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import SanityImage from '@/components/media/SanityImage'
import Placeholder from '@/components/media/Placeholder'
import { ArrowRight } from 'lucide-react'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200' }

export default function ServiceGridSection({ section }: { section: any }) {
  const { eyebrow, heading, services = [], background = 'sand' } = section
  const bg = BG[background] || 'bg-sand-200'

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        {(eyebrow || heading) && (
          <SectionHeading eyebrow={eyebrow} heading={heading || ''} className="mb-12" />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any, i: number) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/services/${service.slug?.current}`} className="group block bg-paper rounded-[var(--r-lg)] shadow-sm border border-sand-300 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="h-48 overflow-hidden">
                  {service.heroImage ? (
                    <SanityImage image={service.heroImage} fill alt={service.title} className="group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  ) : (
                    <Placeholder label={`${service.title} hero`} className="h-full" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-[1.375rem] text-ink-900 mb-2">{service.title}</h3>
                  {service.shortDescription && (
                    <p className="text-ink-500 text-[0.9375rem] leading-relaxed line-clamp-3 mb-4">{service.shortDescription}</p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-teal-500 font-semibold text-[0.875rem] group-hover:gap-2.5 transition-all">
                    Learn more <ArrowRight size={15} />
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
