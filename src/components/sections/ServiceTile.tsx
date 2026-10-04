'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'

import { Figure } from '@/components/ui/Figure'
import { LoopPauseButton, LoopVideo, useLoopGates } from '@/components/video/LoopVideo'
import type { Photo } from '@/lib/content/photos'

/**
 * One service as a photo-led tile: the still (or the loop over it), the
 * name, "Learn more". The whole tile is the link, named by the service:
 * the media inside it is aria-hidden, so neither the alt text nor a
 * placeholder's brief joins the name. Where the device can hover, hover or
 * focus anywhere on the tile plays the loop. Where it cannot, the loop
 * plays in view and gets a pause button on the photo's corner (WCAG
 * 2.2.2), a sibling of the link because a button cannot sit inside one;
 * once paused it stays paused until the visitor presses play. No border,
 * no shadow: not a card.
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
  const [paused, setPaused] = useState(false)
  const { showVideo, canHover } = useLoopGates()
  const sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw'

  return (
    <div className="relative">
      <Link
        href={href}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="group block"
      >
        <div aria-hidden="true">
          {loop && still ? (
            <LoopVideo src={loop} poster={still} mode="tile" active={active} paused={paused} aspect="4/5" sizes={sizes} />
          ) : (
            <Figure subject={subject} photo={still} aspect="4/5" sizes={sizes} />
          )}
        </div>
        <span className="mt-4 flex items-center justify-between gap-4">
          <span className="text-h3">{title}</span>
          <span className="inline-flex items-center gap-1 text-small font-medium text-teal-deep">
            Learn more
            <ArrowRight size={16} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
          </span>
        </span>
      </Link>
      {loop && still && showVideo && !canHover && (
        // The photo's own box, so the button sits on its corner as on the hero.
        <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[4/5]">
          <LoopPauseButton
            paused={paused}
            onToggle={() => setPaused((p) => !p)}
            label={`${title} video`}
            className="pointer-events-auto right-3 bottom-3"
          />
        </div>
      )}
    </div>
  )
}
