import { describe, expect, it } from 'vitest'
import { shouldPlayLoop, youtubeEmbedUrl, type LoopDecision } from './video'

const base: LoopDecision = {
  mode: 'tile',
  hovered: false,
  focused: false,
  inView: false,
  canHover: true,
  reducedMotion: false,
  saveData: false,
  paused: false,
}

describe('shouldPlayLoop', () => {
  it('plays a tile on hover or focus when the device can hover', () => {
    expect(shouldPlayLoop({ ...base, hovered: true })).toBe(true)
    expect(shouldPlayLoop({ ...base, focused: true })).toBe(true)
    expect(shouldPlayLoop(base)).toBe(false)
  })

  it('plays a tile while in view on a device that cannot hover, and ignores hover there', () => {
    expect(shouldPlayLoop({ ...base, canHover: false, inView: true })).toBe(true)
    expect(shouldPlayLoop({ ...base, canHover: false, inView: false, hovered: true })).toBe(false)
  })

  it('plays the hero while in view, whatever the pointer does', () => {
    expect(shouldPlayLoop({ ...base, mode: 'hero', inView: true })).toBe(true)
    expect(shouldPlayLoop({ ...base, mode: 'hero', inView: false, hovered: true, focused: true })).toBe(false)
  })

  it('stays paused once the visitor pauses it, in view or not, on a tile or the hero', () => {
    const touchTile = { ...base, canHover: false, inView: true }
    expect(shouldPlayLoop({ ...touchTile, paused: true })).toBe(false)
    expect(shouldPlayLoop({ ...base, mode: 'hero', inView: true, paused: true })).toBe(false)
    expect(shouldPlayLoop({ ...base, hovered: true, focused: true, paused: true })).toBe(false)
    // Resuming is the only way back.
    expect(shouldPlayLoop({ ...touchTile, paused: false })).toBe(true)
  })

  it('never plays under reduced motion or save-data, even on hover and in view', () => {
    const on = { ...base, hovered: true, focused: true, inView: true }
    expect(shouldPlayLoop({ ...on, reducedMotion: true })).toBe(false)
    expect(shouldPlayLoop({ ...on, mode: 'hero', reducedMotion: true })).toBe(false)
    expect(shouldPlayLoop({ ...on, saveData: true })).toBe(false)
    expect(shouldPlayLoop({ ...on, mode: 'hero', canHover: false, saveData: true })).toBe(false)
  })
})

describe('youtubeEmbedUrl', () => {
  const embed = 'https://www.youtube-nocookie.com/embed/mYhjmq7-1q8?autoplay=1&cc_load_policy=1&rel=0'

  it('reads watch, short and embed forms', () => {
    expect(youtubeEmbedUrl('https://www.youtube.com/watch?v=mYhjmq7-1q8&t=10')).toBe(embed)
    expect(youtubeEmbedUrl('https://youtu.be/mYhjmq7-1q8')).toBe(embed)
    expect(youtubeEmbedUrl('https://www.youtube.com/embed/mYhjmq7-1q8')).toBe(embed)
    expect(youtubeEmbedUrl('https://youtube.com/shorts/mYhjmq7-1q8?feature=share')).toBe(embed)
  })

  it('returns null for anything that is not a YouTube video', () => {
    expect(youtubeEmbedUrl('https://vimeo.com/123')).toBeNull()
    expect(youtubeEmbedUrl('https://evil.example/watch?v=mYhjmq7-1q8')).toBeNull()
    expect(youtubeEmbedUrl('https://www.youtube.com/user/brio')).toBeNull()
    expect(youtubeEmbedUrl('not a url')).toBeNull()
    expect(youtubeEmbedUrl('')).toBeNull()
    expect(youtubeEmbedUrl(null)).toBeNull()
    expect(youtubeEmbedUrl(undefined)).toBeNull()
  })
})
