import { formatDays, formatTime, type SiteSettings } from '@/lib/site'

/**
 * Opening hours as a definition list, then the optional note on its own
 * line. The remote Saturday belongs in the note, not the rows: the rows are
 * physical hours only, the same set the JSON-LD publishes.
 */
export function Hours({
  hours,
  note,
  className = '',
}: {
  hours: SiteSettings['hours']
  note?: string
  className?: string
}) {
  return (
    <div className={className}>
      <dl className="grid gap-1">
        {hours.map((row) => (
          <div key={row.days.join()} className="flex flex-wrap gap-x-3">
            <dt className="font-medium">{formatDays(row.days)}</dt>
            <dd className="tabular-nums">
              {`${formatTime(row.opens)}-${formatTime(row.closes)}`}
            </dd>
          </div>
        ))}
      </dl>
      {note && <p className="mt-2 text-small">{note}</p>}
    </div>
  )
}
