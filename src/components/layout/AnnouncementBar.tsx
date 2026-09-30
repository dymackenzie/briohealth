import Link from 'next/link'
import type { SiteSettings } from '@/lib/site'

/** One line across the top of every page, from site settings. Off by default. */
export function AnnouncementBar({ announcement }: { announcement: SiteSettings['announcement'] }) {
  if (!announcement || !announcement.text.trim()) return null

  const inner = announcement.href ? (
    <Link href={announcement.href} className="underline underline-offset-4 focus-visible:outline-paper">
      {announcement.text}
    </Link>
  ) : (
    announcement.text
  )

  return (
    <div className="bg-ink px-4 py-2 text-center text-small text-paper">
      <p>{inner}</p>
    </div>
  )
}
