/**
 * The finished garden as a static picture, one SVG per breakpoint (served
 * by src/app/garden/[file]/route.ts, drawn from the same models). Shown
 * only without JavaScript, under save-data, or if the engine fails to load.
 * Decorative: the garden box carries the accessible name.
 */
export function StillPicture() {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet="/garden/lg.svg" />
      <source media="(min-width: 768px)" srcSet="/garden/md.svg" />
      <img src="/garden/sm.svg" alt="" decoding="async" className="absolute inset-0 h-full w-full" />
    </picture>
  )
}
