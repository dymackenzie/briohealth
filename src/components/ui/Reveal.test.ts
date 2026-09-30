import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { watchReveal } from './Reveal'

type Callback = (entries: { isIntersecting: boolean }[]) => void

/** Stands in for the browser's observer; the test decides when it calls back. */
class FakeObserver {
  static last: FakeObserver | null = null
  callback: Callback
  disconnect = vi.fn()
  observe = vi.fn()

  constructor(callback: Callback) {
    this.callback = callback
    FakeObserver.last = this
  }

  deliver(isIntersecting: boolean) {
    this.callback([{ isIntersecting }])
  }
}

const node = {} as Element

describe('watchReveal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    FakeObserver.last = null
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('shows at once when there is no IntersectionObserver', () => {
    const show = vi.fn()
    watchReveal(node, show)

    expect(show).toHaveBeenCalledTimes(1)
  })

  it('stays hidden below the fold: the first callback cancels the failsafe', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    const show = vi.fn()
    watchReveal(node, show)

    FakeObserver.last!.deliver(false)
    vi.advanceTimersByTime(10_000)

    expect(show).not.toHaveBeenCalled()
  })

  it('shows once the element scrolls into view, then stops observing', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    const show = vi.fn()
    watchReveal(node, show)

    FakeObserver.last!.deliver(false)
    FakeObserver.last!.deliver(true)

    expect(show).toHaveBeenCalledTimes(1)
    expect(FakeObserver.last!.disconnect).toHaveBeenCalled()
  })

  it('shows after the failsafe when the observer never calls back', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    const show = vi.fn()
    watchReveal(node, show)

    vi.advanceTimersByTime(2499)
    expect(show).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(show).toHaveBeenCalledTimes(1)
  })

  it('cleans up: disconnects and cancels a pending failsafe', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    const show = vi.fn()
    const stop = watchReveal(node, show)

    stop()
    vi.advanceTimersByTime(10_000)

    expect(FakeObserver.last!.disconnect).toHaveBeenCalled()
    expect(show).not.toHaveBeenCalled()
  })
})
