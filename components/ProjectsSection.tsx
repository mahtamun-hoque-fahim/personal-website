'use client'

import { useState } from 'react'

const projects = [
  {
    name: 'Raisy',
    tagline: 'Raise your hand.',
    desc: 'Real-time polls with zero sign-up. Share a link, watch votes roll in live via WebSocket. Supports anonymous/named voting, deadlines, drag-reorder, CSV/JSON export, and QR code sharing.',
    tags: ['Next.js 14', 'Ably', 'Neon', 'Drizzle'],
    type: 'Web App',
    live: 'https://raisy-polling.vercel.app',
    repo: 'https://github.com/mahtamun-hoque-fahim/Raisy',
  },
  {
    name: 'Sentri',
    tagline: 'Zero-knowledge password manager.',
    desc: 'AES-256-GCM encryption client-side only. Master Password + Secret Key two-factor key derivation with PBKDF2 (600k iterations). The server never sees your plaintext — not even me.',
    tags: ['Next.js 14', 'Clerk', 'Neon', 'Crypto'],
    type: 'Security App',
    live: 'https://sentri-here.vercel.app',
    repo: 'https://github.com/mahtamun-hoque-fahim/sentri',
  },
  {
    name: 'Neura',
    tagline: 'Minimal whiteboard. Zero dependencies.',
    desc: 'A beautiful drawing canvas in a single HTML file. Pen, highlighter, shapes, arrows, text, undo/redo, PNG export, touch support. No build step, no npm install.',
    tags: ['HTML', 'Canvas API', 'Zero deps'],
    type: 'Tool',
    live: 'https://neura-ashy.vercel.app',
    repo: 'https://github.com/mahtamun-hoque-fahim/neura',
  },
  {
    name: 'Claudia',
    tagline: 'Export Claude chats as beautiful PDFs.',
    desc: 'Chrome extension that exports Claude.ai conversations with dark/light themes, LaTeX via KaTeX, syntax highlighting via Prism.js, and selective message export.',
    tags: ['Chrome Extension', 'KaTeX', 'Prism.js'],
    type: 'Browser Extension',
    live: null,
    repo: 'https://github.com/mahtamun-hoque-fahim/claudia',
  },
]

export default function ProjectsSection() {
  const [popup, setPopup] = useState<{ url: string; name: string } | null>(null)

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p
            className="text-[#00e676] text-xs tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Selected work
          </p>
          <h2
            className="text-4xl font-bold text-[#f0ede6]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Projects
          </h2>
        </div>
        <a
          href="https://github.com/mahtamun-hoque-fahim"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#8a8a8a] text-sm hover:text-[#00e676] transition-colors hidden md:block"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          GitHub →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1f1f1f]">
        {projects.map((project) => (
          <div
            key={project.name}
            className="bg-[#0a0a0a] p-8 group hover:bg-[#0f0f0f] transition-colors duration-300 flex flex-col justify-between min-h-[280px]"
          >
            <div>
              <span
                className="text-[#2a2a2a] text-xs tracking-[0.15em] uppercase block mb-1 group-hover:text-[#00e676] transition-colors duration-300"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {project.type}
              </span>
              <h3
                className="text-2xl font-bold text-[#f0ede6] mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {project.name}
              </h3>
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
                    onClick={() => setPopup({ url: project.live!, name: project.name })}
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
        ))}
      </div>

      {popup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setPopup(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
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
              {popup.name} is in beta
            </h3>
            <p
              className="text-[#8a8a8a] text-sm leading-relaxed mb-8"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              This project is still in beta and might be unstable — things could break or behave unexpectedly. Still want to visit?
            </p>
            <div className="flex gap-3">
              <a
                href={popup.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setPopup(null)}
                className="flex-1 text-center px-5 py-2.5 bg-[#00e676] text-black text-sm font-semibold rounded-full hover:bg-[#00b85a] transition-all duration-200"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Yeah, let&apos;s go →
              </a>
              <button
                onClick={() => setPopup(null)}
                className="flex-1 px-5 py-2.5 border border-[#1f1f1f] text-[#8a8a8a] text-sm rounded-full hover:border-[#8a8a8a] hover:text-[#f0ede6] transition-all duration-200"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
