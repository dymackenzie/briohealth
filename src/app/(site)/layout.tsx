import { client, isSanityConfigured } from '@/sanity/lib/client'
import { siteSettingsQuery, navigationQuery } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import SkipLink from '@/components/layout/SkipLink'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, navigation] = isSanityConfigured
    ? await Promise.all([
        client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } }).catch(() => null),
        client.fetch(navigationQuery, {}, { next: { tags: ['navigation'] } }).catch(() => null),
      ])
    : [null, null]

  return (
    <>
      <SkipLink />
      {settings?.announcementEnabled && (
        <AnnouncementBar
          text={settings.announcementText}
          link={settings.announcementLink}
          tone={settings.announcementTone}
        />
      )}
      <Header navigation={navigation} settings={settings} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer navigation={navigation} settings={settings} />
    </>
  )
}
