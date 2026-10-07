/**
 * An empty WordPress field falls back to the code's copy; it never blanks a
 * section (spec section 8). "Empty" is null, undefined, a blank string or an
 * empty array. Zero and false are real values and win. Plain nested objects
 * merge one level down so a group field with one blank sub-field keeps the
 * rest of the group.
 */

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function withFallback<T extends object>(
  wp: Partial<T> | null | undefined,
  fallback: T,
): T {
  if (!wp) return { ...fallback }

  const base = fallback as Record<string, unknown>
  const out: Record<string, unknown> = { ...base }

  for (const [key, value] of Object.entries(wp)) {
    if (isEmpty(value)) continue

    const fallbackValue = base[key]
    if (isPlainObject(value) && isPlainObject(fallbackValue)) {
      out[key] = withFallback(value, fallbackValue)
    } else {
      out[key] = value
    }
  }

  return out as T
}
