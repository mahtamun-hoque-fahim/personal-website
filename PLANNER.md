# PLANNER.md — fahim. Personal Website

> Living technical document. Updated whenever `update repo` is triggered.
> Last updated: May 27, 2026

---

## Overview

| Field          | Value                                                                |
|----------------|----------------------------------------------------------------------|
| Project        | fahim. — Personal Website                                            |
| Purpose        | Full-stack personal portfolio with blog and admin CMS                |
| Target user    | Design/dev clients, recruiters, personal network                     |
| Key value      | Fully managed portfolio (blog + projects) with self-hosted admin     |
| Status         | Operational                                                          |
| Repo           | `https://github.com/mahtamun-hoque-fahim/personal-website`           |
| Live (Vercel)  | `https://mahtamunhoquefahim.vercel.app`                              |
| Live (CF)      | `https://mahtamunhoquefahim.pages.dev`                               |

---

## Architecture

**Stack**

- Next.js 16 App Router (Turbopack, Node.js runtime)
- TypeScript, React 19
- Tailwind CSS + CSS custom properties
- Neon Postgres (serverless HTTP driver)
- Drizzle ORM (single data layer)
- Better Auth (email/password, password reset, sessions in DB)
- Resend (transactional email)
- **Deploy targets:** Vercel (primary) + Cloudflare Pages via OpenNext (secondary)

**Folder structure**

```
app/
├── page.tsx                     home
├── about/page.tsx
├── blog/
│   ├── page.tsx                 blog listing
│   └── [slug]/page.tsx          single post (async params)
├── projects/page.tsx
├── contact/
│   ├── page.tsx
│   └── actions.ts               server action: submitContactMessage
├── admin/
│   ├── layout.tsx               force-dynamic, Better Auth session check
│   ├── page.tsx                 dashboard
│   ├── actions.ts               server actions (logout, save post, etc.)
│   ├── login/page.tsx           authClient.signIn / signUp
│   ├── forgot-password/page.tsx authClient.requestPasswordReset
│   ├── reset-password/page.tsx  authClient.resetPassword
│   ├── posts/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   ├── [id]/page.tsx        async params
│   │   ├── PostEditor.tsx
│   │   └── DeletePostButton.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   └── ProjectsManager.tsx
│   └── messages/
│       ├── page.tsx
│       └── MarkReadButton.tsx
├── api/auth/[...all]/route.ts   toNextJsHandler(auth)
├── layout.tsx
├── not-found.tsx
├── robots.ts
└── sitemap.ts
components/
├── Navbar.tsx
├── Footer.tsx
├── ContactForm.tsx              client; calls submitContactMessage action
├── ProjectCard.tsx              uses Project type from lib/db/queries
├── ProjectsSection.tsx
└── CopyCodeInit.tsx
lib/
├── auth.ts                      Better Auth server config + nextCookies plugin
├── auth-client.ts               createAuthClient for React
├── auth-utils.ts                getSession, isAuthenticated, getCurrentUser
├── db/
│   ├── index.ts                 drizzle(neon(DATABASE_URL))
│   ├── schema.ts                user/session/account/verification + blog_posts/contact_messages/projects
│   └── queries.ts               typed Drizzle query functions
├── email.ts                     Resend templates
├── markdown.ts                  zero-dep MD renderer
└── utils.ts                     cn, formatDate, slugify, estimateReadingTime
drizzle/                         generated migrations (idempotent)
drizzle.config.ts
next.config.ts                   includes initOpenNextCloudflareForDev()
tailwind.config.ts
wrangler.jsonc                   CF Pages config (pages_build_output_dir)
open-next.config.ts              OpenNext build config
scripts/
├── patch-noble-ciphers.js       postinstall fix for @noble/ciphers dedupe
└── export-backup.ts             data backup script — run before any DB migration
.env.example
```

---

## Database schema

**Better Auth tables (singular names — Better Auth convention):**

- `user`: id, name, email, emailVerified, image, timestamps
- `session`: id, userId (FK), token, expiresAt, ipAddress, userAgent, timestamps
- `account`: id, accountId, providerId, userId (FK), password (hashed), tokens, timestamps
- `verification`: id, identifier, value, expiresAt, timestamps

**Application tables:**

- `blog_posts`: uuid, title, slug (unique), excerpt, content, cover_image, published, tags[], reading_time, timestamps
- `contact_messages`: uuid, name, email, subject, message, country, read, created_at
- `projects`: uuid, name (unique), tagline, description, tags[], type, live_url, repo_url, featured, featured_order, timestamps

