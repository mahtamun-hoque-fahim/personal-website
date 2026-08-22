

import type { Metadata } from 'next'
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
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
    default: 'Mahtamun Hoque Fahim — Designer & Developer',
    template: '%s | Mahtamun',
  },
  description:
    'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh. Crafting intentional digital experiences.',
  keywords: ['designer', 'developer', 'Bangladesh', 'UI/UX', 'graphic design', 'fullstack','mahtamun','mahtamun hoque fahim'],
  authors: [{ name: 'Mahtamun Hoque Fahim' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mahtamunhoquefahim.vercel.app',
    siteName: 'Mahtamun Hoque Fahim',
    title: 'Mahtamun Hoque Fahim — Senior Designer & Full Stack Developer',
    description: 'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahtamun Hoque Fahim',
    description: 'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Mahtamun Hoque Fahim',
              url: 'https://mahtamunhoquefahim.vercel.app',
              jobTitle: 'Graphic Designer & Full-Stack Developer',
              description: 'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh.',
              nationality: 'Bangladeshi',
              sameAs: [
                'https://github.com/mahtamun-hoque-fahim',
                'https://linkedin.com/in/mahtamun-hoque-fahim',
              ],
              knowsAbout: ['Graphic Design', 'UI/UX Design', 'Next.js', 'React', 'TypeScript', 'Brand Identity','web development'],
            }),
          }}
        />
        {children}
      </body>
    </html>
  )
}
