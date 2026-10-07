import { describe, expect, it } from 'vitest'
import { gardenStartMode, shouldAnimateGarden } from './gates'

const base = { paused: false, reducedMotion: false, saveData: false, hidden: false, inView: true }

describe('shouldAnimateGarden', () => {
  it('animates in view with nothing against it', () => {
    expect(shouldAnimateGarden(base)).toBe(true)
  })

  it.each(['paused', 'reducedMotion', 'saveData', 'hidden'] as const)('stops for %s', (k) => {
    expect(shouldAnimateGarden({ ...base, [k]: true })).toBe(false)
  })

  it('stops when the box leaves the viewport', () => {
    expect(shouldAnimateGarden({ ...base, inView: false })).toBe(false)
  })
})

describe('gardenStartMode', () => {
  it('grows from seed by default', () => {
    expect(gardenStartMode({ saveData: false, reducedMotion: false })).toBe('grow')
  })

  it('draws the finished garden once under reduced motion', () => {
    expect(gardenStartMode({ saveData: false, reducedMotion: true })).toBe('static')
  })

  it('never loads the engine under save-data: the still stands in', () => {
    expect(gardenStartMode({ saveData: true, reducedMotion: false })).toBe('still')
    expect(gardenStartMode({ saveData: true, reducedMotion: true })).toBe('still')
  })
})
