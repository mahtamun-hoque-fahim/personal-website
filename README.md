# fahim. — Personal Website

Personal website of **Mahtamun Hoque Fahim** — Graphic Designer, Full-Stack Developer & UI/UX Designer from Bangladesh.

**Live (Vercel):** [mahtamunhoquefahim.vercel.app](https://mahtamunhoquefahim.vercel.app)  
**Live (Cloudflare Pages):** [mahtamunhoquefahim.pages.dev](https://mahtamunhoquefahim.pages.dev)  
**Design portfolio:** [mahtamundesigns.vercel.app](https://mahtamundesigns.vercel.app)

---

## Stack

| Layer       | Tech                                      |
|-------------|-------------------------------------------|
| Framework   | Next.js 14 App Router                     |
| Language    | TypeScript                                |
| Styling     | Tailwind CSS + CSS custom properties      |
| Database    | Supabase (PostgreSQL)                     |
| Fonts       | Syne · Onest · JetBrains Mono (Google Fonts) |
| Hosting     | Vercel (primary) + Cloudflare Pages (secondary) |
| Runtime     | Edge Runtime — all pages export `runtime = 'edge'` |

---

## Pages

| Route                  | Description                                    |
|------------------------|------------------------------------------------|
| `/`                    | Hero, services, personality, writing teaser    |
| `/about`               | Timeline, values, tools                        |
| `/blog`                | Post listing from Supabase                     |
| `/blog/[slug]`         | Post with custom Markdown renderer             |
| `/contact`             | Contact info + form → Supabase                 |
| `/admin`               | Dashboard (password protected via cookie)      |
| `/admin/posts`         | Manage blog posts                              |
| `/admin/posts/new`     | Write new post (Markdown editor)               |
| `/admin/posts/[id]`    | Edit existing post                             |
| `/admin/messages`      | View contact form submissions, mark as read    |

---

## Design System

See **[DESIGN_GUIDE.md](./DESIGN_GUIDE.md)** for the full reference — colors, typography, components, spacing, animation, and changelog.

Quick summary:

- **Background:** `#0a0a0a` — near-black
- **Accent:** `#00e676` — green, used for CTAs, active states, highlights
- **Text:** `#f0ede6` — warm white (not pure `#fff`)
- **Surface:** `#141414` — cards, panels
- **Fonts:** Syne (display/headings), Onest (body), JetBrains Mono (labels, code)

> ⚠️ Custom color tokens must be applied via inline `style={{ color: 'var(--accent)' }}` or hardcoded hex (`text-[#00e676]`), **not** Tailwind utility classes — CSS variables don't resolve at JIT build time.

---

## Local Development

### 1. Clone & install

```bash
git clone https://github.com/mahtamun-hoque-fahim/personal-website.git
cd personal-website
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ADMIN_PASSWORD=your_secure_password
```

### 3. Set up Supabase tables

Go to your Supabase project → SQL Editor → run `supabase/schema.sql`.

This creates:
- `blog_posts` — title, slug, content (Markdown), tags, published, reading_time
- `contact_messages` — name, email, subject, message, read flag

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Vercel (primary, recommended)

```bash
npm i -g vercel
vercel login
vercel
```

Or push to GitHub and import at [vercel.com/new](https://vercel.com/new). Add these env vars in the Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD`

### Cloudflare Pages (secondary)

This project is fully compatible with Cloudflare Pages via [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages).

**Build settings in Cloudflare dashboard:**

| Setting                | Value                              |
|------------------------|------------------------------------|
| Framework preset       | `Next.js`                          |
| Build command          | `npx @cloudflare/next-on-pages`    |
| Build output directory | `.vercel/output/static`            |
| Node.js version        | `20`                               |

**Environment variables** (same as Vercel, plus):

- `CF_PAGES=1` — disables Next.js image optimization (Cloudflare has no image server)

**Local preview with Wrangler:**

```bash
npm run build:cf     # builds with next-on-pages
npm run preview:cf   # runs locally with Wrangler
```

#### Edge Runtime notes

Every page exports `export const runtime = 'edge'` — required for Cloudflare Workers compatibility. Key constraints:

- **No Node.js APIs** (`fs`, `crypto`, `Buffer`, TCP sockets) — use Edge-compatible equivalents only
- **Supabase client** — created fresh per request (no module-level singleton), Realtime disabled (`eventsPerSecond: -1`), `persistSession: false`. See `lib/supabase.ts` for the full pattern and comments explaining why.
- **Cookies** — read via `next/headers` in Server Components / Route Handlers only, never in Client Components
- **Images** — `unoptimized: true` when `CF_PAGES=1` (set in `next.config.js`)

See `cf-edge-notes.md` for a per-file runtime checklist.

---

## Admin Access

Visit `/admin` — redirects to `/admin/login`.

Authentication uses a simple HTTP-only cookie (`fahim_admin_session`) set by a Server Action against `ADMIN_PASSWORD`. **Change this before deploying** — set a strong value in your deployment dashboard env vars.

### Writing a blog post

1. Go to `/admin/posts/new`
2. Write in Markdown — live preview included
3. Set tags (comma-separated), excerpt, optional cover image URL
4. Toggle **Published** when ready
5. Hit **Create post** — it appears on `/blog` immediately

Blog content is rendered by a custom zero-dependency Markdown renderer (`lib/markdown.ts`) — no `remark`, no `marked`, works on Edge Runtime.

---

## Project Structure

```
app/
├── page.tsx                 # Home — hero, services, personality, CTA
├── about/page.tsx           # Timeline, values, tools
├── blog/
│   ├── page.tsx             # Post listing
│   └── [slug]/page.tsx      # Single post
├── contact/page.tsx         # Contact info + form
├── admin/
│   ├── page.tsx             # Dashboard overview
│   ├── login/page.tsx       # Login form
│   ├── actions.ts           # Server Actions: login, logout
│   ├── posts/               # Post CRUD pages
│   └── messages/            # Messages viewer
├── layout.tsx               # Root layout, metadata, font loading
└── globals.css              # CSS variables, base styles, prose-dark, utilities

components/
├── Navbar.tsx               # Fixed nav, scroll-aware, mobile overlay
├── Footer.tsx               # Site footer
└── ContactForm.tsx          # Client-side contact form

lib/
├── supabase.ts              # Edge-safe Supabase client (getSupabase() + proxy)
├── markdown.ts              # Custom Markdown → HTML renderer (zero deps)
├── auth.ts                  # Admin cookie helpers
└── utils.ts                 # cn(), formatDate()

supabase/
└── schema.sql               # SQL to create tables + RLS policies
```

---

## Customising Content

| What               | Where                                              |
|--------------------|----------------------------------------------------|
| Hero text, stats   | `app/page.tsx`                                     |
| Services           | `app/page.tsx` → `services` array                  |
| Skills ticker      | `app/page.tsx` → `skills` array                    |
| About story        | `app/about/page.tsx`                               |
| Timeline           | `app/about/page.tsx` → `timeline` array            |
| Values             | `app/about/page.tsx` → `values` array              |
| Contact links      | `app/contact/page.tsx`                             |
| Nav links          | `components/Navbar.tsx` → `navLinks` array         |
| Accent color       | `app/globals.css` → `--accent` variable            |
| All design tokens  | See `DESIGN_GUIDE.md`                              |

---

## License

Personal portfolio — all rights reserved.  
Design and code by Mahtamun Hoque Fahim.
