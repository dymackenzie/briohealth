import type { NextConfig } from 'next'

/**
 * Pages that moved to a different path. Blog posts aren't here — there are 418
 * of them and proxy.ts handles those.
 */
const legacyRedirects = [
  ['/about-2', '/about'],
  ['/naturopathic', '/services/naturopathic'],
  ['/acupuncture-3', '/services/acupuncture'],
  ['/i-v-therapy', '/services/iv-therapy'],
  ['/book-now', '/book'],
  ['/contact-us', '/contact'],
  ['/contact-us-2', '/contact'],

  // Both still published on the live install. brio-home is the front page
  // under its own slug; the store page has been empty for years.
  ['/brio-home', '/'],
  ['/brio-health-store', '/'],

  // She's left and the page already 404s, so send it to About.
  ['/about-brio-integrative-health-centre/about-dr-neetu-dhiman', '/about'],
] as const

/**
 * Deliberately not redirected — these are blog posts, not pages:
 *
 *   /low-level-laser-therapy       (2010, 1124 words)
 *   /registered-massage-therapy    (2014)
 *   /weight-loss-in-richmond-bc    (2015)
 *   /liver-detox-program           (2010)
 *   /healthy-living-101-event      (2016)
 *   /workshop                      (2013)
 *   /about-kyra-sturrock           (2012, practitioner has left)
 *   /learn-more-about-linda        (2014, practitioner has left)
 *
 * The proposed IA treated these as service/program/team pages. They're
 * decade-old posts, untouched since publication, so pointing them at
 * /services/* would send traffic to pages we have no content for. proxy.ts
 * sends them to /blog/<slug> instead, where the content actually is.
 */

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Media stays on the WP host.
      { protocol: 'https', hostname: 'cms.yourbriohealth.com' },
      // Pre-cutover it's still on the apex.
      { protocol: 'https', hostname: 'yourbriohealth.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },

  // No trailing-slash variants needed — Next normalises `/foo/` to `/foo`
  // with its own 308 before any of these are consulted.
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }))
  },
}

export default nextConfig
