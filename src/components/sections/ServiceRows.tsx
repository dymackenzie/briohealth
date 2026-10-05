'use client'

import Link from 'next/link'
import { useId, useState, type FocusEvent } from 'react'
import { ArrowRight, Plus } from '@phosphor-icons/react'

import { Figure } from '@/components/ui/Figure'
import { useMediaQuery } from '@/components/video/hooks'
import { LoopPauseButton, LoopVideo, useLoopGates } from '@/components/video/LoopVideo'
import type { Photo } from '@/lib/content/photos'

export interface ServiceRowItem {
  slug: string
  title: string
  href: string
  /** The loop's brief, the placeholder's text until the client's video arrives. */
  brief: string
  /** A 16:9 frame of the loop. Without it the placeholder shows, loop or not. */
  poster: Photo | null
  loop: string | null
}

/** Where the media moves beside the list: md, on a device that can hover. */
export const SIDE_QUERY = '(min-width: 768px)'

const SIDE_SIZES = '(min-width: 1280px) 500px, 40vw'
const INLINE_SIZES = '100vw'

/**
 * The services as a list of names, not cards: large serif, one per row
 * between 1px ink rules, each row a link named by the service alone. Each
 * has a horizontal 16:9 loop (its still under it), or until the client
 * supplies one, the labelled placeholder with the loop's brief; never a
 * shoot crop, which shows Dr. Lee when cut wide.
 *
 * From md on a device that can hover, the list takes columns 1-7 and one
 * 16:9 panel sits beside it, top-aligned, showing the hovered or focused
 * row's media; moving between rows crossfades the panel (opacity only, so
 * nothing shifts). Leaving keeps the last row's still in the panel, which
 * is calmer than blanking it; the first row's shows before any hover. Only
 * the active row's loop plays (shouldPlayLoop: open, in view, no reduced
 * motion, no save-data, not paused by the visitor); leaving pauses it. The
 * panel's pause button (WCAG 2.2.2) sits on its corner, inside the hover
 * area so reaching for it doesn't stop the loop.
 *
 * Below md, or where the device cannot hover, a disclosure button beside
 * the link (never inside it) opens one row at a time to show its media
 * full width under the name, as grid rows from 0fr to 1fr like the
 * Accordion; an open row's loop gets the pause button. Reduced motion
 * snaps both and shows stills only. Before hydration, and without
 * JavaScript, the rows are plain links: no panel, no buttons.
 */
export function ServiceRows({ items, label }: { items: ServiceRowItem[]; label: string }) {
  const { hydrated, canHover, showVideo } = useLoopGates()
  const wide = useMediaQuery(SIDE_QUERY)
  const side = hydrated && canHover && wide
  const inline = hydrated && !side

  /** Side panel: the row under the pointer or focus, and the row the panel shows. */
  const [active, setActive] = useState<string | null>(null)
  const [shown, setShown] = useState(items[0]?.slug)
  /** Inline: the row opened by its button. */
  const [open, setOpen] = useState<string | null>(null)
  const [paused, setPaused] = useState<Record<string, boolean>>({})
  const baseId = useId()

  const light = (slug: string) => () => {
    if (!side) return
    setActive(slug)
    setShown(slug)
  }
  const unlight = (event: FocusEvent<HTMLDivElement>) => {
    if (side && !event.currentTarget.contains(event.relatedTarget)) setActive(null)
  }
  const togglePause = (slug: string) => () => setPaused((p) => ({ ...p, [slug]: !p[slug] }))
  const hasLoop = (item: ServiceRowItem) => Boolean(item.loop && item.poster)
  const shownItem = items.find((item) => item.slug === shown)

  return (
    <div
      onPointerLeave={side ? () => setActive(null) : undefined}
      onBlur={unlight}
      className={side ? 'grid grid-cols-12 gap-6 lg:gap-8' : undefined}
    >
      <ul aria-label={label} className={`border-t border-ink ${side ? 'col-span-7' : ''}`}>
        {items.map((item) => {
          const isOpen = inline && open === item.slug
          const lit = side ? active === item.slug : isOpen
          const panelId = `${baseId}-${item.slug}`

          return (
            <li key={item.slug} onPointerEnter={light(item.slug)} onFocus={light(item.slug)} className="border-b border-ink">
              <div className="flex items-center gap-3">
                <Link href={item.href} className="group flex min-w-0 flex-1 items-center gap-4 py-5 lg:py-6">
                  <span className="text-h2">{item.title}</span>
                  <ArrowRight
                    size={28}
                    aria-hidden
                    className={`shrink-0 text-teal transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none ${lit ? 'translate-x-1.5' : ''}`}
                  />
                </Link>
                {inline && (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    aria-label={`Preview ${item.title}`}
                    onClick={() => setOpen(isOpen ? null : item.slug)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-brand border border-ink"
                  >
                    <Plus
                      size={22}
                      aria-hidden
                      className={`transition-transform duration-300 motion-reduce:transition-none ${isOpen ? 'rotate-45' : ''}`}
                    />
                  </button>
                )}
              </div>

              {inline && (
                <div
                  id={panelId}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-[350ms] ease-out-expo motion-reduce:transition-none ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="relative mb-6">
                      <Media item={item} play={isOpen} paused={Boolean(paused[item.slug])} sizes={INLINE_SIZES} />
                      {hasLoop(item) && showVideo && isOpen && (
                        <LoopPauseButton
                          paused={Boolean(paused[item.slug])}
                          onToggle={togglePause(item.slug)}
                          label={`${item.title} video`}
                          className="right-3 bottom-3"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {side && (
        <div className="relative col-span-5 self-start">
          {/* The rows' links name each service; this repeats their media, so
              assistive tech skips it. The pause button stays outside. */}
          <div aria-hidden="true" className="relative aspect-video overflow-hidden rounded-brand">
            {items.map((item) => (
              <div
                key={item.slug}
                className={`absolute inset-0 transition-opacity duration-300 ease-out-expo motion-reduce:transition-none ${
                  shown === item.slug ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <Media item={item} play={active === item.slug} paused={Boolean(paused[item.slug])} sizes={SIDE_SIZES} />
              </div>
            ))}
          </div>
          {shownItem && hasLoop(shownItem) && showVideo && (
            <LoopPauseButton
              paused={Boolean(paused[shownItem.slug])}
              onToggle={togglePause(shownItem.slug)}
              label={`${shownItem.title} video`}
              className="right-3 bottom-3"
            />
          )}
        </div>
      )}
    </div>
  )
}

/** The loop over its still, or the still alone, or the placeholder with the brief. Always 16:9. */
function Media({ item, play, paused, sizes }: { item: ServiceRowItem; play: boolean; paused: boolean; sizes: string }) {
  if (item.loop && item.poster) {
    return <LoopVideo src={item.loop} poster={item.poster} mode="row" open={play} paused={paused} aspect="16/9" sizes={sizes} />
  }
  return <Figure kind="video" subject={item.brief} photo={item.poster} aspect="16/9" sizes={sizes} />
}
