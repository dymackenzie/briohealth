import type { ReactNode } from 'react'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Header } from './Header'
import { Band, Container } from '@/components/ui/Container'
import { Figure } from '@/components/ui/Figure'
import { DotBurst } from '@/components/brand/DotBurst'

export type PageHeroImage = {
  subject: string
  src?: string
  alt?: string
  position?: string
}

/**
 * Top of every inner page. The header lives inside the teal band, same as the
 * homepage, so the nav never sits on a bar of its own.
 *
 * With an `image` the photo hangs over the band's bottom edge into the cream
 * below — that overlap is the depth, so the band can't clip its overflow. The
 * next band must leave room for it; /about hangs its stats off the photo's
 * bottom edge from there.
 */
export function PageHero({
  parent,
  title,
  lead,
  image,
  children,
}: {
  /** Where this page sits, when that isn't obvious from the title. */
  parent?: { label: string; href: string }
  title: string
  lead?: string
  image?: PageHeroImage
  children?: ReactNode
}) {
  const text = (
    <>
      {parent && (
        <Link
          href={parent.href}
          className="rise-in mb-5 inline-flex items-center gap-2 text-small opacity-80 transition-opacity hover:opacity-100"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {parent.label}
        </Link>
      )}
      <h1 className="rise-in max-w-[18ch] text-[clamp(2.25rem,1.5rem+3vw,3.75rem)]">
        {title}
      </h1>
      {lead && (
        <p
          className="rise-in mt-5 max-w-[46ch] text-lede opacity-90"
          style={{ animationDelay: '120ms' }}
        >
          {lead}
        </p>
      )}
      {children}
    </>
  )

  return (
    <Band tone="teal" as="div" flush className="relative">
      {/* Clipped on its own layer so the photo is free to hang past the band. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <DotBurst
          droplet={false}
          className="drift absolute -top-52 -right-36 h-[34rem] w-[34rem] text-teal-500 opacity-40"
        />
      </div>

      <Header />

      {image ? (
        <Container className="relative grid gap-10 pt-7 lg:grid-cols-12 lg:gap-8 lg:pt-10">
          <div className="lg:col-span-7 lg:self-center lg:pb-16">{text}</div>

          <div
            className="rise-in relative z-10 -mb-8 w-full max-w-[20rem] sm:max-w-[24rem] lg:col-span-5 lg:-mb-12 lg:ml-auto lg:max-w-[26rem] lg:self-end"
            style={{ animationDelay: '260ms' }}
          >
            <Figure
              {...image}
              aspect="4 / 5"
              offset="clay"
              tone="teal"
              preload
              sizes="(min-width: 1024px) 416px, (min-width: 640px) 384px, 320px"
            />
          </div>
        </Container>
      ) : (
        <Container className="relative pt-7 pb-14 lg:pt-11 lg:pb-20">{text}</Container>
      )}
    </Band>
  )
}
