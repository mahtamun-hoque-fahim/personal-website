# PLANNER.md — fahim. Personal Website

> Living technical document. Updated whenever `update repo` is triggered.
> Last updated: June 01, 2026

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
- lucide-react (icons)
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
│   ├── layout.tsx               sidebar shell — wraps every /admin route except login
│   ├── AdminSidebar.tsx         client component, lucide icons + active route highlight
│   ├── page.tsx                 dashboard (stat cards, recent posts, recent messages)
│   ├── actions.ts               server actions (auth, blog CRUD, project CRUD, bulk import)
│   ├── login/page.tsx           sign-in only — signup UI removed
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
│   │   ├── JsonHelpPanel.tsx    collapsible JSON schema reference + copyable example
│   │   └── ProjectsManager.tsx  CRUD + status badges + collaborators + JSON bulk import
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
├── ProjectCard.tsx              status pill display, conditional BetaModal
├── ProjectsSection.tsx
└── CopyCodeInit.tsx
docs/
└── PROJECT_JSON_SCHEMA.md       bulk-import schema reference (paste into Paste JSON tab)
lib/
├── auth.ts                      Better Auth server config + nextCookies + signup hook
├── auth-client.ts               createAuthClient for React
├── auth-utils.ts                getSession, isAuthenticated (allowlist), getCurrentUser
├── admin-allowlist.ts           parse ADMIN_EMAILS env, isAdminEmail()
├── db/
│   ├── index.ts                 drizzle(neon(DATABASE_URL))
│   ├── schema.ts                user/session/account/verification + blog_posts/contact_messages/projects
│   └── queries.ts               typed Drizzle query functions incl. project CRUD
├── email.ts                     Resend templates (lazy init — no crash on missing key)
├── markdown.ts                  zero-dep MD renderer
└── utils.ts                     cn, formatDate, slugify, estimateReadingTime
drizzle/                         generated migrations (idempotent)
drizzle.config.ts
next.config.ts                   guarded initOpenNextCloudflareForDev() (dev only)
tailwind.config.ts
wrangler.jsonc                   CF Pages config (pages_build_output_dir)
open-next.config.ts              OpenNext build config
scripts/
├── tsconfig.json                isolates scripts from next build typecheck
├── patch-noble-ciphers.js       postinstall fix for @noble/ciphers dedupe
├── create-admin.ts              one-time admin bootstrap (signup is closed)
└── export-backup.ts             data backup — run before any DB migration
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
- `projects`: uuid, name (unique), tagline, description, tags[], type, live_url, repo_url, featured, featured_order, **status_badges text[]** (default `{}`), **collaborators jsonb** (default `[]`, shape `[{ name, url? }]`), timestamps

All Drizzle reads return camelCase fields; column mapping (snake_case in DB) handled by `casing: 'snake_case'` in the Drizzle client config.

**Migration history:**

| Order | Change                                | Applied via            |
|-------|---------------------------------------|------------------------|
| 0000  | Initial schema                        | `drizzle-kit generate` |
| —     | `projects.status_badges` (text[])     | `db:push` / ALTER      |
| —     | `projects.collaborators` (jsonb)      | `db:push` / ALTER      |

> **IMPORTANT:** Always run `npx tsx scripts/export-backup.ts` before any DB migration
> or ORM change.

---

## Admin auth — locked down

Public signup is **disabled**. Only emails in `ADMIN_EMAILS` (comma-separated env var) can ever be created or sign in.

**Enforcement layers (defense in depth):**

1. `lib/auth.ts → databaseHooks.user.create.before` rejects any signup whose email isn't allowlisted — runs even if someone hits the Better Auth API directly.
2. `lib/auth-utils.ts → isAuthenticated()` and `getCurrentUser()` also check the session's email against the allowlist — protects against stale DB rows or removed admins.
3. `/admin/login` UI has no signup toggle — sign-in only. Forgot password link is preserved.

**Bootstrap a new admin:**

```bash
# ADMIN_EMAILS must contain the email first in .env
npm run admin:create -- you@example.com 'password' "Name"
```

This writes directly through Better Auth (bypassing the UI), but still passes through the allowlist hook.

**Revoke an admin:** remove their email from `ADMIN_EMAILS` → redeploy. Existing sessions will fail the allowlist check on next request.

---

## Admin features

**Dashboard (`/admin`)**

- 4 stat cards: Posts (live/draft), Projects (featured count), Messages (unread), This week
- Recent posts panel (5 most recent, Live/Draft badges)
- Recent messages panel (5 most recent, unread highlight)
- Header CTAs: + New post, + New project
- Quick actions row with unread inbox count

**Sidebar (`/admin/AdminSidebar.tsx`)**

- Fixed 240px left rail with lucide icons
- Active route highlight via `usePathname`
- Sections: brand, Manage nav (Dashboard / Posts / Projects / Messages), footer (Back to site / Logout)
- Login/forgot/reset routes render full-bleed (no sidebar)

**Projects manager (`/admin/projects`)**

