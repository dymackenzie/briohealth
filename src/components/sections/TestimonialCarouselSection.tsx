'use client'

import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { motion } from 'motion/react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200' }

export default function TestimonialCarouselSection({ section }: { section: any }) {
  const { eyebrow, heading, testimonials = [], background = 'sand' } = section
  const bg = BG[background] || 'bg-sand-200'
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!testimonials.length) return null

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        <div className="flex items-end justify-between gap-6 mb-10">
          {(eyebrow || heading) && (
            <SectionHeading eyebrow={eyebrow} heading={heading || ''} />
          )}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border-2 border-sand-300 bg-paper flex items-center justify-center hover:bg-teal-500 hover:border-teal-500 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border-2 border-sand-300 bg-paper flex items-center justify-center hover:bg-teal-500 hover:border-teal-500 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-6">
            {testimonials.map((t: any, i: number) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-paper rounded-[var(--r-lg)] shadow-sm border border-sand-300 p-7"
              >
                {t.rating && (
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < t.rating ? 'text-gold-300 fill-gold-300' : 'text-ink-300'} />
                    ))}
                  </div>
                )}
                <blockquote>
                  <p className="font-display italic text-[1.125rem] text-ink-900 leading-snug mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="flex items-center gap-2.5">
                    <div>
                      <cite className="not-italic font-body font-semibold text-ink-900 text-[0.9375rem]">{t.attribution}</cite>
                      {t.context && <p className="text-ink-500 text-[0.8125rem] mt-0.5">{t.context}</p>}
                    </div>
                  </footer>
                </blockquote>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
