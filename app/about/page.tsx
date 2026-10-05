

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'The story of Mahtamun Hoque Fahim — designer, developer, and creative from Bangladesh.',
  alternates: {
    canonical: 'https://mahtamunhoquefahim.vercel.app/about',
  },
}

export default function AboutPage() {
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
          <h1
            className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight text-[#F3F6F4] mb-10"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Designer who codes.
            <br />
            <span className="text-[#3DF49A]">Developer who designs.</span>
          </h1>
          <p
            className="text-[#8A938E] text-xl max-w-2xl leading-relaxed"
            style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
          >
            I&apos;m Mahtamun Hoque Fahim. I grew up in Bangladesh with an internet connection
            and an obsession with how things look and work. That combination became a career.
          </p>
        </section>

        {/* ── STORY SECTION ── */}
        <section className="border-t border-[#1F2421]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="max-w-2xl">
              <h2
                className="text-3xl font-bold text-[#F3F6F4] mb-6"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                The honest story
              </h2>
              <div
                className="text-[#8A938E] leading-relaxed space-y-4 text-base"
                style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
              >
                <p>
                  I didn&apos;t study design in a formal school. I learned by obsessively reverse-engineering
                  things I loved — breaking down why a logo felt trustworthy, why a website felt fast, why
                  some interfaces made you feel calm.
                </p>
                <p>
                  I started building websites because I couldn&apos;t communicate what I wanted to developers.
                  I started designing seriously because I couldn&apos;t stand ugly interfaces. Both accidents
                  became strengths.
                </p>
                <p>
                  Being from Bangladesh sharpened me. I couldn&apos;t rely on proximity to opportunity —
                  I had to be undeniably good. That&apos;s still the standard I hold myself to.
                </p>
                <p>
                  I care about work that ships, that works, that people actually use. Beautiful for its own
                  sake doesn&apos;t interest me. Beautiful and functional? That&apos;s the whole game.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TOOLS ── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2
            className="text-4xl font-bold text-[#F3F6F4] mb-12"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Tools & stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1F2421]">
            {[
              { cat: 'Design', tools: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Framer', 'After Effects'] },
              { cat: 'Frontend', tools: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
              { cat: 'Backend', tools: ['Node.js', 'Neon (PostgreSQL)', 'Drizzle ORM', 'Better Auth', 'REST APIs'] },
              { cat: 'DevOps', tools: ['Vercel', 'GitHub', 'Git', 'Docker (basics)', 'CI/CD'] },
            ].map((col) => (
              <div key={col.cat} className="bg-[#070807] p-6">
                <p
                  className="text-[#3DF49A] text-xs tracking-widest uppercase mb-4"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  {col.cat}
                </p>
                <ul className="space-y-2">
                  {col.tools.map((t) => (
                    <li
                      key={t}
                      className="text-[#8A938E] text-sm"
                      style={{ fontFamily: 'var(--font-jakarta)' }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border border-[#1F2421] rounded-xl p-8">
            <div>
              <h3
                className="text-2xl font-bold text-[#F3F6F4] mb-1"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                Want to work together?
              </h3>
              <p
                className="text-[#8A938E] text-sm"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                I&apos;m selective about what I take on — which means I care about what you&apos;re building.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
              <Link
                href="/contact"
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-full
                           hover:bg-[#5BFBA8] transition-all duration-200"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Get in touch
              </Link>
              <a
                href="https://mahtamundesigns.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-2.5 border border-[#1F2421] text-[#F3F6F4] text-sm rounded-full
                           hover:border-[#8A938E] transition-all duration-200"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                See portfolio ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
