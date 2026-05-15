export type Project = {
  name: string
  tagline: string
  desc: string
  tags: string[]
  type: string
  live: string | null
  repo: string
}

export const allProjects: Project[] = [
  {
    name: 'Bindu',
    tagline: 'Anonymous messaging platform.',
    desc: 'Share a link, receive messages from anyone. No account needed to send. Real-time WebSocket updates, anonymous/named voting, rate limiting via Upstash Redis, and optional email notifications via Resend.',
    tags: ['Next.js 16', 'NextAuth v5', 'Neon', 'Drizzle', 'Redis'],
    type: 'Web App',
    live: 'https://bindu.pages.dev',
    repo: 'https://github.com/mahtamun-hoque-fahim/bindu',
  },
  {
    name: 'Fontina',
    tagline: 'Font converter. Drop, convert, use.',
    desc: 'Drop any font file → get web-ready WOFF2 instantly. Server-side conversion using fonttools (Python), beautiful drag-drop UI, batch conversion support, and instant download.',
    tags: ['Next.js 16', 'Tailwind CSS', 'Python', 'fonttools'],
    type: 'Web Tool',
    live: 'https://fontina-convert.vercel.app',
    repo: 'https://github.com/mahtamun-hoque-fahim/fontina',
  },
  {
    name: 'LearnDE',
    tagline: 'Interactive Differential Equations learning.',
    desc: 'Platform for university CSE students to learn differential equations interactively. Student dashboards, staff grading tools, admin controls, email notifications, and rich math rendering.',
    tags: ['Next.js 16', 'Better Auth', 'Neon', 'Drizzle', 'Resend'],
    type: 'Learning Platform',
    live: 'https://learn-differential-equation.vercel.app',
    repo: 'https://github.com/mahtamun-hoque-fahim/learnDE',
  },
  {
    name: 'Formify',
    tagline: 'Build forms without code.',
    desc: 'Drag-and-drop form builder with zero coding. Real-time previews, conditional logic, integrations, and form analytics. Share forms via unique links.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    type: 'Web App',
    live: 'https://oneformify.vercel.app',
    repo: 'https://github.com/mahtamun-hoque-fahim/formify',
  },
  {
    name: 'Notably',
    tagline: 'Notes app with version history.',
    desc: 'Git Quest XP – collaborative note-taking with version control. Track changes, restore previous versions, collaborate in real-time.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    type: 'Productivity App',
    live: null,
    repo: 'https://github.com/mahtamun-hoque-fahim/notably',
  },
  {
    name: 'Memoriza',
    tagline: 'Spaced repetition. Memory mastery.',
    desc: 'Flashcard app powered by spaced repetition algorithm. Create decks, track progress, and master anything through scientifically-proven learning methods.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    type: 'Learning App',
    live: 'https://memorizaa.vercel.app',
    repo: 'https://github.com/mahtamun-hoque-fahim/memoriza',
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
    name: 'Raisy',
    tagline: 'Raise your hand.',
    desc: 'Real-time polls with zero sign-up. Share a link, watch votes roll in live via WebSocket. Supports anonymous/named voting, deadlines, drag-reorder, CSV/JSON export, and QR code sharing.',
    tags: ['Next.js 14', 'Ably', 'Neon', 'Drizzle'],
    type: 'Web App',
    live: 'https://raisy-polling.vercel.app',
    repo: 'https://github.com/mahtamun-hoque-fahim/Raisy',
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

// Featured projects shown on homepage
export const featuredProjects = [
  allProjects.find(p => p.name === 'Bindu')!,
  allProjects.find(p => p.name === 'Fontina')!,
  allProjects.find(p => p.name === 'Sentri')!,
  allProjects.find(p => p.name === 'Neura')!,
]
