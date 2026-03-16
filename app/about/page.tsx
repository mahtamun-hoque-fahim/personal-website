export const runtime = 'edge'

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'The story of Mahtamun Hoque Fahim — designer, developer, and creative from Bangladesh.',
}

const timeline = [
  {
    year: '2019',
    title: 'First pixel, first commit',
    desc: 'Started designing out of curiosity — posters, logos, random experiments. Discovered that making things look good was only half the equation.',
  },
  {
    year: '2020',
    title: 'Code enters the picture',
    desc: 'Learned HTML, CSS, then JavaScript. Realized I could build what I was designing. That changed everything.',
  },
  {
    year: '2021',
    title: 'Going full-stack',
    desc: 'React, Node.js, databases. The gap between design and development started closing — by choice.',
  },
  {
    year: '2022',
    title: 'Professional work begins',
    desc: 'First real clients. First shipped products. First lessons in what people actually need versus what looks cool.',
  },
  {
    year: '2023',
    title: 'Design portfolio launches',
    desc: 'mahtamundesigns.vercel.app goes live. UI/UX work gets serious. Started building for international clients.',
  },
  {
    year: '2024+',
    title: 'Right now',
    desc: 'Open to meaningful projects. Building tools, designing systems, writing about process. Compounding every day.',
  },
]

const values = [
  {
    title: 'Craft over speed',
    desc: 'I\'d rather take longer and ship something I\'m proud of than rush and regret it.',
  },
  {
    title: 'Clarity is kindness',
    desc: 'Good design doesn\'t make people think. It makes them feel at home.',
  },
  {
    title: 'Context is everything',
    desc: 'Solutions should fit the problem — not templates, not trends.',
  },
  {
    title: 'Keep learning',
    desc: 'The tools change. The principles don\'t. I stay curious about both.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">

        {/* ── HEADER ── */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <p
            className="text-[#00e676] text-xs tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            About
          </p>
          <h1
            className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight text-[#f0ede6] mb-10"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Designer who codes.
            <br />
            <span className="text-[#00e676]">Developer who designs.</span>
          </h1>
          <p
            className="text-[#8a8a8a] text-xl max-w-2xl leading-relaxed"
            style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
          >
            I&apos;m Mahtamun Hoque Fahim. I grew up in Bangladesh with an internet connection
            and an obsession with how things look and work. That combination became a career.
          </p>
        </section>

        {/* ── STORY SECTION ── */}
        <section className="border-t border-[#1f1f1f]">
          <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2
                className="text-3xl font-bold text-[#f0ede6] mb-6"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                The honest story
              </h2>
              <div
                className="text-[#8a8a8a] leading-relaxed space-y-4 text-base"
                style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
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

            {/* Values */}
            <div>
              <h2
                className="text-3xl font-bold text-[#f0ede6] mb-6"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                What I believe
              </h2>
              <div className="space-y-6">
                {values.map((v) => (
                  <div key={v.title} className="border-l-2 border-[#1f1f1f] pl-5 hover:border-[#00e676] transition-colors duration-200 group">
                    <h3
                      className="text-[#f0ede6] font-semibold mb-1 group-hover:text-[#00e676] transition-colors"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {v.title}
                    </h3>
                    <p
                      className="text-[#8a8a8a] text-sm leading-relaxed"
                      style={{ fontFamily: "'Onest', sans-serif" }}
                    >
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="bg-[#0d0d0d] border-t border-b border-[#1f1f1f]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2
              className="text-4xl font-bold text-[#f0ede6] mb-16"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              How I got here
            </h2>
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-[52px] top-0 bottom-0 w-px bg-[#1f1f1f] hidden md:block" />

              <div className="space-y-12">
                {timeline.map((item, i) => (
                  <div key={item.year} className="flex gap-8 items-start">
                    {/* Year */}
                    <div className="shrink-0 w-24 text-right hidden md:block">
                      <span
                        className="text-sm font-medium"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: i === timeline.length - 1 ? '#00e676' : '#8a8a8a',
                        }}
                      >
                        {item.year}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="relative z-10 shrink-0 hidden md:block">
                      <div
                        className="w-3 h-3 rounded-full border-2 mt-1"
                        style={{
                          borderColor: i === timeline.length - 1 ? '#00e676' : '#2a2a2a',
                          background: i === timeline.length - 1 ? '#00e676' : '#0a0a0a',
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <p
                        className="text-xs text-[#8a8a8a] mb-1 md:hidden"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {item.year}
                      </p>
                      <h3
                        className="text-[#f0ede6] font-semibold text-lg mb-2"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-[#8a8a8a] text-sm leading-relaxed max-w-xl"
                        style={{ fontFamily: "'Onest', sans-serif" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TOOLS ── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2
            className="text-4xl font-bold text-[#f0ede6] mb-12"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Tools & stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1f1f1f]">
            {[
              { cat: 'Design', tools: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Framer', 'After Effects'] },
              { cat: 'Frontend', tools: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
              { cat: 'Backend', tools: ['Node.js', 'Supabase', 'PostgreSQL', 'REST APIs', 'Prisma'] },
              { cat: 'DevOps', tools: ['Vercel', 'GitHub', 'Git', 'Docker (basics)', 'CI/CD'] },
            ].map((col) => (
              <div key={col.cat} className="bg-[#0a0a0a] p-6">
                <p
                  className="text-[#00e676] text-xs tracking-widest uppercase mb-4"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {col.cat}
                </p>
                <ul className="space-y-2">
                  {col.tools.map((t) => (
                    <li
                      key={t}
                      className="text-[#8a8a8a] text-sm"
                      style={{ fontFamily: "'Onest', sans-serif" }}
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
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border border-[#1f1f1f] rounded-xl p-8">
            <div>
              <h3
                className="text-2xl font-bold text-[#f0ede6] mb-1"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Want to work together?
              </h3>
              <p
                className="text-[#8a8a8a] text-sm"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                I&apos;m selective about what I take on — which means I care about what you&apos;re building.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-[#00e676] text-black text-sm font-semibold rounded-full
                           hover:bg-[#00b85a] transition-all duration-200"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Get in touch
              </Link>
              <a
                href="https://mahtamundesigns.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 border border-[#1f1f1f] text-[#f0ede6] text-sm rounded-full
                           hover:border-[#8a8a8a] transition-all duration-200"
                style={{ fontFamily: "'Onest', sans-serif" }}
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
