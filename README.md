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
| Database    | Neon (PostgreSQL)                         |
| Auth        | Better Auth (email/password + forgot password) |
| Fonts       | Syne · Onest · JetBrains Mono (Google Fonts) |
| Hosting     | Vercel (primary) + Cloudflare Pages (secondary) |
| Runtime     | Edge Runtime — all pages export `runtime = 'edge'` |

---

## Pages

| Route                  | Description                                    |
|------------------------|------------------------------------------------|
| `/`                    | Hero, services, personality, featured projects |
| `/about`               | Timeline, values, tools                        |
| `/blog`                | Post listing from Neon                         |
| `/blog/[slug]`         | Post with custom Markdown renderer             |
| `/projects`            | All 10 projects showcase                       |
| `/contact`             | Contact info + form → Neon                     |
| `/admin`               | Dashboard (Better Auth protected)              |
| `/admin/login`         | Sign up / Sign in                              |
| `/admin/forgot-password` | Request password reset email                  |
| `/admin/reset-password` | Reset password via email link                 |
| `/admin/posts`         | Manage blog posts                              |
| `/admin/posts/new`     | Write new post (Markdown editor)               |
| `/admin/posts/[id]`    | Edit existing post                             |
| `/admin/projects`      | Manage featured projects + reorder             |
| `/admin/messages`      | View contact form submissions, mark as read    |

---

## Design System

See **[DESIGN_GUIDE.md](./DESIGN_GUIDE.md)** for the full reference.

Quick summary:

- **Background:** `#0a0a0a` — near-black
- **Accent:** `#00e676` — green, used for CTAs, active states, highlights
- **Text:** `#f0ede6` — warm white (not pure `#fff`)
- **Surface:** `#141414` — cards, panels
- **Fonts:** Syne (display/headings), Onest (body), JetBrains Mono (labels, code)

---

## Prerequisites

- Node.js 18+ (with npm/yarn)
- Neon account ([console.neon.tech](https://console.neon.tech))

---

## Local Development

### 1. Clone & install

```bash
git clone https://github.com/mahtamun-hoque-fahim/personal-website.git
cd personal-website
npm install better-auth @neondatabase/serverless bcryptjs
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Neon Database
DATABASE_URL=postgresql://user:password@host/dbname

# Better Auth
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 3. Set up Neon database

1. Go to [console.neon.tech](https://console.neon.tech) and create a project
2. Copy your `DATABASE_URL`
3. In Neon SQL Editor → run `supabase/schema.sql`

This creates: `blog_posts`, `contact_messages`, `projects` tables + Better Auth tables (auto-created on first auth request)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Test admin auth:**
- Go to `/admin/login`
- Sign up with email + password (min 8 chars)
- Explore `/admin` dashboard

---

## Deployment

### Vercel (primary, recommended)

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your repo
3. Add env vars in Vercel dashboard:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (set to your production domain)
   - `NEXT_PUBLIC_APP_URL` (set to your production domain)
4. Deploy

### Cloudflare Pages (secondary)

**Build settings:**

| Setting                | Value                              |
|------------------------|------------------------------------|
| Framework preset       | `Next.js`                          |
| Build command          | `npx @cloudflare/next-on-pages`    |
| Build output directory | `.vercel/output/static`            |
| Node.js version        | `20`                               |

Add the same env vars as Vercel, plus `CF_PAGES=1`.

---

## Folder Structure

```
app/
├── page.tsx                 # Home
├── about/page.tsx           # About
├── blog/                    # Blog routes
├── projects/page.tsx        # All projects
├── contact/page.tsx         # Contact
├── admin/                   # Admin dashboard & CRUD
├── api/auth/[...all]/route.ts # Better Auth routes
└── globals.css              # CSS variables, base styles

components/
├── Navbar.tsx
├── Footer.tsx
├── ContactForm.tsx
└── ProjectCard.tsx

lib/
├── db.ts                    # Neon client
├── neon.ts                  # Database queries
├── auth-utils.ts            # Session helpers
├── auth.ts                  # Better Auth config
├── markdown.ts              # Custom Markdown renderer
└── utils.ts                 # Utilities

supabase/
└── schema.sql               # PostgreSQL schema
```

---

## Admin Access

Visit `/admin/login` to sign up or sign in.

- **Sign up:** Create new account with email + password (min 8 characters)
- **Sign in:** Enter email + password
- **Forgot password:** Click link on login page → reset via email

### Writing a blog post

1. Go to `/admin/posts/new`
2. Write in Markdown — live preview included
3. Set title, slug, excerpt, tags, cover image, reading time
4. Toggle **Published** when ready
5. Click **Create post** — appears on `/blog` immediately

### Managing projects

1. Go to `/admin/projects`
2. See all 10 projects
3. Toggle featured status + reorder
4. Changes saved immediately → homepage updates

---

## Key Files

| File | Purpose |
|------|---------|
| `PLANNER.md` | Full technical blueprint |
| `DESIGN_GUIDE.md` | Design system spec |
| `MIGRATION.md` | Setup guide: Supabase → Neon + Better Auth |
| `supabase/schema.sql` | PostgreSQL schema |
| `lib/neon.ts` | Database queries |
| `lib/auth.ts` | Better Auth configuration |
| `app/admin/actions.ts` | Server Actions |

---

## License

Personal portfolio — all rights reserved.  
Design and code by Mahtamun Hoque Fahim.
