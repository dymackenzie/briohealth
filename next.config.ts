import type { NextConfig } from 'next'

/**
 * Pages that moved. Blog posts are not here: there are 418 of them and
 * src/proxy.ts handles those.
 */
const legacyRedirects = [
  ['/about-2', '/about'],
  ['/naturopathic', '/services/naturopathic'],
  ['/acupuncture-3', '/services/acupuncture'],
  ['/i-v-therapy', '/services/iv-therapy'],
  ['/book-now', '/new-patient'],
  // Signal's /book became /new-patient in revision 1.
  ['/book', '/new-patient'],
  ['/contact-us', '/contact'],
  ['/contact-us-2', '/contact'],
  // Both still published on the live install: brio-home is the front page
  // under its own slug; the store page has been empty for years.
  ['/brio-home', '/'],
  ['/brio-health-store', '/'],
  // She has left and the page already 404s, so send it to About.
  ['/about-brio-integrative-health-centre/about-dr-neetu-dhiman', '/about'],
] as const

/**
 * Deliberately not redirected, because they are blog posts, not pages, and
 * the proxy sends them to /blog/<slug> where the content is:
 * /low-level-laser-therapy, /registered-massage-therapy,
 * /weight-loss-in-richmond-bc, /liver-detox-program, /healthy-living-101-event,
 * /workshop, /about-kyra-sturrock, /learn-more-about-linda.
 */

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Media stays on the WordPress host.
      { protocol: 'https', hostname: 'cms.yourbriohealth.com' },
      // Pre-cutover it is still on the apex.
      { protocol: 'https', hostname: 'yourbriohealth.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },

  // Next normalises /foo/ to /foo with its own 308 before these are consulted.
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }))
  },
}

export default nextConfig
