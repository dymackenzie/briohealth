import type { Metadata } from 'next'
import { Funnel_Display, Funnel_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'

import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { TopBar } from '@/components/layout/TopBar'
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

/* The editorial serif. The site sets it at two points only, roman 500 and
   italic 400, so these are Google's static-weight files for exactly those,
   optical-size axis kept, latin subset: 124KB against 279KB for the full
   weight range (next/font/google won't pin a weight while `axes` is set).
   Source: fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;1,6..72,400
   Serif text set heavier than 500 would get synthetic bold. The const's
   name is the font-family name. */
const newsreader = localFont({
  src: [
    { path: '../fonts/newsreader-roman-500-latin.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/newsreader-italic-400-latin.woff2', weight: '400', style: 'italic' },
  ],
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
  variable: '--font-newsreader',
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
    <html lang="en-CA" className={`${display.variable} ${sans.variable} ${newsreader.variable}`} suppressHydrationWarning>
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
        <TopBar settings={settings} />
        <Header settings={settings} />
        {children}
        <Footer settings={settings} />
        <Analytics />
      </body>
    </html>
  )
}
