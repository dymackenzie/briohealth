import type { ReactNode } from 'react'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Header } from './Header'
import { Band, Container } from '@/components/ui/Container'
import { BandDivider } from '@/components/ui/BandDivider'
import { DotBurst } from '@/components/brand/DotBurst'

/**
 * Top of every inner page. The header lives inside the teal band, same as the
 * homepage, so the nav never sits on a bar of its own.
 */
export function PageHero({
  parent,
  title,
  lead,
  children,
  divider = 'canvas',
}: {
  /** Where this page sits, when that isn't obvious from the title. */
  parent?: { label: string; href: string }
  title: string
  lead?: string
  children?: ReactNode
  /** Colour of the band below, for the curve. */
  divider?: 'canvas' | 'none'
}) {
  return (
    <Band tone="teal" as="div" flush className="relative overflow-hidden">
      <DotBurst
        droplet={false}
        className="drift pointer-events-none absolute -top-52 -right-36 h-[34rem] w-[34rem] text-teal-400/10"
      />

      <Header />

      <Container className="relative pt-7 pb-14 lg:pt-11 lg:pb-16">
        {parent && (
          <Link
            href={parent.href}
            className="rise-in mb-4 inline-flex items-center gap-2 text-[0.9rem] opacity-75 transition-opacity hover:opacity-100"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {parent.label}
          </Link>
        )}
        <h1 className="rise-in max-w-[20ch] text-[clamp(1.9rem,4vw,2.75rem)]">
          {title}
        </h1>
        {lead && (
          <p
            className="rise-in mt-4 max-w-[52ch] text-base opacity-85"
            style={{ animationDelay: '120ms' }}
          >
            {lead}
          </p>
        )}
        {children}
      </Container>

      {divider === 'canvas' && (
        <BandDivider curve="drift" fill="text-canvas" className="-mb-px" />
      )}
    </Band>
  )
}
