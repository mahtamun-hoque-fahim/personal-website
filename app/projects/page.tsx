

export const revalidate = 60

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import { getAllProjects, getCachedSiteSettings } from '@/lib/db/queries'
import BlurWords from '@/components/BlurWords'
import MarqueeStrip from '@/components/MarqueeStrip'
import type { CSSProperties } from 'react'

export const metadata = {
  title: 'Projects',
  description: 'All projects by Mahtamun Hoque Fahim — web apps, tools, platforms, and more.',
  alternates: {
    canonical: 'https://mahtamunhoquefahim.vercel.app/projects',
  },
}

export default async function ProjectsPage() {
  const [allProjects, siteSettings] = await Promise.all([getAllProjects(), getCachedSiteSettings()])

  // Unique tags, most used first (ties alphabetical), for the hero ticker.
  const tagCounts = new Map<string, number>()
  for (const tag of allProjects.flatMap((p) => p.tags ?? [])) {
    tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
  }
  const technologies = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)

  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO ── */}
        <section className="max-w-6xl mx-auto px-6 pt-32 pb-16">
          <div>
            <BlurWords as="h1" text="All Projects" mode="load" className="text-5xl md:text-7xl font-bold text-[#F3F6F4] mb-6" style={{ fontFamily: 'var(--font-clash)' }} />
            <p
              className="blur-load text-[#8A938E] text-lg max-w-2xl"
              style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300, '--reveal-delay': '220ms' } as CSSProperties}
            >
              A collection of everything I've shipped — from web apps and tools to learning platforms and browser extensions. Each project represents something I wanted to build and share with the world.
            </p>
          </div>
        </section>

        {/* Technologies ticker: same strip, same speed as the homepage. Most used first. */}
        <MarqueeStrip items={technologies} speed={siteSettings.marqueeSpeed} />

        {/* ── ALL PROJECTS GRID ── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#333333]">
            {allProjects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
