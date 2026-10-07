import { describe, expect, it } from 'vitest'
import { byVisitor, narratedAutoplay, shouldPlayLoop, type LoopDecision, type NarratedDecision } from './video'

const base: LoopDecision = {
  mode: 'row',
  open: false,
  inView: false,
  reducedMotion: false,
  saveData: false,
  paused: false,
}

describe('shouldPlayLoop', () => {
  it('plays a row only while it is open and its media is in view', () => {
    expect(shouldPlayLoop({ ...base, open: true, inView: true })).toBe(true)
    expect(shouldPlayLoop({ ...base, open: true, inView: false })).toBe(false)
    // A closed row's media is clipped away; even a stray in-view reading must not play it.
    expect(shouldPlayLoop({ ...base, open: false, inView: true })).toBe(false)
  })

  it('plays the hero while in view, open or not', () => {
    expect(shouldPlayLoop({ ...base, mode: 'hero', inView: true })).toBe(true)
    expect(shouldPlayLoop({ ...base, mode: 'hero', inView: false, open: true })).toBe(false)
  })

  it('stays paused once the visitor pauses it, on a row or the hero', () => {
    const openRow = { ...base, open: true, inView: true }
    expect(shouldPlayLoop({ ...openRow, paused: true })).toBe(false)
    expect(shouldPlayLoop({ ...base, mode: 'hero', inView: true, paused: true })).toBe(false)
    // Resuming is the only way back.
    expect(shouldPlayLoop({ ...openRow, paused: false })).toBe(true)
  })

  it('never plays under reduced motion or save-data, even open and in view', () => {
    const on = { ...base, open: true, inView: true }
    expect(shouldPlayLoop({ ...on, reducedMotion: true })).toBe(false)
    expect(shouldPlayLoop({ ...on, mode: 'hero', reducedMotion: true })).toBe(false)
    expect(shouldPlayLoop({ ...on, saveData: true })).toBe(false)
    expect(shouldPlayLoop({ ...on, mode: 'hero', saveData: true })).toBe(false)
  })
})

const narrated: NarratedDecision = {
  ready: true,
  inView: true,
  reducedMotion: false,
  saveData: false,
  taken: false,
}

describe('narratedAutoplay', () => {
  it('plays once the page is ready and the video is in view, and pauses it out of view', () => {
    expect(narratedAutoplay(narrated)).toBe('play')
    expect(narratedAutoplay({ ...narrated, inView: false })).toBe('pause')
  })

  it('waits for the page to load and go idle', () => {
    expect(narratedAutoplay({ ...narrated, ready: false })).toBe('pause')
  })

  it('never plays under reduced motion or save-data', () => {
    expect(narratedAutoplay({ ...narrated, reducedMotion: true })).toBe('pause')
    expect(narratedAutoplay({ ...narrated, saveData: true })).toBe('pause')
  })

  it('keeps its hands off once the visitor has taken it, in view or not', () => {
    expect(narratedAutoplay({ ...narrated, taken: true })).toBeNull()
    expect(narratedAutoplay({ ...narrated, taken: true, inView: false })).toBeNull()
    // Pressed play under reduced motion: still theirs, never paused for them.
    expect(narratedAutoplay({ ...narrated, taken: true, reducedMotion: true })).toBeNull()
  })
})

describe('byVisitor', () => {
  it('counts a play or pause the page did not ask for as the visitor', () => {
    expect(byVisitor('play', 'play', true)).toBe(false)
    expect(byVisitor('pause', 'pause', true)).toBe(false)
    expect(byVisitor('play', null, true)).toBe(true)
    expect(byVisitor('pause', null, true)).toBe(true)
    // Paused while the page's play was pending, or played while its pause was.
    expect(byVisitor('pause', 'play', true)).toBe(true)
    expect(byVisitor('play', 'pause', true)).toBe(true)
  })

  it('counts turning the sound on, not the page muting it', () => {
    expect(byVisitor('volumechange', null, false)).toBe(true)
    expect(byVisitor('volumechange', 'play', true)).toBe(false)
  })
})
