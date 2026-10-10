

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getCachedAboutContent } from '@/lib/db/queries'
import BlurWords from '@/components/BlurWords'
import type { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'About',
  description: 'The story of Mahtamun Hoque Fahim — designer, developer, and creative from Bangladesh.',
  alternates: {
    canonical: 'https://mahtamunhoquefahim.vercel.app/about',
  },
}

export default async function AboutPage() {
  const about = await getCachedAboutContent()

  return (
    <>
      <Navbar />
      <main className="pt-32">

        {/* ── HEADER ── */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <p
            className="text-[#3DF49A] text-xs tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            About
          </p>
          <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight text-[#F3F6F4] mb-10" style={{ fontFamily: 'var(--font-clash)' }}>
            <BlurWords text={about.headlineTop} mode="load" className="block" />
            <BlurWords text={about.headlineAccent} mode="load" delay={140} className="block text-[#3DF49A]" />
          </h1>
          <p
            className="blur-load text-[#8A938E] text-xl max-w-2xl leading-relaxed"
            style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300, '--reveal-delay': '220ms' } as CSSProperties}
          >
            {about.intro}
          </p>
        </section>

        {/* ── STORY SECTION ── */}
        <section className="border-t border-[#333333]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="max-w-2xl">
              <BlurWords as="h2" text={about.storyHeading} className="text-3xl font-bold text-[#F3F6F4] mb-6" style={{ fontFamily: 'var(--font-clash)' }} />
              <div
                className="text-[#8A938E] leading-relaxed space-y-4 text-base"
                style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
              >
                {about.storyParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border border-[#333333] rounded-xl p-8">
            <div>
              <h3
                className="text-2xl font-bold text-[#F3F6F4] mb-1"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                {about.ctaHeading}
              </h3>
              <p
                className="text-[#8A938E] text-sm"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {about.ctaText}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
              <Link
                href="/contact"
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-full
                           hover:bg-[#5BFBA8] transition-[background-color,transform] duration-200 active:scale-[0.97]"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {about.ctaPrimaryLabel}
              </Link>
              <a
                href="https://mahtamundesigns.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-2.5 border border-[#333333] text-[#F3F6F4] text-sm rounded-full
                           hover:border-[#8A938E] transition-[border-color,color,transform] duration-200 active:scale-[0.97]"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {about.ctaSecondaryLabel} ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
