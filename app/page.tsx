export const runtime = 'edge'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getSupabase, type BlogPost } from '@/lib/supabase'

const services = [
  { num: '01', title: 'Graphic Design', desc: 'Brand identities, print, visual systems — design that speaks before words do.' },
  { num: '02', title: 'UI/UX Design', desc: 'Interfaces that feel inevitable. User flows that guide without friction.' },
  { num: '03', title: 'Full-Stack Dev', desc: 'Next.js, React, databases. I build what I design — no handoff required.' },
]

const skills = [
  'Figma', 'Adobe Suite', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS',
  'Supabase', 'PostgreSQL', 'Node.js', 'Brand Identity', 'Motion Design', 'Framer',
]

const ticker = [...skills, ...skills]

export default async function HomePage() {
  const supabase = getSupabase()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, tags, reading_time, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const recentPosts = (posts ?? []) as Pick<BlogPost, 'id' | 'title' | 'slug' | 'excerpt' | 'tags' | 'reading_time' | 'created_at'>[]
  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col justify-end pb-20 px-6 pt-32 relative overflow-hidden">
          {/* Background accent glow */}
          <div
            className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(0,230,118,0.06) 0%, transparent 70%)',
            }}
          />

          {/* Floating label top-right */}
          <div className="absolute top-32 right-6 md:right-16 text-right hidden md:block">
            <p className="text-[#8a8a8a] text-xs tracking-[0.2em] uppercase mb-1" style={{ fontFamily: "'Onest', sans-serif" }}>
              Based in
            </p>
            <p className="text-[#f0ede6] text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
              Bangladesh
            </p>
          </div>

          <div className="max-w-6xl mx-auto w-full">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span
                className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"
              />
              <span
                className="text-[#00e676] text-xs tracking-[0.25em] uppercase"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Available for work
              </span>
            </div>

            {/* Main heading */}
            <h1
              className="text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight mb-8"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span className="block text-[#f0ede6]">Design.</span>
              <span className="block text-[#f0ede6]">Code.</span>
              <span className="block text-[#00e676]">Create.</span>
            </h1>

            {/* Sub */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12">
              <div className="max-w-md">
                <p
                  className="text-[#8a8a8a] text-lg leading-relaxed"
                  style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
                >
                  I&apos;m{' '}
                  <span className="text-[#f0ede6] font-medium">Mahtamun Hoque Fahim</span>
                  {' '}— a graphic designer, full-stack developer & UI/UX designer from Dhaka.
                  I make things that look good and work better.
                </p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/contact"
                  className="px-7 py-3 bg-[#00e676] text-black text-sm font-semibold rounded-full
                             hover:bg-[#00b85a] transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  Let&apos;s talk
                </Link>
                <Link
                  href="/about"
                  className="px-7 py-3 border border-[#1f1f1f] text-[#f0ede6] text-sm rounded-full
                             hover:border-[#8a8a8a] transition-all duration-200"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  About me
                </Link>
              </div>
            </div>

            {/* Horizontal rule with stat */}
            <div className="mt-16 pt-8 border-t border-[#1f1f1f] flex flex-wrap gap-12">
              {[
                { num: '4+', label: 'Years designing' },
                { num: '50+', label: 'Projects shipped' },
                { num: '∞', label: 'Coffee consumed' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="text-3xl font-bold text-[#f0ede6]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {stat.num}
                  </p>
                  <p
                    className="text-[#8a8a8a] text-sm mt-1"
                    style={{ fontFamily: "'Onest', sans-serif" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TICKER ── */}
        <div className="overflow-hidden border-y border-[#1f1f1f] py-4 bg-[#0d0d0d]">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {ticker.map((skill, i) => (
              <span
                key={i}
                className="text-sm tracking-widest uppercase shrink-0"
                style={{
                  fontFamily: "'Onest', sans-serif",
                  color: i % 3 === 0 ? '#00e676' : '#8a8a8a',
                }}
              >
                {skill}
                <span className="ml-12 text-[#1f1f1f]">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── WHAT I DO ── */}
        <section className="max-w-6xl mx-auto px-6 py-28">
          <div className="flex flex-col md:flex-row gap-6 md:items-end mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold text-[#f0ede6]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              What I do
            </h2>
            <span
              className="text-[#8a8a8a] text-sm md:mb-2"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              — three disciplines, one person
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1f1f1f]">
            {services.map((s) => (
              <div
                key={s.num}
                className="bg-[#0a0a0a] p-8 group hover:bg-[#0f0f0f] transition-colors duration-300"
              >
                <span
                  className="text-[#2a2a2a] text-5xl font-bold block mb-6 group-hover:text-[#00e676] transition-colors duration-300"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {s.num}
                </span>
                <h3
                  className="text-xl font-semibold text-[#f0ede6] mb-3"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[#8a8a8a] text-sm leading-relaxed"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PERSONALITY SECTION ── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-[#00e676] text-xs tracking-[0.2em] uppercase mb-6"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                The honest version
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#f0ede6] mb-6 leading-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                I don&apos;t separate design from engineering.
              </h2>
              <p
                className="text-[#8a8a8a] text-base leading-relaxed mb-6"
                style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
              >
                Most designers hand off to developers. Most developers complain about the Figma files.
                I do both — which means the gap doesn&apos;t exist for me.
              </p>
              <p
                className="text-[#8a8a8a] text-base leading-relaxed mb-10"
                style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
              >
                I care obsessively about the space between pixels. I write code the way
                I design — with intention. I&apos;m from Bangladesh, building work that competes globally.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#00e676] text-sm group"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Full story
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Code aesthetic block */}
            <div
              className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-8"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <div className="flex gap-2 mb-6">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <p className="text-[#8a8a8a] text-sm mb-1">
                <span className="text-[#00e676]">const</span>{' '}
                <span className="text-[#f0ede6]">fahim</span>{' '}
                <span className="text-[#8a8a8a]">= {'{'}</span>
              </p>
              <p className="text-[#8a8a8a] text-sm ml-4 mb-1">
                <span className="text-[#f0ede6]">role</span>:{' '}
                <span className="text-[#00e676]">&apos;Designer + Developer&apos;</span>,
              </p>
              <p className="text-[#8a8a8a] text-sm ml-4 mb-1">
                <span className="text-[#f0ede6]">based</span>:{' '}
                <span className="text-[#00e676]">&apos;Dhaka, Bangladesh&apos;</span>,
              </p>
              <p className="text-[#8a8a8a] text-sm ml-4 mb-1">
                <span className="text-[#f0ede6]">stack</span>: [
                <span className="text-[#00e676]">
                  &apos;Next.js&apos;, &apos;Figma&apos;, &apos;Supabase&apos;
                </span>],
              </p>
              <p className="text-[#8a8a8a] text-sm ml-4 mb-1">
                <span className="text-[#f0ede6]">available</span>:{' '}
                <span className="text-[#00e676]">true</span>,
              </p>
              <p className="text-[#8a8a8a] text-sm ml-4 mb-1">
                <span className="text-[#f0ede6]">obsessions</span>: [
                <span className="text-[#00e676]">
                  &apos;craft&apos;, &apos;clarity&apos;, &apos;coffee&apos;
                </span>],
              </p>
              <p className="text-[#8a8a8a] text-sm">{'}'}</p>
            </div>
          </div>
        </section>

        {/* ── RECENT BLOG TEASER ── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-12">
            <h2
              className="text-4xl font-bold text-[#f0ede6]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Writing
            </h2>
            <Link
              href="/blog"
              className="text-[#8a8a8a] text-sm hover:text-[#00e676] transition-colors"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              All posts →
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="border border-[#1f1f1f] rounded-xl p-16 text-center">
              <p
                className="text-[#8a8a8a] text-sm"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Writing about design, process & building on the web — coming soon.
              </p>
              <Link
                href="/blog"
                className="inline-block mt-4 text-[#00e676] text-sm hover:underline"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Visit the blog →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1f1f1f]">
              {recentPosts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-[#0a0a0a] p-8 flex flex-col justify-between group hover:bg-[#0f0f0f] transition-colors duration-300 min-h-[260px]"
                >
                  <div>
                    {post.tags?.length > 0 && (
                      <span
                        className="text-[#00e676] text-xs tracking-[0.15em] uppercase mb-4 block"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {post.tags[0]}
                      </span>
                    )}
                    <h3
                      className="text-lg font-semibold text-[#f0ede6] mb-3 leading-snug group-hover:text-[#00e676] transition-colors duration-300"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p
                        className="text-[#8a8a8a] text-sm leading-relaxed line-clamp-3"
                        style={{ fontFamily: "'Onest', sans-serif" }}
                      >
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#1f1f1f]">
                    <span
                      className="text-[#2a2a2a] text-xs"
                      style={{ fontFamily: "'Onest', sans-serif" }}
                    >
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span
                      className="text-[#2a2a2a] text-xs"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {post.reading_time} min
                    </span>
                  </div>
                </Link>
              ))}
              {/* Fill remaining slots to keep grid full when < 3 posts */}
              {recentPosts.length < 3 && Array.from({ length: 3 - recentPosts.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-[#0a0a0a] p-8 min-h-[260px] flex items-center justify-center"
                >
                  <span
                    className="text-[#1f1f1f] text-xs tracking-widest uppercase"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    more coming
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── CTA ── */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="border border-[#1f1f1f] rounded-2xl p-12 md:p-20 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center bottom, rgba(0,230,118,0.07) 0%, transparent 70%)',
              }}
            />
            <p
              className="text-[#00e676] text-xs tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Open to projects
            </p>
            <h2
              className="text-4xl md:text-6xl font-bold text-[#f0ede6] mb-6 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Have something in mind?
            </h2>
            <p
              className="text-[#8a8a8a] text-lg max-w-md mx-auto mb-10"
              style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
            >
              I take on selective projects where design and development genuinely matter.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00e676] text-black font-semibold rounded-full
                         hover:bg-[#00b85a] transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Start a conversation
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
