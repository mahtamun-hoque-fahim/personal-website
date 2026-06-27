

import type { Metadata } from 'next'
import { Syne, Onest, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const onest = Onest({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-onest',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Mahtamun Hoque Fahim — Designer & Developer',
    template: '%s | Fahim',
  },
  description:
    'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh. Crafting intentional digital experiences.',
  keywords: ['designer', 'developer', 'Bangladesh', 'UI/UX', 'graphic design', 'fullstack','mahtamun','mahtamun hoque fahim','fahim'],
  authors: [{ name: 'Mahtamun Hoque Fahim' }],
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
  verification: {
    google: '8PIgBrmXnVMSgvDYawTHZ__GpsAuaihf-ZrNx2hfMoA',
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
      className={`${syne.variable} ${onest.variable} ${jetbrainsMono.variable}`}
    >
      <body style={{ fontFamily: 'var(--font-onest)' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Mahtamun Hoque Fahim',
              url: 'https://mahtamunhoquefahim.pages.dev',
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
