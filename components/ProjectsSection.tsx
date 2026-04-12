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

  const handleLiveClick = (url: string, name: string) => {
    setPopup({ url, name })
  }

  const handleConfirm = () => {
    if (popup) window.open(popup.url, '_blank', 'noopener,noreferrer')
    setPopup(null)
  }

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p
              className="text-[#00e676] text-xs tracking-[0.2em] uppercase mb-3