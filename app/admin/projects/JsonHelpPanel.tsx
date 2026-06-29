'use client'

import { useState } from 'react'

const EXAMPLE_JSON = `{
  "projects": [
    {
      "name": "Neura",
      "type": "Tool",
      "tags": ["HTML", "Canvas API"],
      "tagline": "An infinite canvas for thinking out loud.",
      "description": "Whiteboard with a hand-drawn aesthetic. Multiplayer, AI sketch-to-diagram, EEE/BEE circuit library. Pure HTML + Canvas API.",
      "liveUrl": "https://neura-ashy.vercel.app",
      "repoUrl": "https://github.com/mahtamun-hoque-fahim/neura",
      "statusBadges": ["live"],
      "collaborators": [
        { "name": "Tanvir Hossain", "url": "https://github.com/Tanvir83775757676" },
        "CoxMC"
      ]
    }
  ]
}`

export default function JsonHelpPanel() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EXAMPLE_JSON)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard may be blocked — fail quietly */
    }
  }

  return (
    <div className="mb-8 bg-[#0F0F0F] border border-[#1F2421] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#0F0F0F] transition-colors"
        style={{ fontFamily: 'var(--font-jakarta)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] uppercase tracking-widest text-[#3DF49A] px-2 py-0.5 bg-[#3DF49A]/10 rounded border border-[#3DF49A]/30"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            JSON
          </span>
          <span className="text-[#F3F6F4] text-sm font-medium">
            Bulk import — schema reference
          </span>
        </div>
        <span className="text-[#8A938E] text-xs">{open ? '− Hide' : '+ Show'}</span>
      </button>

      {open && (
        <div className="px-5 py-5 border-t border-[#1F2421] space-y-5">
          <div>
            <p
              className="text-[#8A938E] text-sm leading-relaxed mb-3"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Click <span className="text-[#3DF49A]">+ New project → Paste JSON</span>. Accepts a
              single object, an array, or <code className="text-[#3DF49A] text-xs">{'{ "projects": [...] }'}</code>.
              Existing projects are matched by <code className="text-[#3DF49A] text-xs">name</code> and updated;
              new ones are created.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p
                className="text-[10px] uppercase tracking-widest text-[#8A938E] mb-2"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                Required
              </p>
              <ul className="space-y-1.5 text-xs text-[#8A938E]" style={{ fontFamily: 'var(--font-jakarta)' }}>
                <li>
                  <code className="text-[#F3F6F4]">name</code> — unique, also the upsert key
                </li>
                <li>
                  <code className="text-[#F3F6F4]">tagline</code> — one-liner for cards
                </li>
                <li>
                  <code className="text-[#F3F6F4]">description</code> — 2–4 sentences
                </li>
                <li>
                  <code className="text-[#F3F6F4]">repoUrl</code> — full https URL
                </li>
              </ul>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-widest text-[#8A938E] mb-2"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                Optional
              </p>
              <ul className="space-y-1.5 text-xs text-[#8A938E]" style={{ fontFamily: 'var(--font-jakarta)' }}>
                <li>
                  <code className="text-[#F3F6F4]">type</code> — default "Web"
                </li>
                <li>
                  <code className="text-[#F3F6F4]">tags</code> — array or comma string
                </li>
                <li>
                  <code className="text-[#F3F6F4]">liveUrl</code> — string or null
                </li>
                <li>
                  <code className="text-[#F3F6F4]">statusBadges</code> — subset of{' '}
                  <code className="text-[#3DF49A]">["live","beta","deprecated","funding"]</code>
                </li>
                <li>
                  <code className="text-[#F3F6F4]">collaborators</code> — strings or{' '}
                  <code className="text-[#3DF49A]">{'{name, url}'}</code> objects
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[10px] uppercase tracking-widest text-[#8A938E]"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                Example
              </p>
              <button
                onClick={handleCopy}
                className="text-[10px] uppercase tracking-widest px-2 py-1 bg-[#1F2421] text-[#8A938E] hover:text-[#3DF49A] hover:bg-[#3DF49A]/10 rounded transition-colors"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                {copied ? '✓ copied' : 'Copy'}
              </button>
            </div>
            <pre
              className="text-[11px] bg-[#070807] border border-[#1F2421] rounded-lg p-3 overflow-x-auto text-[#8A938E] leading-relaxed"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              {EXAMPLE_JSON}
            </pre>
          </div>

          <p
            className="text-[10px] text-[#5C615E]"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Full spec: <code className="text-[#8A938E]">docs/PROJECT_JSON_SCHEMA.md</code> in the repo.
          </p>
        </div>
      )}
    </div>
  )
}
