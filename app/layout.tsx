

import type { Metadata } from 'next'
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import MintGlow from '@/components/MintGlow'
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

export const metadata: Metadata = {
  metadataBase: new URL('https://mahtamunhoquefahim.vercel.app'),
  title: {
    default: 'Mahtamun Hoque Fahim — Full-Stack Developer & AI Engineer',
    template: '%s | Mahtamun',
  },
  description:
    'Full-stack developer and AI engineer from Bangladesh. Building web apps, tools, and digital products.',
  keywords: ['developer', 'AI engineer', 'full-stack developer', 'Bangladesh', 'Next.js', 'TypeScript', 'mahtamun', 'mahtamun hoque fahim'],
  authors: [{ name: 'Mahtamun Hoque Fahim' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mahtamunhoquefahim.vercel.app',
    siteName: 'Mahtamun Hoque Fahim',
    title: 'Mahtamun Hoque Fahim — Full-Stack Developer & AI Engineer',
    description: 'Full-stack developer and AI engineer from Bangladesh. Building web apps, tools, and digital products.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahtamun Hoque Fahim',
    description: 'Full-stack developer and AI engineer from Bangladesh. Building web apps, tools, and digital products.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
              jobTitle: 'Full-Stack Developer & AI Engineer',
              description: 'Full-stack developer and AI engineer from Bangladesh. Building web apps, tools, and digital products.',
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
