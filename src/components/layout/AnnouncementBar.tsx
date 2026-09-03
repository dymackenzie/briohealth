'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AnnouncementBarProps {
  text?: string
  link?: string
  tone?: 'teal' | 'coral' | 'ink'
}

const toneStyles = {
  teal: 'bg-teal-700 text-white',
  coral: 'bg-coral-500 text-white',
  ink: 'bg-ink-900 text-white',
}

export default function AnnouncementBar({ text, link, tone = 'teal' }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false)
  if (!text || dismissed) return null

  const content = link ? (
    <a href={link} className="underline hover:no-underline">{text}</a>
  ) : (
    <span>{text}</span>
  )

  return (
    <div className={`relative py-2.5 px-4 text-center text-sm font-body font-medium ${toneStyles[tone]}`} role="banner">
      {content}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  )
}
