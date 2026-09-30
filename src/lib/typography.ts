/** Over this many characters the h1 cap drops from 92px to 60px (spec section 4). */
export const LONG_HEADING = 28

export function displayClass(heading: string): 'text-display' | 'text-display-long' {
  return heading.trim().length > LONG_HEADING ? 'text-display-long' : 'text-display'
}
