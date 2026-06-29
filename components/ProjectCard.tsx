'use client'

import { useState } from 'react'
import type { Project } from '@/lib/db/queries'

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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative bg-[#0F0F0F] border border-[#1F2421] rounded-2xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#3DF49A] to-transparent" />

        <p
          className="text-[#3DF49A] text-xs tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Heads up
        </p>

        <h3
          className="text-xl font-bold text-[#F3F6F4] mb-3"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          {projectName} is in beta
        </h3>

        <p
          className="text-[#8A938E] text-sm leading-relaxed mb-8"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          This project is still in beta and might be unstable — things could break or behave unexpectedly. Still want to visit?
        </p>

        <div className="flex gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 text-center px-5 py-2.5 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-full hover:bg-[#5BFBA8] transition-all duration-200"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Yeah, let&apos;s go →
          </a>
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 border border-[#1F2421] text-[#8A938E] text-sm rounded-full hover:border-[#8A938E] hover:text-[#F3F6F4] transition-all duration-200"
            style={{ fontFamily: 'var(--font-jakarta)' }}
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
      <div className="bg-[#070807] p-8 group hover:bg-[#0F0F0F] transition-colors duration-300 flex flex-col justify-between min-h-[280px]">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span
                className="text-[#2B302D] text-xs tracking-[0.15em] uppercase block mb-1 group-hover:text-[#3DF49A] transition-colors duration-300"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                {project.type}
              </span>
              <h3
                className="text-2xl font-bold text-[#F3F6F4]"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                {project.name}
              </h3>
              {project.statusBadges && project.statusBadges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.statusBadges.map((b) => (
                    <span
                      key={b}
                      className={`text-[10px] px-2 py-0.5 border rounded-full uppercase tracking-wider font-medium ${cardBadgeCls(
                        b,
                      )}`}
                      style={{ fontFamily: 'var(--font-jetbrains)' }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p
            className="text-[#3DF49A] text-sm mb-3 italic"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            {project.tagline}
          </p>
          <p
            className="text-[#8A938E] text-sm leading-relaxed"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            {project.description}
          </p>
          {project.collaborators && project.collaborators.length > 0 && (
            <p
              className="text-[#5C615E] text-xs mt-3"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              with{' '}
              {project.collaborators.map((c, i) => (
                <span key={`${c.name}-${i}`}>
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8A938E] hover:text-[#3DF49A] underline-offset-2 hover:underline transition-colors"
                    >
                      {c.name}
                    </a>
                  ) : (
                    <span className="text-[#8A938E]">{c.name}</span>
                  )}
                  {i < (project.collaborators?.length ?? 0) - 1 && ', '}
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-[#1F2421]">
          <div className="flex flex-wrap gap-2 mb-4">
            {(project.tags || []).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 border border-[#1F2421] text-[#8A938E] rounded"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            {project.liveUrl && (
              (project.statusBadges ?? []).includes('beta') ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="text-[#3DF49A] text-sm hover:underline cursor-pointer"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  Live ↗
                </button>
              ) : (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3DF49A] text-sm hover:underline"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  Live ↗
                </a>
              )
            )}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8A938E] text-sm hover:text-[#F3F6F4] transition-colors"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              GitHub →
            </a>
          </div>
        </div>
      </div>

      {showModal && project.liveUrl && (project.statusBadges ?? []).includes('beta') && (
        <BetaModal
          projectName={project.name}
          url={project.liveUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

function cardBadgeCls(badge: string): string {
  switch (badge) {
    case 'live':
      return 'bg-[#3DF49A]/15 border-[#3DF49A]/40 text-[#3DF49A]'
    case 'beta':
      return 'bg-blue-500/15 border-blue-500/40 text-blue-400'
    case 'deprecated':
      return 'bg-[#1F2421] border-[#2B302D] text-[#8A938E]'
    case 'funding':
      return 'bg-amber-500/15 border-amber-500/40 text-amber-400'
    default:
      return 'bg-[#1F2421] border-[#2B302D] text-[#8A938E]'
  }
}
