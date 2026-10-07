import { describe, expect, it } from 'vitest'
import { displayClass, LONG_HEADING } from './typography'

describe('displayClass', () => {
  it('uses the full display size for a short heading', () => {
    expect(displayClass('Feel like yourself again.')).toBe('text-display')
  })

  it('keeps the full size at exactly the limit', () => {
    expect(displayClass('a'.repeat(LONG_HEADING))).toBe('text-display')
  })

  it('picks the long-heading utility one character over the limit', () => {
    expect(displayClass('a'.repeat(LONG_HEADING + 1))).toBe('text-display-long')
  })

  it('ignores surrounding whitespace from the CMS', () => {
    expect(displayClass('   ' + 'a'.repeat(LONG_HEADING) + '  \n')).toBe('text-display')
  })

  it('treats an empty heading as short', () => {
    expect(displayClass('')).toBe('text-display')
  })
})
