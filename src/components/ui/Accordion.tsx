'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PortableText } from '@portabletext/react'

interface AccordionItem {
  question: string
  answer: any
}

interface AccordionProps {
  items: AccordionItem[]
}

function AccordionItem({ item, index }: { item: AccordionItem; index: number }) {
  const [open, setOpen] = useState(false)
  const id = `accordion-${index}`

  return (
    <div className="border-b border-sand-300 last:border-0">
      <button
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 cursor-pointer group"
      >
        <span className="font-body font-semibold text-ink-900 group-hover:text-teal-500 transition-colors text-base">
          {item.question}
        </span>
        <ChevronDown
          className={`shrink-0 text-teal-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[1000px] pb-5' : 'max-h-0'}`}
      >
        <div className="prose text-ink-700 text-[0.9375rem]">
          {typeof item.answer === 'string' ? (
            <p>{item.answer}</p>
          ) : (
            <PortableText value={item.answer} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function Accordion({ items }: AccordionProps) {
  return (
    <div className="divide-y divide-sand-300 rounded-[var(--r-lg)] border border-sand-300 bg-paper px-6 shadow-sm">
      {items.map((item, i) => (
        <AccordionItem key={i} item={item} index={i} />
      ))}
    </div>
  )
}
