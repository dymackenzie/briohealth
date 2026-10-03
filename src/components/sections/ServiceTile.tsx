'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'

import { Figure } from '@/components/ui/Figure'
import { LoopVideo } from '@/components/video/LoopVideo'
import type { Photo } from '@/lib/content/photos'

/**
 * One service as a photo-led tile: the still (or the loop over it), the
 * name, "Learn more". The whole tile is the link; hover or focus anywhere
 * on it plays the loop (LoopVideo also plays it in view on touch). No
 * border, no shadow: not a card.
 */
export function ServiceTile({
  title,
  href,
  subject,
  still,
  loop,
}: {
  title: string
  href: string
  subject: string
  still: Photo | null
  loop: string | null
}) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group block"
    >
      {loop && still ? (
        <LoopVideo src={loop} poster={still} mode="tile" active={active} aspect="4/5" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
      ) : (
        <Figure subject={subject} photo={still} aspect="4/5" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
      )}
      <span className="mt-4 flex items-center justify-between gap-4">
        <span className="text-h3">{title}</span>
        <span className="inline-flex items-center gap-1 text-small font-medium text-teal-deep">
          Learn more
          <ArrowRight size={16} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </span>
    </Link>
  )
}
