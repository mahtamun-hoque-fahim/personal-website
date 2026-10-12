# Mahtamun. — Personal Website

Personal website of **Mahtamun Hoque Fahim** — aspiring AI engineer, full-stack developer and UI/UX designer from Bangladesh. Public site (home, projects, about, credentials, blog, contact) plus a private admin dashboard that edits almost everything on it.

Live: <https://mahtamunhoquefahim.vercel.app>

---

## Stack

| Layer       | Tech                                            |
|-------------|-------------------------------------------------|
| Framework   | Next.js 16 (App Router). Turbopack in `next dev`; production builds use webpack (`next build --webpack`) |
| Language    | TypeScript                                      |
| React       | 19                                              |
| Styling     | Tailwind CSS 3.4 (not v4) + CSS custom properties, hardcoded hex values in components |
| Motion      | CSS-first (no animation library; `framer-motion` is installed but unused). See DESIGN_GUIDE.md section 8 |
| Database    | Neon (Postgres, serverless HTTP)                |
| ORM         | Drizzle ORM                                     |
| Auth        | Better Auth (email/password + reset, allowlist) |
| Email       | Resend                                          |
| Images      | Cloudinary (avatar, skill, About-page images, uploaded from the admin) |
| Hosting     | Vercel (primary) + Cloudflare Workers (OpenNext, secondary) |

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
| `ADMIN_EMAILS`          | Comma-separated allowlist of admin emails. Required — if unset, nobody can sign in. |
| `CLOUDINARY_CLOUD_NAME` | cloudinary.com/console → account details. All three Cloudinary vars are needed for any image upload in the admin (avatar, skills, About page); without them the upload buttons fail with a clear error. |
| `CLOUDINARY_API_KEY`    | Same page                                              |
| `CLOUDINARY_API_SECRET` | Same page (server only, never `NEXT_PUBLIC_`)          |

### 3. Database

Schema lives in `lib/db/schema.ts`; generated migrations are in `drizzle/` (numbered `0000` upward).

```bash
npm run db:generate    # after editing schema.ts: writes the next drizzle/NNNN_*.sql
npm run db:migrate     # applies pending migrations (needs DATABASE_URL_UNPOOLED)
npm run db:push        # dev only: sync schema directly, no migration file
```

In practice the generated SQL for this site's live database has been run by hand in the Neon SQL editor, one statement at a time. Either way, the rules that matter:

1. **Back up first:** `npx tsx scripts/export-backup.ts`.
2. **Add before you deploy:** an additive migration (new column with a default, new table) must be applied BEFORE the code that reads it is deployed. If the code ships first, its queries fail and the data-access functions in `lib/db/queries.ts` quietly fall back to defaults or empty lists, so the live site shows missing content instead of an error.
3. **Drop after you deploy:** remove a column only AFTER the code that stops reading it is live. Vercel previews and production share one database, so a drop breaks whatever production is still running.

Tables (16): `user`, `session`, `account`, `verification` (Better Auth); `site_settings`, `about_content` (single-row settings); `blog_posts`, `contact_messages`, `projects`, `skills`, `footer_links`; `credential_timeline`, `credential_clusters`, `credential_certs`, `credential_community`, `credential_contributions`. Column-level detail and the migration history are in [PLANNER.md](./PLANNER.md).

