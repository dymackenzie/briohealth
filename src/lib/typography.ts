/**
 * Over this many characters the h1 used to drop a size. Both display
 * utilities are now the same serif size and line-height (0.98), so the
 * choice changes nothing today; it is kept as the hook for a long-heading
 * size if the scale ever needs one again.
 */
export const LONG_HEADING = 28

export function displayClass(heading: string): 'text-display' | 'text-display-long' {
  return heading.trim().length > LONG_HEADING ? 'text-display-long' : 'text-display'
}
