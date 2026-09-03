import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/about-2/', destination: '/about', permanent: true },
      { source: '/about-2', destination: '/about', permanent: true },
      { source: '/about-brio-integrative-health-centre/about-dr-neetu-dhiman/', destination: '/about/team/neetu-dhiman', permanent: true },
      { source: '/about-kyra-sturrock/', destination: '/about/team/kyra-sturrock', permanent: true },
      { source: '/learn-more-about-linda/', destination: '/about/team/linda-mclaren', permanent: true },
      { source: '/naturopathic/', destination: '/services/naturopathic', permanent: true },
      { source: '/naturopathic', destination: '/services/naturopathic', permanent: true },
      { source: '/acupuncture-3/', destination: '/services/acupuncture', permanent: true },
      { source: '/acupuncture-3', destination: '/services/acupuncture', permanent: true },
      { source: '/i-v-therapy/', destination: '/services/iv-therapy', permanent: true },
      { source: '/i-v-therapy', destination: '/services/iv-therapy', permanent: true },
      { source: '/low-level-laser-therapy/', destination: '/services/low-level-laser-therapy', permanent: true },
      { source: '/registered-massage-therapy/', destination: '/services/registered-massage-therapy', permanent: true },
      { source: '/pickleball/', destination: '/pickleball', permanent: true },
      { source: '/weight-loss-in-richmond-bc/', destination: '/programs/weight-loss-rehab', permanent: true },
      { source: '/weight-loss-in-richmond-bc', destination: '/programs/weight-loss-rehab', permanent: true },
      { source: '/liver-detox-program/', destination: '/programs/liver-detox', permanent: true },
      { source: '/healthy-living-101-event/', destination: '/programs/healthy-living-101', permanent: true },
      { source: '/workshop/', destination: '/programs/workshops', permanent: true },
      { source: '/book-now/', destination: '/book', permanent: true },
      { source: '/book-now', destination: '/book', permanent: true },
      { source: '/contact-us/', destination: '/contact', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/blog/', destination: '/blog', permanent: true },
      { source: '/privacy-policy/', destination: '/privacy-policy', permanent: true },
      { source: '/terms-of-use/', destination: '/terms-of-use', permanent: true },
      // Legacy blog posts — catch-all for root-level slugs that are blog posts
      // handled by middleware
    ]
  },
}

export default nextConfig
