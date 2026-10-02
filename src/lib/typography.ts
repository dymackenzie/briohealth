/**
 * Over this many characters the h1 used to drop a size; both display
 * utilities are now the same serif size, so this only chooses the tighter
 * line-height.
 */
export const LONG_HEADING = 28

export function displayClass(heading: string): 'text-display' | 'text-display-long' {
  return heading.trim().length > LONG_HEADING ? 'text-display-long' : 'text-display'
}
