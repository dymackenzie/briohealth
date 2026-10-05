import { describe, expect, it } from 'vitest'
import { shouldPlayLoop, youtubeEmbedUrl, type LoopDecision } from './video'

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