- Full CRUD: Create / Edit / Delete / Feature toggle / Reorder (↑↓)
- Form fields: name, type, tags (CSV), tagline, description, liveUrl, repoUrl, statusBadges, collaborators
- **Status badges**: 4 toggleable pills (`live` / `beta` / `deprecated` / `funding`) — any combination
- **Collaborators**: repeater of `{ name, url? }` entries — strings or objects
- **JSON bulk import tab**: upsert by `name`, accepts single object / array / `{ projects: [...] }`, per-row outcome panel (✓ new / ↻ updated / ✗ error)
- **`JsonHelpPanel`** on page itself: collapsible schema reference with copyable example — visible without opening the modal
- Inline ProjectFormModal also embeds the schema example in a `<details>` block
- Reference doc: `docs/PROJECT_JSON_SCHEMA.md` — full spec including the prompt template for asking Claude to scan repos

**Public side — ProjectCard**

- Status pills displayed below project name
- Collaborators shown as "with X, Y, Z" (with linkable names) below description
- `Live ↗` click behavior:
  - If `statusBadges` includes `beta` → opens BetaModal disclaimer first
  - Otherwise → direct link in new tab

---

## Auth flow

1. `app/api/auth/[...all]/route.ts` — Better Auth handler (GET + POST).
2. Client forms call `authClient.signIn.email()`, `authClient.requestPasswordReset()`, `authClient.resetPassword()`. (No `signUp` from UI — gated by allowlist hook in Better Auth.)
3. Server reads session via `auth.api.getSession({ headers: await headers() })` in `lib/auth-utils.ts → getSession()`.
4. `app/admin/layout.tsx` exports `dynamic = 'force-dynamic'` and gates the admin sidebar on `isAuthenticated()` (allowlist-aware). Individual admin pages also redirect to `/admin/login` if unauthenticated.
5. Logout = server action calling `auth.api.signOut`, then `redirect('/admin/login')`.

Password reset:
- `requestPasswordReset(email)` → Better Auth generates a token, stores it in `verification`, sends an email via `sendResetPassword` callback → Resend.
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
| `RESEND_API_KEY`        | yes*     | Resend API key — *now lazy; missing won't break build but emails fail silently |
| `RESEND_FROM_EMAIL`     | yes*     | Verified Resend domain sender                  |
| **`ADMIN_EMAILS`**      | **yes**  | Comma-separated allowlist for admin sign-in. **If unset → nobody can log in.** |

> **CF Pages note:** `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must be set to the
> CF Pages domain (`https://mahtamunhoquefahim.pages.dev`), not the Vercel domain.

---

## Build hardening (May–Jun 2026)

Two issues that silently broke every deploy for ~2 weeks before being found:

1. **`scripts/export-backup.ts`** used `sql('SELECT ...')` — invalid in `@neondatabase/serverless` v1, must be `sql.query(...)`. `next build` runs tsc across the whole repo so this single file blocked production deploys. **Fix:** corrected the call + added `tsconfig.json` exclude for `scripts/` + separate `scripts/tsconfig.json` so utility scripts still type-check via `tsx` but don't affect `next build`.

2. **`next.config.ts`** called `initOpenNextCloudflareForDev()` at module load unconditionally. The function (despite its name) kicks off unawaited async I/O — on Vercel this throws `EPIPE` and kills the build before compile. **Fix:** guard with `NODE_ENV !== 'production' && NEXT_PHASE !== 'phase-production-build'`.

3. **`lib/email.ts`** instantiated `new Resend(process.env.RESEND_API_KEY)` at module load. Missing key threw synchronously and killed "collect page data" via the auth → email transitive import chain. **Fix:** lazy `getResend()`, no-op with console.warn if key missing.

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

- `wrangler.jsonc` — uses `pages_build_output_dir: .open-next/assets` (CF Pages format, not Workers format)
- `open-next.config.ts` — default in-memory cache; documented R2/KV swap path for ISR
- `next.config.ts` — `initOpenNextCloudflareForDev()` runs only in dev (see Build hardening above)
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
| Admin lockdown (allowlist)    | ✅     | Signup disabled, ADMIN_EMAILS gate         |
| Vercel build unbreaking       | ✅     | EPIPE + scripts tsc + Resend lazy init     |
| Admin sidebar + dashboard     | ✅     | Lucide nav, stat cards, recent panels      |
| Project CRUD + JSON import    | ✅     | Form CRUD + bulk upsert by name            |
| Status badges                 | ✅     | live/beta/deprecated/funding pills         |
| Beta-gated live link modal    | ✅     | BetaModal only fires when badge='beta'     |
| Collaborators                 | ✅     | jsonb column, name + optional URL          |

---

## Next steps

- Apply the `status_badges` + `collaborators` migrations on production Neon if not already done (`npm run db:push` or run ALTER TABLEs)
- Bulk-import the project list using `docs/PROJECT_JSON_SCHEMA.md` as reference
- Add `revalidateTag` on server actions for finer cache control
- Add Vercel Speed Insights (`npm install @vercel/speed-insights`)
- Add 2FA / passkey via Better Auth plugins
- Consider drag-and-drop reorder on `/admin/projects` (currently ↑↓ arrows)
- Optional: tag chips input instead of comma-separated string in the form
