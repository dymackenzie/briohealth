/**
 * Blog dates. WordPress sends `date` as the site's local time with no
 * zone ("2026-09-28T10:00:00"), so these read the calendar date straight
 * from the string: nothing goes through Date, and a server in UTC can't
 * shift a post to the day or month before.
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parts(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return { year, month, day }
}

/** "September 2026". */
export function monthLabel(iso: string) {
  const { year, month } = parts(iso)
  return `${MONTHS[month - 1]} ${year}`
}

/** "Sep 28", or "Sep 28, 2026" with the year. */
export function shortDate(iso: string, withYear = false) {
  const { year, month, day } = parts(iso)
  const date = `${MONTHS[month - 1].slice(0, 3)} ${day}`
  return withYear ? `${date}, ${year}` : date
}

/** Consecutive items from the same month, in the order given (newest first from WordPress). */
export function groupByMonth<T extends { date: string }>(items: T[]) {
  const groups: { key: string; label: string; items: T[] }[] = []
  for (const item of items) {
    const key = item.date.slice(0, 7)
    const last = groups[groups.length - 1]
    if (last?.key === key) last.items.push(item)
    else groups.push({ key, label: monthLabel(item.date), items: [item] })
  }
  return groups
}
