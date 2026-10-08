

export const revalidate = 60

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import { getAllProjects } from '@/lib/db/queries'
import BlurWords from '@/components/BlurWords'
import TechMarquee from '@/components/TechMarquee'
import type { CSSProperties } from 'react'

export const metadata = {
  title: 'Projects',
  description: 'All projects by Mahtamun Hoque Fahim — web apps, tools, platforms, and more.',
  alternates: {
    canonical: 'https://mahtamunhoquefahim.vercel.app/projects',
  },
}

export default async function ProjectsPage() {
  const allProjects = await getAllProjects()

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
        <section className="max-w-6xl mx-auto px-6 py-24 pt-32">
          <div className="mb-16">
            <BlurWords as="h1" text="All Projects" mode="load" className="text-5xl md:text-7xl font-bold text-[#F3F6F4] mb-6" style={{ fontFamily: 'var(--font-clash)' }} />
            <p
              className="blur-load text-[#8A938E] text-lg max-w-2xl"
              style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300, '--reveal-delay': '220ms' } as CSSProperties}
            >
              A collection of everything I've shipped — from web apps and tools to learning platforms and browser extensions. Each project represents something I wanted to build and share with the world.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-[#1F2421]">
            <div>
              <p
                className="text-3xl md:text-4xl font-bold text-[#F3F6F4]"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                {allProjects.length}
              </p>
              <p
                className="text-[#8A938E] text-sm mt-2"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Projects
              </p>
            </div>
            <div>
              <p
                className="text-3xl md:text-4xl font-bold text-[#F3F6F4]"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                {allProjects.filter(p => p.liveUrl).length}
              </p>
              <p
                className="text-[#8A938E] text-sm mt-2"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Live
              </p>
            </div>
            <div>
              <p
                className="text-3xl md:text-4xl font-bold text-[#F3F6F4]"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                {new Set(allProjects.flatMap(p => p.tags)).size}
              </p>
              <p
                className="text-[#8A938E] text-sm mt-2"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Technologies
              </p>
            </div>
            <div>
              <p
                className="text-3xl md:text-4xl font-bold text-[#F3F6F4]"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                {new Set(allProjects.map(p => p.type)).size}
              </p>
              <p
                className="text-[#8A938E] text-sm mt-2"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Types
              </p>
            </div>
          </div>

          {/* Technologies ticker, directly under the numbers. Most used first. */}
          <TechMarquee
            items={technologies}
            className="blur-load border-b border-[#1F2421] py-4"
          />
        </section>

        {/* ── ALL PROJECTS GRID ── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1F2421]">
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
