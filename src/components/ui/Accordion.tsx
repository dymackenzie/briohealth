'use client'

import { useId, useState } from 'react'
import { Plus } from '@phosphor-icons/react'

/**
 * One open at a time. The first item is open by default so the section
 * reads without a click and the no-JavaScript render shows an answer.
 * Height and opacity animate (the one height transition the spec allows),
 * as grid rows from 0fr to 1fr, so the panel needs no measuring; reduced
 * motion snaps. A closed panel stays in the markup but is inert, so it is
 * out of the tab order and the accessibility tree.
 */
export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: { question: string; answer: string }[]
  defaultOpen?: number | null
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const baseId = useId()

  return (
    <div className="border-t border-b border-grey">
      {items.map((item, i) => {
        const isOpen = open === i
        const panelId = `${baseId}-panel-${i}`
        const buttonId = `${baseId}-button-${i}`

        return (
          <div key={item.question} className="border-b border-grey last:border-b-0">
            <h3 className="text-h3">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span>{item.question}</span>
                <Plus
                  size={24}
                  aria-hidden
                  className={`shrink-0 text-teal transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-[350ms] ease-out-expo motion-reduce:transition-none ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[60ch] pb-6 whitespace-pre-line text-ink-soft">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
