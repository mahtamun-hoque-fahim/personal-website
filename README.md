# fahim. — Personal Website

Personal website of **Mahtamun Hoque Fahim** — Graphic Designer, Full-Stack Developer & UI/UX Designer from Bangladesh.

**Live:** [mahtamunhoquefahim.vercel.app](https://mahtamunhoquefahim.vercel.app)
**Design portfolio:** [mahtamundesigns.vercel.app](https://mahtamundesigns.vercel.app)

---

## Stack

| Layer       | Tech                                       |
|-------------|--------------------------------------------|
| Framework   | Next.js 16 (App Router, Turbopack)         |
| Language    | TypeScript                                 |
| React       | 19                                         |
| Styling     | Tailwind CSS + CSS custom properties       |
| Database    | Neon (Postgres, serverless HTTP)           |
| ORM         | Drizzle ORM                                |
| Auth        | Better Auth (email/password + reset)       |
| Email       | Resend                                     |
| Hosting     | Vercel                                     |

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/mahtamun-hoque-fahim/personal-website.git
cd personal-website
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable                | Where                                                  |
|-------------------------|--------------------------------------------------------|
| `DATABASE_URL`          | Neon → Connection Details → **Pooled** connection      |
| `DATABASE_URL_UNPOOLED` | Neon → Connection Details → **Direct** connection      |
| `BETTER_AUTH_SECRET`    | `openssl rand -base64 32`                              |
| `BETTER_AUTH_URL`       | Your app's base URL (e.g. `http://localhost:3000`)     |
| `NEXT_PUBLIC_APP_URL`   | Same as `BETTER_AUTH_URL`                              |
| `RESEND_API_KEY`        | resend.com → API Keys                                  |
| `RESEND_FROM_EMAIL`     | A verified Resend domain                               |

### 3. Database

```bash
# Apply migrations (idempotent — safe to re-run)
npm run db:migrate

# Or sync schema directly (dev)
npm run db:push
```

Tables created: `user`, `session`, `account`, `verification` (Better Auth) plus existing
`blog_posts`, `contact_messages`, `projects` (preserved with `IF NOT EXISTS`).

### 4. Run

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint
npm run db:studio    # Drizzle Studio (visual DB inspector)
```

---

## Deploy (Vercel)

1. Push to `main`.
2. Add all env vars from `.env.example` to **Project Settings → Environment Variables**
   for Production, Preview, and Development.
3. First deploy after schema changes — run `npm run db:migrate` against your Neon DB
   (locally with `DATABASE_URL_UNPOOLED` set, or via a one-off Vercel script).

That's it — Vercel auto-detects Next.js. No `vercel.json` config beyond the framework hint.

---

## Project structure

```
app/
├── (public pages: /, /about, /blog, /projects, /contact)
├── admin/                  — Better Auth-protected dashboard
│   ├── layout.tsx          — session-gated nav
│   ├── actions.ts          — server actions
│   ├── login, forgot-password, reset-password
│   └── posts, projects, messages
├── api/auth/[...all]/      — Better Auth route handler (toNextJsHandler)
└── contact/actions.ts      — contact form server action
components/                 — Navbar, Footer, ProjectCard, ContactForm, etc.
lib/
├── auth.ts                 — Better Auth server config
├── auth-client.ts          — Better Auth React client
├── auth-utils.ts           — getSession, isAuthenticated helpers
├── db/
│   ├── index.ts            — Drizzle client (Neon HTTP)
│   ├── schema.ts           — Drizzle schema (auth + app tables)
│   └── queries.ts          — typed data-access functions
├── email.ts                — Resend templates
├── markdown.ts             — zero-dep Markdown renderer
└── utils.ts                — cn, formatDate, slugify, etc.
drizzle/                    — generated migrations
drizzle.config.ts
next.config.ts
tailwind.config.ts
```

---

## Notes

- The whole repo runs on **Node.js runtime** (Vercel default), not Edge. Better Auth
  and Drizzle work cleanly on Node, with no Cloudflare-edge gymnastics.
- The Neon HTTP driver (`@neondatabase/serverless`) is still used — it's just being
  called from Node functions rather than Edge.
- See **[DESIGN_GUIDE.md](./DESIGN_GUIDE.md)** for color tokens, typography, and component patterns.
