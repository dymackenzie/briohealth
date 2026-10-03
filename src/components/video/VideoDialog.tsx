'use client'

import { useRef, useState } from 'react'
import { X } from '@phosphor-icons/react'

import { Button } from '@/components/ui/Button'

/**
 * "Watch the video": a native <dialog> with the YouTube (nocookie) iframe,
 * which exists only while the dialog is open so nothing loads or plays
 * before it is asked for. Esc fires the dialog's close event; the close
 * button calls close(); either way `open` goes false, the iframe is
 * removed and focus returns to the trigger. `embedUrl` comes from
 * youtubeEmbedUrl, so it is always a youtube-nocookie.com/embed URL.
 */
export function VideoDialog({
  embedUrl,
  label = 'Watch the video',
  on = 'dark',
}: {
  embedUrl: string
  label?: string
  /** The surface the trigger sits on: the ink wash, or the teal field when a service has no photo. */
  on?: 'dark' | 'teal'
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  function show() {
    setOpen(true)
    dialog.current?.showModal()
  }

  function onClose() {
    setOpen(false)
    trigger.current?.querySelector('button')?.focus()
  }

  return (
    <>
      {/* Button renders a <button> when it has no href; the wrapper is only where focus returns to. */}
      <div ref={trigger} className="inline-block">
        <Button variant="outline" on={on} onClick={show}>
          {label}
        </Button>
      </div>
      <dialog
        ref={dialog}
        onClose={onClose}
        aria-label={label}
        className="m-auto w-[min(92vw,960px)] rounded-brand bg-ink p-0 backdrop:bg-ink/85"
      >
        <div className="flex justify-end p-2">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close video"
            className="flex h-11 w-11 items-center justify-center rounded-brand text-paper focus-visible:outline-paper"
          >
            <X size={24} aria-hidden />
          </button>
        </div>
        {open && (
          <iframe
            src={embedUrl}
            title={label}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full"
          />
        )}
      </dialog>
    </>
  )
}
