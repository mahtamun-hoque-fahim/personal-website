# PLANNER.md — fahim. Personal Website

> Living technical document. Updated whenever `update repo` is triggered.
> Last updated: May 15, 2026

---

## Overview

| Field          | Value                                                                |
|----------------|----------------------------------------------------------------------|
| Project        | fahim. — Personal Website                                            |
| Purpose        | Full-stack personal portfolio with blog and admin CMS                |
| Target user    | Design/dev clients, recruiters, personal network                     |
| Key value      | Fully managed portfolio (blog + projects) with self-hosted admin     |
| Status         | Operational (Next 16 migration complete)                             |
| Repo           | `https://github.com/mahtamun-hoque-fahim/personal-website`           |
| Live           | `https://mahtamunhoquefahim.vercel.app`                              |

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
- **Deploy targets:** Vercel (primary) + Cloudflare Workers via OpenNext (secondary)

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
wrangler.jsonc                   Cloudflare Worker config
open-next.config.ts              OpenNext build config
scripts/patch-noble-ciphers.js   postinstall fix for @noble/ciphers dedupe
.env.example
```

---

## Database schema

**Better Auth tables (singular names — Better Auth convention):**

- `user`: id, name, email, emailVerified, image, timestamps
- `session`: id, userId (FK), token, expiresAt, ipAddress, userAgent, timestamps
- `account`: id, accountId, providerId, userId (FK), password (hashed), tokens, timestamps
- `verification`: id, identifier, value, expiresAt, timestamps

**Application tables (preserved from production):**

- `blog_posts`: uuid, title, slug (unique), excerpt, content, cover_image, published, tags[], reading_time, timestamps
- `contact_messages`: uuid, name, email, subject, message, country, read, created_at
- `projects`: uuid, name (unique), tagline, description, tags[], type, live_url, repo_url, featured, featured_order, timestamps

All Drizzle reads return camelCase fields; the column mapping (snake_case in DB) is handled by `casing: 'snake_case'` in the Drizzle client config.

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
| `BETTER_AUTH_URL`       | yes      | App base URL                                   |
| `NEXT_PUBLIC_APP_URL`   | yes      | Same as `BETTER_AUTH_URL`, exposed to client   |
| `RESEND_API_KEY`        | yes      | Resend API key                                 |
| `RESEND_FROM_EMAIL`     | yes      | Verified Resend domain sender                  |

---

## Migration from previous setup

What was removed:

- `@supabase/*` packages — `lib/supabase.ts`, `lib/projects.ts` deleted
- `bcryptjs` — Better Auth uses scrypt by default
- `@paralleldrive/cuid2`, `@react-email/render` — unused
- `@cloudflare/next-on-pages`, `wrangler` — single deploy target (Vercel)
- Legacy cookie auth (`lib/auth.ts` old version, `fahim_admin_session` cookie)
- Three fragmented DB layers (`lib/db.ts`, `lib/neon.ts`, `lib/drizzle/db.ts`) → one (`lib/db/`)
- `export const runtime = 'edge'` from every page — Node runtime everywhere

What was upgraded:

- Next 14.2.29 → 16.2.6
- React 18 → 19
- `eslint-config-next` to match Next 16
- `next-themes` 0.2.1 → 0.4.6
- `lucide-react` to latest
- Drizzle config now uses `casing: 'snake_case'` so JS gets camelCase fields

Breaking changes addressed:

- `cookies()`, `headers()`, `draftMode()` are now async — handled in `auth-utils.ts`
- `params` and `searchParams` are now `Promise<...>` — handled in `[slug]/page.tsx`, `[id]/page.tsx`, reset-password Suspense wrapper
- Field name migration in JS: `cover_image`, `live_url`, `repo_url`, `featured_order`,
  `reading_time`, `created_at`, `updated_at` → camelCase. DB columns unchanged.

---

## Cloudflare Workers (secondary deploy)

Configured via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) — the modern,
non-deprecated path for running Next.js on Cloudflare.

**Files involved:**

- `wrangler.jsonc` — Worker config with `nodejs_compat` + `global_fetch_strictly_public`,
  compat_date `2026-05-15`, ASSETS binding pointing at `.open-next/assets`
- `open-next.config.ts` — OpenNext build config (default in-memory cache; documented
  swap path for R2/KV-backed ISR caching)
- `next.config.ts` calls `initOpenNextCloudflareForDev()` so `next dev` exposes
  Cloudflare bindings locally
- `scripts/patch-noble-ciphers.js` — postinstall fix for a `@noble/ciphers` v1/v2
  dedupe issue (better-auth pulls v2 to top, dotenvx → eciesjs → @ecies/ciphers
  expects v1-style extensionless subpaths). The patch adds extensionless aliases
  to v2's exports map. Runs automatically on `npm install`.

**Why both `@better-auth/core` and `better-auth` are in `serverExternalPackages`:**

Next.js's standalone tracer follows the `"node"` export condition by default and only
copies files reachable through that condition into the build output. The workerd
condition for `@better-auth/core/instrumentation` points to a separate file
(`pure.index.mjs`) that wasn't traced. Marking the package external forces Next to
copy the whole package, which OpenNext then bundles with the correct condition resolution.

**Bundle size:** ~9.5 MiB raw / ~1.9 MiB gzipped. Fits Workers Paid (10 MiB) and Free
(3 MiB compressed) plans.

**Deploy scripts** (in `package.json`):

```
cf:build    opennextjs-cloudflare build
cf:preview  cf:build + opennextjs-cloudflare preview (runs in workerd via wrangler dev)
cf:deploy   cf:build + opennextjs-cloudflare deploy
cf:upload   cf:build + opennextjs-cloudflare upload (versioned, no traffic shift)
cf:typegen  wrangler types -> cloudflare-env.d.ts
```

**Cloudflare env vars** — runtime secrets set via `wrangler secret put NAME` (or
Dashboard → Workers → Settings → Variables); `NEXT_PUBLIC_APP_URL` must be set as
a Build Variable in Workers Builds since it's inlined at build time.

---

## Next steps

- Add a Drizzle seed script for projects (currently only in the deleted SQL file)
- Consider adding `revalidateTag` on Server Actions for finer cache control
- Add Vercel Speed Insights if desired (post `npm install @vercel/speed-insights`)
- Add 2FA / passkey via Better Auth plugins when ready
