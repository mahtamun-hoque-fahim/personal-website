

import type { Metadata } from 'next'
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import MintGlow from '@/components/MintGlow'
import { getCachedSiteSettings } from '@/lib/db/queries'
import './globals.css'

// Title-font comparison branch: display/heading role uses Syne (same as
// main), everything else (palette, body font, grid, etc.) stays on the
// mint rebrand from blog/tags-bottom-placement. See globals.css :root —
// --font-clash is repointed to var(--font-syne) below rather than the
// actual Clash Display typeface, so no component files needed touching.
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings()
  return {
    metadataBase: new URL('https://mahtamunhoquefahim.vercel.app'),
    title: {
      default: settings.title,
      template: '%s | Mahtamun',
    },
    description: settings.description,
    keywords: settings.keywords,
    authors: [{ name: 'Mahtamun Hoque Fahim' }],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://mahtamunhoquefahim.vercel.app',
      siteName: 'Mahtamun Hoque Fahim',
      title: settings.ogTitle,
      description: settings.ogDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.ogTitle,
      description: settings.ogDescription,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getCachedSiteSettings()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body style={{ fontFamily: 'var(--font-jakarta)' }}>
        <MintGlow />
        <div style={{ position: 'relative', zIndex: 1 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Mahtamun Hoque Fahim',
              url: 'https://mahtamunhoquefahim.vercel.app',
              jobTitle: settings.jobTitle,
              description: settings.description,
              ...(settings.avatarUrl ? { image: settings.avatarUrl } : {}),
              nationality: 'Bangladeshi',
              sameAs: [
                'https://github.com/mahtamun-hoque-fahim',
                'https://linkedin.com/in/mahtamun-hoque-fahim',
              ],
              knowsAbout: ['Next.js', 'React', 'TypeScript', 'AI Engineering', 'Full-Stack Development', 'Web Development', 'UI/UX Design'],
            }),
          }}
        />
        {children}
        </div>
      </body>
    </html>
  )
}
