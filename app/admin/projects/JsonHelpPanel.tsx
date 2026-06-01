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
    <div className="mb-8 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#141414] transition-colors"
        style={{ fontFamily: "'Onest', sans-serif" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] uppercase tracking-widest text-[#00e676] px-2 py-0.5 bg-[#00e676]/10 rounded border border-[#00e676]/30"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            JSON
          </span>
          <span className="text-[#f0ede6] text-sm font-medium">
            Bulk import — schema reference
          </span>
        </div>
        <span className="text-[#8a8a8a] text-xs">{open ? '− Hide' : '+ Show'}</span>
      </button>

      {open && (
        <div className="px-5 py-5 border-t border-[#1f1f1f] space-y-5">
          <div>
            <p
              className="text-[#8a8a8a] text-sm leading-relaxed mb-3"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Click <span className="text-[#00e676]">+ New project → Paste JSON</span>. Accepts a
              single object, an array, or <code className="text-[#00e676] text-xs">{'{ "projects": [...] }'}</code>.
              Existing projects are matched by <code className="text-[#00e676] text-xs">name</code> and updated;
              new ones are created.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p
                className="text-[10px] uppercase tracking-widest text-[#8a8a8a] mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Required
              </p>
              <ul className="space-y-1.5 text-xs text-[#8a8a8a]" style={{ fontFamily: "'Onest', sans-serif" }}>
                <li>
                  <code className="text-[#f0ede6]">name</code> — unique, also the upsert key
                </li>
                <li>
                  <code className="text-[#f0ede6]">tagline</code> — one-liner for cards
                </li>
                <li>
                  <code className="text-[#f0ede6]">description</code> — 2–4 sentences
                </li>
                <li>
                  <code className="text-[#f0ede6]">repoUrl</code> — full https URL
                </li>
              </ul>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-widest text-[#8a8a8a] mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Optional
              </p>
              <ul className="space-y-1.5 text-xs text-[#8a8a8a]" style={{ fontFamily: "'Onest', sans-serif" }}>
                <li>
                  <code className="text-[#f0ede6]">type</code> — default "Web"
                </li>
                <li>
                  <code className="text-[#f0ede6]">tags</code> — array or comma string
                </li>
                <li>
                  <code className="text-[#f0ede6]">liveUrl</code> — string or null
                </li>
                <li>
                  <code className="text-[#f0ede6]">statusBadges</code> — subset of{' '}
                  <code className="text-[#00e676]">["live","beta","deprecated","funding"]</code>
                </li>
                <li>
                  <code className="text-[#f0ede6]">collaborators</code> — strings or{' '}
                  <code className="text-[#00e676]">{'{name, url}'}</code> objects
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[10px] uppercase tracking-widest text-[#8a8a8a]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Example
              </p>
              <button
                onClick={handleCopy}
                className="text-[10px] uppercase tracking-widest px-2 py-1 bg-[#1f1f1f] text-[#8a8a8a] hover:text-[#00e676] hover:bg-[#00e676]/10 rounded transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {copied ? '✓ copied' : 'Copy'}
              </button>
            </div>
            <pre
              className="text-[11px] bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3 overflow-x-auto text-[#8a8a8a] leading-relaxed"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {EXAMPLE_JSON}
            </pre>
          </div>

          <p
            className="text-[10px] text-[#5a5a5a]"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Full spec: <code className="text-[#8a8a8a]">docs/PROJECT_JSON_SCHEMA.md</code> in the repo.
          </p>
        </div>
      )}
    </div>
  )
}
