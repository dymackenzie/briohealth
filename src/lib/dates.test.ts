import { describe, expect, it } from 'vitest'

import { groupByMonth, monthLabel, shortDate } from './dates'

describe('blog dates', () => {
  it('reads the calendar date from the string, so midnight and the last day of a month stay put', () => {
    expect(monthLabel('2026-09-01T00:00:00')).toBe('September 2026')
    expect(shortDate('2026-08-31T23:59:59')).toBe('Aug 31')
    expect(shortDate('2026-09-28T10:00:00', true)).toBe('Sep 28, 2026')
  })

  it('groups consecutive posts by month, newest first, and starts a new group when the month changes', () => {
    const posts = [{ date: '2026-09-28T10:00:00' }, { date: '2026-09-01T09:00:00' }, { date: '2025-06-11T12:00:00' }, { date: '2024-03-13T08:00:00' }]
    const groups = groupByMonth(posts)
    expect(groups.map((g) => g.label)).toEqual(['September 2026', 'June 2025', 'March 2024'])
    expect(groups[0].items).toEqual(posts.slice(0, 2))
  })

  it('has no groups for no posts', () => {
    expect(groupByMonth([])).toEqual([])
  })
})
