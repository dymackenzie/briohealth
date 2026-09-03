'use client'

import { motion } from 'motion/react'
import Container from '@/components/ui/Container'
import SanityImage from '@/components/media/SanityImage'

const BG: Record<string, string> = {
  teal: 'bg-teal-700 text-white',
  sand: 'bg-sand-200 text-ink-900',
  coral: 'bg-coral-100 text-ink-900',
}

export default function QuoteBandSection({ section }: { section: any }) {
  const { quote, attribution, photo, background = 'teal' } = section
  const bgStyle = BG[background] || BG.teal
  const isDark = background === 'teal'

  return (
    <section className={`${bgStyle} py-[clamp(4rem,9vw,8rem)]`}>
      <Container size="prose">
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className={`font-display italic text-[clamp(1.5rem,3vw,2.25rem)] leading-snug mb-6 ${isDark ? 'text-white' : 'text-ink-900'}`}>
            &ldquo;{quote}&rdquo;
          </div>
          {attribution && (
            <footer className={`flex items-center justify-center gap-3 ${isDark ? 'text-teal-100' : 'text-ink-500'}`}>
              {photo && (
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <SanityImage image={photo} alt={attribution} width={40} height={40} className="object-cover" />
                </div>
              )}
              <cite className="not-italic font-body font-semibold text-[0.9375rem]">{attribution}</cite>
            </footer>
          )}
        </motion.blockquote>
      </Container>
    </section>
  )
}
