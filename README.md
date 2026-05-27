# fahim. — Personal Website

Personal website of **Mahtamun Hoque Fahim** — Graphic Designer, Full-Stack Developer & UI/UX Designer from Bangladesh.

**Live:** [mahtamunhoquefahim.vercel.app](https://mahtamunhoquefahim.vercel.app)
**Design portfolio:** [mahtamundesigns.vercel.app](https://mahtamundesigns.vercel.app)

---

## Stack

| Layer       | Tech                                            |
|-------------|-------------------------------------------------|
| Framework   | Next.js 16 (App Router, Turbopack)              |
| Language    | TypeScript                                      |
| React       | 19                                              |
| Styling     | Tailwind CSS + CSS custom properties            |
| Database    | Neon (Postgres, serverless HTTP)                |
| ORM         | Drizzle ORM                                     |
| Auth        | Better Auth (email/password + reset)            |
| Email       | Resend                                          |
| Hosting     | Vercel (primary) + Cloudflare Workers (OpenNext)|

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
npm run cf:preview   # build + run locally in Cloudflare workerd runtime
npm run cf:deploy    # build + deploy to Cloudflare Workers
```

---

## Admin access

Public signup is **disabled**. The `/admin` area is gated by an email
allowlist defined in `ADMIN_EMAILS` (comma-separated) in `.env`.

Bootstrap your first admin account:

```bash
# Make sure ADMIN_EMAILS contains your email in .env first.
npm run admin:create -- you@example.com 'your-strong-password' "Your Name"
```

After that, sign in at `/admin/login`. Forgot your password? Use
`/admin/forgot-password` (requires Resend env vars to be set).

To revoke an admin: remove their email from `ADMIN_EMAILS` and redeploy.
The next request from any of their existing sessions will be rejected.

---

## Deploy

### Vercel (primary)

1. Push to `main`.
2. Add all env vars from `.env.example` to **Project Settings → Environment Variables**
   for Production, Preview, and Development.
3. First deploy after schema changes — run `npm run db:migrate` against your Neon DB
   (locally with `DATABASE_URL_UNPOOLED` set, or via a one-off Vercel script).

Vercel auto-detects Next.js. No `vercel.json` config beyond the framework hint.

### Cloudflare Workers (secondary)

Uses [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) — the modern
replacement for the deprecated `@cloudflare/next-on-pages`. Runs on Cloudflare's
Node.js runtime, so all the same code that runs on Vercel runs here too.

**One-time setup:**

```bash
# Authenticate Wrangler with your Cloudflare account
npx wrangler login

# Set production secrets (one per command, follow the prompt)
npx wrangler secret put DATABASE_URL
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put BETTER_AUTH_URL          # e.g. https://fahim-portfolio.workers.dev
npx wrangler secret put NEXT_PUBLIC_APP_URL      # same as above
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_FROM_EMAIL
```

`NEXT_PUBLIC_APP_URL` is the one client-side var — for Workers it has to be set at
**build time** as well (Workers Builds reads it from the dashboard's Build Variables).
The secrets above are runtime-only.

**Deploy:**

```bash
npm run cf:preview     # build + serve locally in workerd via wrangler dev
npm run cf:deploy      # build + deploy to Cloudflare
```

For git-driven deploys via **Workers Builds** (Cloudflare's CI), connect the repo
in the dashboard and set the build command to `npm run cf:build`, then deploy
command to `npx wrangler deploy`.

**What's in the repo for Cloudflare:**

- `wrangler.jsonc` — worker name, compat flags (`nodejs_compat`, `global_fetch_strictly_public`), assets binding
- `open-next.config.ts` — OpenNext config (default in-memory cache; swap to R2/KV for production-grade ISR)
- `next.config.ts` calls `initOpenNextCloudflareForDev()` so `next dev` can read Cloudflare bindings locally
- `scripts/patch-noble-ciphers.js` — postinstall fix for a `@noble/ciphers` v1/v2 dedupe clash between `better-auth` and `eciesjs` (transitive dep of OpenNext's dotenvx)
- Bundle: **~9.5 MiB raw / ~1.9 MiB gzipped** — fits Workers Paid (10 MiB) and Free (3 MiB compressed) plans

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

- Runs on **Node.js runtime** on both Vercel and Cloudflare (via OpenNext). No edge-runtime
  gymnastics needed — Better Auth, Drizzle, Resend, and Neon HTTP all work cleanly.
- The Neon HTTP driver (`@neondatabase/serverless`) is used in both environments since it
  works equally well on Vercel functions and Cloudflare Workers.
- See **[DESIGN_GUIDE.md](./DESIGN_GUIDE.md)** for color tokens, typography, and component patterns.
- See **[PLANNER.md](./PLANNER.md)** for full architecture, data model, and migration history.
