

export const revalidate = 60

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getBlogPosts, type BlogPost } from '@/lib/db/queries'
import ProjectCard from '@/components/ProjectCard'
import { getFeaturedProjects, getSkills } from '@/lib/db/queries'

const skills = [
  'Figma', 'Adobe Suite', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS',
  'Neon', 'PostgreSQL', 'Node.js', 'Brand Identity', 'Motion Design', 'Framer',
]

const ticker = [...skills, ...skills]

export default async function HomePage() {
  const [allPosts, featuredProjects, skills] = await Promise.all([
    getBlogPosts({ publishedOnly: true, limit: 3 }),
    getFeaturedProjects(),
    getSkills(),
  ])

  const recentPosts = allPosts as Pick<BlogPost, 'id' | 'title' | 'slug' | 'excerpt' | 'tags' | 'readingTime' | 'createdAt'>[]
  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col justify-end pb-20 px-6 pt-32 relative overflow-hidden">


          <div className="max-w-6xl mx-auto w-full">
            
            {/* Main heading */}
            <h1
              className="text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight mb-8"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              <span className="block text-[#F3F6F4]">Safety</span>
              <span className="block text-[#F3F6F4]">Security</span>
              <span className="block text-[#3DF49A]">Integrity</span>
            </h1>

            {/* Sub */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12">
              <div className="max-w-md">
                <p
                  className="text-[#8A938E] text-lg leading-relaxed"
                  style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
                >
                  I&apos;m{' '}
                  <span className="text-[#F3F6F4] font-medium">Mahtamun Hoque Fahim</span>
                  {' '} - an Aspiring AI Engineer. I build better and secure web architecture.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto text-center px-7 py-3 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-full
                             hover:bg-[#5BFBA8] transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  Let&apos;s talk
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto text-center px-7 py-3 border border-[#1F2421] text-[#F3F6F4] text-sm rounded-full
                             hover:border-[#8A938E] transition-all duration-200"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  About me
                </Link>
              </div>
            </div>

            {/* Horizontal rule with stat */}
            <div className="mt-16 pt-8 border-t border-[#1F2421] flex flex-wrap gap-12">
              {[
                { num: '9+', label: 'Years of designing' },
                { num: '2+', label: 'Years of building' },
                { num: '1+', label: 'Years of Securing' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="text-3xl font-bold text-[#F3F6F4]"
                    style={{ fontFamily: 'var(--font-clash)' }}
                  >
                    {stat.num}
                  </p>
                  <p
                    className="text-[#8A938E] text-sm mt-1"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TICKER ── */}
        <div className="overflow-hidden border-y border-[#1F2421] py-4 bg-[#090A09]">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {ticker.map((skill, i) => (
              <span
                key={i}
                className="text-sm tracking-widest uppercase shrink-0"
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  color: i % 3 === 0 ? '#3DF49A' : '#8A938E',
                }}
              >
                {skill}
                <span className="ml-12 text-[#1F2421]">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── I like building ── */}
        <section className="max-w-6xl mx-auto px-6 py-28">
          <div className="flex flex-col md:flex-row gap-6 md:items-end mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold text-[#F3F6F4]"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
             I like building.
            </h2>
          </div>

          {/* Compact icon-card grid: 1 column on phones, up to 3 across on
              desktop, wrapping to more rows as more skills are added. Each
              card's icon slot is a shade lighter than the page (#141712 vs
              #070807) on purpose, so an uploaded transparent PNG still
              reads as a tile instead of floating on nothing. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((s, i) => (
              <div
                key={s.id}
                className="rounded-2xl border border-[#1F2421] p-8 group hover:border-[#3A3F3C] transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[#141712] flex items-center justify-center overflow-hidden mb-6 shrink-0">
                  {s.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.imageUrl} alt="" className="w-full h-full object-contain p-2.5" />
                  ) : (
                    <span
                      className="text-[#2B302D] text-xl font-bold group-hover:text-[#3DF49A]/40 transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-clash)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <h3
                  className="text-xl font-semibold text-[#F3F6F4] mb-3"
                  style={{ fontFamily: 'var(--font-clash)' }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[#8A938E] text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-[#3A3F3C] text-sm" style={{ fontFamily: 'var(--font-jakarta)' }}>
                Nothing here yet.
              </p>
            )}
          </div>
        </section>

        {/* ── PERSONALITY SECTION ── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#F3F6F4] mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
               Design can't be seperated from engineering.
              </h2>
              <p
                className="text-[#8A938E] text-base leading-relaxed mb-6"
                style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
              >
                Most designers hand off to developers. Most developers complain about the Security.
                I do it all, Cause I don't rest till I build the best.
              </p>
              <p
                className="text-[#8A938E] text-base leading-relaxed mb-10"
                style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
              >
                I am obsessively curious the space between pixels. I write code the way
                I design — with intention.I love what I do, and coffee? More.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#3DF49A] text-sm group"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Full story
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Code aesthetic block */}
            <div
              className="bg-[#0F0F0F] border border-[#1F2421] rounded-xl p-8"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              <div className="flex gap-2 mb-6">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <p className="text-[#8A938E] text-sm mb-1">
                <span className="text-[#3DF49A]">const</span>{' '}
                <span className="text-[#F3F6F4]">mahtamun</span>{' '}
                <span className="text-[#8A938E]">= {'{'}</span>
              </p>
              <p className="text-[#8A938E] text-sm ml-4 mb-1">
                <span className="text-[#F3F6F4]">role</span>:{' '}
                <span className="text-[#3DF49A]">&apos;Polymath;</span>,
              </p>
              
              <p className="text-[#8A938E] text-sm ml-4 mb-1">
                <span className="text-[#F3F6F4]">Description</span>: [
                <span className="text-[#3DF49A]">
                  &apos;Design&apos;, &apos;Develope&apos;, &apos;Secure&apos;
                </span>],
              </p>
              
              <p className="text-[#8A938E] text-sm ml-4 mb-1">
                <span className="text-[#F3F6F4]">stack</span>: [
                <span className="text-[#3DF49A]">
                  &apos;Next.js&apos;, &apos;Figma&apos;, &apos;Postgress&apos;
                </span>],
              </p>
              <p className="text-[#8A938E] text-sm ml-4 mb-1">
                <span className="text-[#F3F6F4]">Availability</span>: [
                <span className="text-[#3DF49A]">
                  &apos;Remote&apos;, &apos;Hybrid&apos;, &apos;Onsite&apos;
                </span>],
              </p>
              <p className="text-[#8A938E] text-sm ml-4 mb-1">
                <span className="text-[#F3F6F4]">obsessions</span>: [
                <span className="text-[#3DF49A]">
                  &apos;Sky&apos;, &apos;Grass&apos;, &apos;coffee&apos;
                </span>],
              </p>
              <p className="text-[#8A938E] text-sm">{'}'}</p>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p
                className="text-gray text-xs tracking-[0.2em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
Things I like and.. 
              </p>
              <h2
                className="text-4xl font-bold text-[#F3F6F4]"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                Things I've built.
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-[#8A938E] text-sm hover:text-[#3DF49A] transition-colors hidden md:block"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1F2421]">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>

        {/* ── RECENT BLOG TEASER ── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-12">
            <h2
              className="text-4xl font-bold text-[#F3F6F4]"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              Things I write..
            </h2>
            <Link
              href="/blog"
              className="text-[#8A938E] text-sm hover:text-[#3DF49A] transition-colors"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              All posts →
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="border border-[#1F2421] rounded-xl p-16 text-center">
              <p
                className="text-[#8A938E] text-sm"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Writing about design, engineering & security on the web - start reading.
              </p>
              <Link
                href="/blog"
                className="inline-block mt-4 text-[#3DF49A] text-sm hover:underline"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Visit the blog →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1F2421]">
              {recentPosts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-[#070807] p-8 flex flex-col justify-between group hover:bg-[#0F0F0F] transition-colors duration-300 min-h-[260px]"
                >
                  <div>
                    {post.tags?.length > 0 && (
                      <span
                        className="text-[#3DF49A] text-xs tracking-[0.15em] uppercase mb-4 block"
                        style={{ fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {post.tags[0]}
                      </span>
                    )}
                    <h3
                      className="text-lg font-semibold text-[#F3F6F4] mb-3 leading-snug group-hover:text-[#3DF49A] transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-clash)' }}
                    >
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p
                        className="text-[#8A938E] text-sm leading-relaxed line-clamp-3"
                        style={{ fontFamily: 'var(--font-jakarta)' }}
                      >
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#1F2421]">
                    <span
                      className="text-[#2B302D] text-xs"
                      style={{ fontFamily: 'var(--font-jakarta)' }}
                    >
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span
                      className="text-[#2B302D] text-xs"
                      style={{ fontFamily: 'var(--font-jetbrains)' }}
                    >
                      {post.readingTime} min
                    </span>
                  </div>
                </Link>
              ))}
              {/* Fill remaining slots to keep grid full when < 3 posts */}
              {recentPosts.length < 3 && Array.from({ length: 3 - recentPosts.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-[#070807] p-8 min-h-[260px] flex items-center justify-center"
                >
                  <span
                    className="text-[#1F2421] text-xs tracking-widest uppercase"
                    style={{ fontFamily: 'var(--font-jetbrains)' }}
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
          <div className="border border-[#1F2421] rounded-2xl p-12 md:p-20 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center bottom, rgba(61,244,154,0.07) 0%, transparent 70%)',
              }}
            />
            <h2
              className="text-4xl md:text-6xl font-bold text-[#F3F6F4] mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              Reach Out!
            </h2>
            <p
              className="text-[#8A938E] text-lg max-w-auto mx-auto mb-10"
              style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
            >
              Building user-centrice softwares or SaaS applications are not that tough, neither easier to ship in the epicenter of AI era.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 whitespace-nowrap px-6 min-[380px]:px-8 py-4 bg-[#3DF49A] text-[#06160E] font-semibold rounded-full
                         hover:bg-[#5BFBA8] transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              {/* One line always: full label from 380px up, shorter label below it */}
              <span className="min-[380px]:hidden">Start conversation</span>
              <span className="hidden min-[380px]:inline">Start a conversation</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
