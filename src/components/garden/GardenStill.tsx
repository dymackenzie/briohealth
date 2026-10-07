import { StillPicture } from './StillPicture'

/**
 * What the server renders inside the garden: the finished still, for
 * visitors without JavaScript (and so for crawlers and print previews made
 * without it). A visitor with JavaScript never fetches it; the engine grows
 * the same garden on the canvas.
 */
export function GardenStill() {
  return (
    <noscript>
      <StillPicture />
    </noscript>
  )
}