All Drizzle reads return camelCase fields; column mapping (snake_case in DB) handled by `casing: 'snake_case'` in the Drizzle client config.

> **IMPORTANT:** Always run `npx tsx scripts/export-backup.ts` before any DB migration
> or ORM change. Learned from Next.js 16 migration — blog data was left in Supabase
> when the data layer was switched to Neon without migrating first.

---

## Auth flow

1. `app/api/auth/[...all]/route.ts` — Better Auth handler (GET + POST).
2. Client forms call `authClient.signIn.email()`, `authClient.signUp.email()`,
   `authClient.requestPasswordReset()`, `authClient.resetPassword()`.
3. Server reads session via `auth.api.getSession({ headers: await headers() })` in
   `lib/auth-utils.ts → getSession()`.
4. `app/admin/layout.tsx` exports `dynamic = 'force-dynamic'` and gates the admin
   chrome on `getSession()`. Individual admin pages also redirect to
   `/admin/login` if unauthenticated.
5. Logout = server action calling `auth.api.signOut`, then `redirect('/admin/login')`.

Password reset:
- `requestPasswordReset(email)` → Better Auth generates a token, stores it in
  `verification`, sends an email via `sendResetPassword` callback → Resend.
- Reset link → `/admin/reset-password?token=...` → `authClient.resetPassword({ newPassword, token })`.

---

## Environment variables

| Variable                | Required | Notes                                          |
|-------------------------|----------|------------------------------------------------|
| `DATABASE_URL`          | yes      | Neon pooled URL, used in app                   |
| `DATABASE_URL_UNPOOLED` | yes (CI) | Direct Neon URL for `drizzle-kit` migrations   |
| `BETTER_AUTH_SECRET`    | yes      | `openssl rand -base64 32`                      |
| `BETTER_AUTH_URL`       | yes      | App base URL (differs per deploy target)       |
| `NEXT_PUBLIC_APP_URL`   | yes      | Same as `BETTER_AUTH_URL`, exposed to client   |
| `RESEND_API_KEY`        | yes      | Resend API key                                 |
| `RESEND_FROM_EMAIL`     | yes      | Verified Resend domain sender                  |

> **CF Pages note:** `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must be set to the
> CF Pages domain (`https://mahtamunhoquefahim.pages.dev`), not the Vercel domain.

---

## Cloudflare Pages (secondary deploy)

Configured via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

**CF Pages dashboard settings:**

| Setting              | Value                    |
|----------------------|--------------------------|
| Build command        | `npm run cf:build`        |
| Build output dir     | `.open-next/assets`       |
| Compatibility flags  | `nodejs_compat`, `global_fetch_strictly_public` |
| Compatibility date   | `2026-05-15`              |

**Files involved:**

- `wrangler.jsonc` — uses `pages_build_output_dir: .open-next/assets` (CF Pages format,
  not Workers format). The `main` + `assets binding` fields are for `wrangler deploy`
  (Workers) only.
- `open-next.config.ts` — default in-memory cache; documented R2/KV swap path for ISR
- `next.config.ts` calls `initOpenNextCloudflareForDev()` for local binding support
- `scripts/patch-noble-ciphers.js` — postinstall fix for `@noble/ciphers` v1/v2 dedupe

**Deploy scripts:**

```
cf:build    opennextjs-cloudflare build
cf:preview  cf:build + opennextjs-cloudflare preview
cf:deploy   cf:build + opennextjs-cloudflare deploy
cf:upload   cf:build + opennextjs-cloudflare upload
cf:typegen  wrangler types -> cloudflare-env.d.ts
```

---

## Timeline

| Phase                         | Status | Notes                                      |
|-------------------------------|--------|--------------------------------------------|
| Foundation (Next 14, Supabase)| ✅     | Original setup                             |
| Projects + Blog               | ✅     | Full CRUD via admin                        |
| Auth migration (Better Auth)  | ✅     | Email/password + forgot password + Resend  |
| Next 16 + Neon + Drizzle      | ✅     | Full stack consolidated, Supabase removed  |
| Cloudflare Pages (OpenNext)   | ✅     | wrangler.jsonc fixed for CF Pages format   |
| Blog data restored            | ✅     | 10 posts migrated from Supabase to Neon    |

---

## Next steps

- Run `npm run db:push` in personal-website dir to create tables on Neon if fresh DB
- Add a Drizzle seed script for projects
- Consider `revalidateTag` on Server Actions for finer cache control
- Add Vercel Speed Insights (`npm install @vercel/speed-insights`)
- Add 2FA / passkey via Better Auth plugins when ready
