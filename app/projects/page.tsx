

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
              className="text-5xl md:text-7xl font-bold text-[#f0ede6] mb-6"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              All Projects
            </h1>
            <p
              className="text-[#8a8a8a] text-lg max-w-2xl"
              style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
            >
              A collection of everything I've shipped — from web apps and tools to learning platforms and browser extensions. Each project represents something I wanted to build and share with the world.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-[#1f1f1f]">
            <div>
              <p
                className="text-3xl md:text-4xl font-bold text-[#f0ede6]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {allProjects.length}
              </p>
              <p
                className="text-[#8a8a8a] text-sm mt-2"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Projects
              </p>
            </div>
            <div>
              <p
                className="text-3xl md:text-4xl font-bold text-[#f0ede6]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {allProjects.filter(p => p.liveUrl).length}
              </p>
              <p
                className="text-[#8a8a8a] text-sm mt-2"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Live
              </p>
            </div>
            <div>
              <p
                className="text-3xl md:text-4xl font-bold text-[#f0ede6]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {new Set(allProjects.flatMap(p => p.tags)).size}
              </p>
              <p
                className="text-[#8a8a8a] text-sm mt-2"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Technologies
              </p>
            </div>
            <div>
              <p
                className="text-3xl md:text-4xl font-bold text-[#f0ede6]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {new Set(allProjects.map(p => p.type)).size}
              </p>
              <p
                className="text-[#8a8a8a] text-sm mt-2"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Types
              </p>
            </div>
          </div>
        </section>

        {/* ── ALL PROJECTS GRID ── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1f1f1f]">
            {allProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>

        {/* ── PROJECT TYPES BREAKDOWN ── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2
            className="text-4xl font-bold text-[#f0ede6] mb-12"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            By Type
          </h2>

          {/* Group projects by type */}
          {Array.from(new Set(allProjects.map(p => p.type))).map((type) => {
            const projectsByType = allProjects.filter(p => p.type === type)
            return (
              <div key={type} className="mb-20">
                <h3
                  className="text-2xl font-semibold text-[#f0ede6] mb-6"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {type}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1f1f1f]">
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
            className="text-4xl font-bold text-[#f0ede6] mb-8"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Technologies
          </h2>
          <p
            className="text-[#8a8a8a] text-lg mb-12"
            style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
          >
            I specialize in modern full-stack development. Here are the tech stacks powering these projects.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from(new Set(allProjects.flatMap(p => p.tags)))
              .sort()
              .map((tag) => (
                <div
                  key={tag}
                  className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg p-4 hover:border-[#00e676] transition-colors"
                >
                  <p
                    className="text-[#f0ede6] font-medium"
                    style={{ fontFamily: "'Onest', sans-serif" }}
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
