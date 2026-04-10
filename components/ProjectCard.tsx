'use client'

import { useState } from 'react'

type Project = {
  name: string
  tagline: string
  desc: string
  tags: string[]
  type: string
  live: string | null
  repo: string
}

function BetaModal({
  projectName,
  url,
  onClose,
}: {
  projectName: string
  url: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#00e676] to-transparent" />

        <p
          className="text-[#00e676] text-xs tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Heads up
        </p>

        <h3
          className="text-xl font-bold text-[#f0ede6] mb-3"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {projectName} is in beta
        </h3>

        <p
          className="text-[#8a8a8a] text-sm leading-relaxed mb-8"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          This project is still in beta and might be unstable — things could break or behave unexpectedly. Still want to visit?
        </p>

        <div className="flex gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 text-center px-5 py-2.5 bg-[#00e676] text-black text-sm font-semibold rounded-full
                       hover:bg-[#00b85a] transition-all duration-200"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Yeah, let's go →
          </a>
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 border border-[#1f1f1f] text-[#8a8a8a] text-sm rounded-full
                       hover:border-[#8a8a8a] hover:text-[#f0ede6] transition-all duration-200"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProjectCard({ project }: { project: Project }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="bg-[#0a0a0a] p-8 group hover:bg-[#0f0f0f] transition-colors duration-300 flex flex-col justify-between min-h-[280px]">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className="text-[#2a2a2a] text-xs tracking-[0.15em] uppercase block mb-1 group-hover:text-[#00e676] transition-colors duration-300"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {project.type}
              </span>
              <h3
                className="text-2xl font-bold text-[#f0ede6]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          <p
            className="text-[#00e676] text-sm mb-3 italic"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            {project.tagline}
          </p>
          <p
            className="text-[#8a8a8a] text-sm leading-relaxed"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            {project.desc}
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-[#1f1f1f]">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 border border-[#1f1f1f] text-[#8a8a8a] rounded"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            {project.live && (
              <button
                onClick={() => setShowModal(true)}
                className="text-[#00e676] text-sm hover:underline cursor-pointer"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Live ↗
              </button>
            )}
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8a8a8a] text-sm hover:text-[#f0ede6] transition-colors"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              GitHub →
            </a>
          </div>
        </div>
      </div>

      {showModal && project.live && (
        <BetaModal
          projectName={project.name}
          url={project.live}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