### 4. Run

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build (next build --webpack). Needs network access: fonts come from Google Fonts at build time, and pages read the database
npm run start        # serve production build
npm run db:studio    # Drizzle Studio (visual DB inspector)
npm run cf:preview   # build + run locally in Cloudflare workerd runtime
npm run cf:deploy    # build + deploy to Cloudflare Workers
```

`npm run lint` exists in `package.json` (`next lint`) but there is no ESLint configuration in the repo and `next lint` was removed in Next.js 16, so it does not work. The checks that are used are `npx tsc --noEmit` and the Vercel build.

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

### Bulk-importing projects

`/admin/projects` accepts pasted JSON for one-or-many projects. Schema and a
ready-to-paste example live in [`docs/PROJECT_JSON_SCHEMA.md`](docs/PROJECT_JSON_SCHEMA.md).
Inside the admin UI, a short version of the same reference is the collapsible
"Bulk import — schema reference" panel on the projects page, so you rarely have to leave
the page to look it up.

### What the dashboard edits

| Admin page          | Controls                                                                                       |
|---------------------|------------------------------------------------------------------------------------------------|
| `/admin/settings`   | Site title/description, job title, avatar, keywords, OG text, **strip speed** (both marquee strips) |
| `/admin/about`      | About page header, the extra text block and the story, their two images, homepage teaser, call to action |
| `/admin/projects`   | Projects (featured star and order, tags, collaborators, JSON import)                            |
| `/admin/skills`     | The "What I do" skills (rows or columns layout, images)                                         |
| `/admin/credentials`| Timeline, clusters, certificates, community roles, contributions                               |
| `/admin/posts`      | Blog posts (Markdown, cover image)                                                              |
| `/admin/footer-links` | Footer links                                                                                  |
| `/admin/messages`   | Contact-form messages                                                                           |

---

## Deploy

### Vercel (primary)

1. Push to `main`.
2. Add all env vars from `.env.example` to **Project Settings → Environment Variables**
   for Production, Preview, and Development.
3. Schema changes: apply the migration to Neon BEFORE merging the code that reads it
   (see "3. Database" above for the back-up and ordering rules).

Pull requests get a Vercel preview build. Stacked PRs (one branch built on another) must be
merged bottom-up with "Create a merge commit" and the base branch deleted after each merge;
otherwise GitHub merges the upper PR into the old base branch and the work never reaches `main`.

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
npx wrangler secret put DATABASE_URL_UNPOOLED
npx wrangler secret put BETTER_AUTH_URL          # e.g. https://personal-website.<your-subdomain>.workers.dev
npx wrangler secret put NEXT_PUBLIC_APP_URL      # same as above
npx wrangler secret put ADMIN_EMAILS
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_FROM_EMAIL
npx wrangler secret put CLOUDINARY_CLOUD_NAME
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
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
- Bundle: measured at **~9.5 MiB raw / ~1.9 MiB gzipped** in June 2026 (fit Workers Paid 10 MiB and Free 3 MiB compressed). Not re-measured since the motion, About and image-upload work; check it before relying on the Free plan.

---

## Project structure

```
app/
├── page.tsx, about/, projects/, credentials/, blog/ (+ [slug]/), contact/   public pages
├── layout.tsx              — root layout: fonts, metadata, ambient glow, JSON-LD
├── template.tsx            — route enter fade (skipped on /admin)
├── globals.css             — tokens, film grain, reveal/motion utilities
├── not-found.tsx, icon.svg, sitemap.ts, robots.ts
├── admin/                  — Better Auth-protected dashboard
│   ├── layout.tsx, actions.ts (all server actions), AdminSidebar.tsx
│   ├── login/, forgot-password/, reset-password/
│   └── about/, credentials/, footer-links/, messages/, posts/, projects/, settings/, skills/
└── api/auth/[...all]/      — Better Auth route handler (toNextJsHandler)
components/                 — Navbar, Footer, Logo, HeroPortrait, MarqueeStrip, MintGlow (ambient glow),
                              Reveal, BlurWords (scroll/blur motion), ProjectCard, ContactForm, AuthorCard,
                              CopyCodeInit (+ ProjectsSection: unused, not imported anywhere)
lib/
├── auth.ts, auth-client.ts, auth-utils.ts, admin-allowlist.ts   — Better Auth server/client, session helpers, allowlist
├── db/index.ts             — Drizzle client (Neon HTTP)
├── db/schema.ts            — Drizzle schema (auth + app tables)
├── db/queries.ts           — typed data-access functions (cached reads use unstable_cache + tags)
├── cloudinary.ts           — signed image uploads (avatar, skills, About images)
├── constants.ts, blog-image.ts, email.ts (Resend templates), markdown.ts (zero-dep renderer), utils.ts
public/                     — llms.txt, grain.png (film grain tile), images/fahim-hero.webp (hero portrait)
drizzle/                    — generated migrations (0000 ... latest)
scripts/                    — create-admin.ts, export-backup.ts (run before migrations),
                              credentials seed/sync/patch scripts (one-off), patch-noble-ciphers.js (postinstall)
docs/PROJECT_JSON_SCHEMA.md — bulk project import reference
AGENTS.md, PLANNER.md, DESIGN_GUIDE.md   — working docs (see below)
drizzle.config.ts, next.config.ts, tailwind.config.ts, wrangler.jsonc, open-next.config.ts
```

---

## Notes

- Runs on **Node.js runtime** on both Vercel and Cloudflare (via OpenNext). No edge-runtime
  gymnastics needed — Better Auth, Drizzle, Resend, and Neon HTTP all work cleanly.
- The Neon HTTP driver (`@neondatabase/serverless`) is used in both environments since it
  works equally well on Vercel functions and Cloudflare Workers.
- See **[DESIGN_GUIDE.md](./DESIGN_GUIDE.md)** for color tokens, typography, and component patterns.
- See **[PLANNER.md](./PLANNER.md)** for full architecture, data model, and migration history.
- See **[AGENTS.md](./AGENTS.md)** for working conventions (branches, migrations, the session log) before changing anything.
- See **[docs/PROJECT_JSON_SCHEMA.md](./docs/PROJECT_JSON_SCHEMA.md)** for the project bulk-import format.
