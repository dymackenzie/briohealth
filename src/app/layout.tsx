import type { Metadata } from 'next'
import { Funnel_Display, Funnel_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { siteOpenGraph } from '@/lib/seo'
import { defaultDescription, site } from '@/lib/site'
import { getSiteSettings } from '@/lib/wp/queries'
import './globals.css'

/* Both are variable fonts on Google Fonts, so no weight list is needed. */
const display = Funnel_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-funnel-display',
})

const sans = Funnel_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-funnel-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: defaultDescription,
  openGraph: { ...siteOpenGraph, type: 'website' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    // The inline script adds a class before React hydrates, so server and
    // client markup differ here on purpose.
    <html lang="en-CA" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Gates every hidden-until-revealed state. Inline and synchronous so
            nothing flashes; with no JavaScript the class never lands and the
            page renders complete. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-brand focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <AnnouncementBar announcement={settings.announcement} />
        <Header settings={settings} />
        {children}
        <Footer settings={settings} />
        <Analytics />
      </body>
    </html>
  )
}
