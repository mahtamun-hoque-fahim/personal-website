

export const revalidate = 60

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import { getAllProjects } from '@/lib/db/queries'

export const metadata = {
  title: 'Projects',
  description: 'All projects by Mahtamun Hoque Fahim — web apps, tools, platforms, and more.',
}

export default async function ProjectsPage() {
  const allProjects = await getAllProjects()
  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO ── */}
        <section className="max-w-6xl mx-auto px-6 py-24 pt-32">
          <div className="mb-16">
            <h1
              className="text-5xl md:text-7xl font-bold text-[#F3F6F4] mb-6"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              All Projects
            </h1>
            <p
              className="text-[#8A938E] text-lg max-w-2xl"
              style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
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
        </section>

        {/* ── ALL PROJECTS GRID ── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1F2421]">
            {allProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>

        {/* ── PROJECT TYPES BREAKDOWN ── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2
            className="text-4xl font-bold text-[#F3F6F4] mb-12"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            By Type
          </h2>

          {/* Group projects by type */}
          {Array.from(new Set(allProjects.map(p => p.type))).map((type) => {
            const projectsByType = allProjects.filter(p => p.type === type)
            return (
              <div key={type} className="mb-20">
                <h3
                  className="text-2xl font-semibold text-[#F3F6F4] mb-6"
                  style={{ fontFamily: 'var(--font-clash)' }}
                >
                  {type}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1F2421]">
                  {projectsByType.map((project) => (
                    <ProjectCard key={project.name} project={project} />
                  ))}
                </div>
              </div>
            )
          })}
        </section>

        {/* ── TECH STACK ── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2
            className="text-4xl font-bold text-[#F3F6F4] mb-8"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Technologies
          </h2>
          <p
            className="text-[#8A938E] text-lg mb-12"
            style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
          >
            I specialize in modern full-stack development. Here are the tech stacks powering these projects.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from(new Set(allProjects.flatMap(p => p.tags)))
              .sort()
              .map((tag) => (
                <div
                  key={tag}
                  className="bg-[#0F0F0F] border border-[#1F2421] rounded-lg p-4 hover:border-[#3DF49A] transition-colors"
                >
                  <p
                    className="text-[#F3F6F4] font-medium"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    {tag}
                  </p>
                </div>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
