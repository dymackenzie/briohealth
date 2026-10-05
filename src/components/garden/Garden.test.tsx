import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { gardenLabel } from '@/lib/garden/config'
import { Garden } from './Garden'
import { GardenStill } from './GardenStill'

// A static render is the server pass. These stand in for the browser after hydration.
const browser = vi.hoisted(() => ({ hydrated: true, reducedMotion: false, saveData: false }))
vi.mock('@/components/video/LoopVideo', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/components/video/LoopVideo')>()
  return {
    ...real,
    useLoopGates: () => ({
      hydrated: browser.hydrated,
      canHover: true,
      reducedMotion: browser.reducedMotion,
      saveData: browser.saveData,
      showVideo: browser.hydrated && !browser.reducedMotion && !browser.saveData,
    }),
  }
})

function render(env: Partial<typeof browser>) {
  Object.assign(browser, { hydrated: true, reducedMotion: false, saveData: false }, env)
  return renderToStaticMarkup(
    <Garden label={gardenLabel()}>
      <GardenStill />
    </Garden>,
  )
}

const imgBox = (html: string) => html.slice(html.indexOf('<div role="img"'), html.lastIndexOf('</canvas>'))

describe('Garden', () => {
  it('is one image to assistive tech, named for the five herbs, with the canvas hidden', () => {
    const html = render({})
    expect(html).toContain(`role="img" aria-label="${gardenLabel()}"`)
    expect(html).toContain('<canvas aria-hidden="true"')
  })

  it('renders the still for visitors without JavaScript, inside noscript, and nothing to pause', () => {
    const html = render({ hydrated: false })
    expect(html).toMatch(/<noscript>[^]*\/garden\/lg\.svg[^]*\/garden\/sm\.svg[^]*<\/noscript>/)
    expect(html).not.toContain('<button')
  })

  it('offers a pause button while it can move, outside the image, in the floor below', () => {
    const html = render({})
    expect(html).toContain('aria-label="Pause garden animation"')
    expect(html).toContain('aria-pressed="false"')
    expect(imgBox(html)).not.toContain('<button')
  })

  it('has nothing to pause under reduced motion', () => {
    expect(render({ reducedMotion: true })).not.toContain('<button')
  })

  it('shows the still, not the engine, under save-data', () => {
    const html = render({ saveData: true })
    expect(html).not.toContain('<button')
    expect(html.replace(/<noscript>[^]*?<\/noscript>/, '')).toContain('/garden/sm.svg')
  })

  it('stands the box on the teal floor, its top edge at the ground line', () => {
    expect(render({})).toMatch(/class="hero-field[^"]*bg-teal" style="top:66%/)
  })
})
