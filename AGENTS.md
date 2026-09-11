# AGENTS.md — personal-website

## Session Start

Run before any commit, every session, no exceptions:

```bash
git config user.name "mahtamun-hoque-fahim"
git config user.email "mahtamunhoquefahim@gmail.com"
```

## Setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, DATABASE_URL_UNPOOLED, BETTER_AUTH_SECRET, BETTER_AUTH_URL
npm run dev
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | `next build --webpack` — production build |
| `npx tsc --noEmit` | Type-check only, no live DB needed |
| `npx drizzle-kit generate` | Generate a new migration from `lib/db/schema.ts` |
| `npx drizzle-kit migrate` | Apply pending migrations to `DATABASE_URL` |
| `npx drizzle-kit studio` | Browse the Neon DB |

## Conventions

- Stack: Next.js 16 App Router, TypeScript, Tailwind, Neon + Drizzle ORM (neon-http driver only, no node-postgres), Better Auth, Vercel + Cloudflare Pages/Workers dual deploy.
- DB access always goes through `lib/db/queries.ts` — no raw Drizzle calls from route/component files.
- Public-facing DB reads that feed metadata or layout should go through an `unstable_cache`-wrapped function (see `getCachedSiteSettings`) with an explicit tag, and admin save actions must `revalidateTag(tag, 'max')` — in this Next.js version `revalidateTag` requires the two-arg form.
- Admin routes follow the server/client split established in `app/admin/posts`: a server `page.tsx` does the auth check (`isAuthenticated()` from `lib/auth-utils.ts`, redirect to `/admin/login`) and data fetch, a client component owns the form/state and calls a `'use server'` action from `app/admin/actions.ts`.
- Dark-first palette: `#070807` background, `#3DF49A` mint accent. Fonts: Syne (`--font-clash`) for headings, Plus Jakarta Sans (`--font-jakarta`) for body, JetBrains Mono (`--font-jetbrains`) for labels/meta.
- No emojis anywhere in code or UI — lucide-react icons only.
- Migrations are generated with `drizzle-kit generate`, never hand-skipped — see the Security/Gotchas note below on why `0001` broke that rule and what that costs.

## Security / Gotchas

- **Migration snapshot chain drift**: `drizzle/0001_credentials_tables.sql` exists with no matching `drizzle/meta/0001_snapshot.json`. This means `drizzle-kit generate` diffs against `0000_snapshot.json`, not the true post-0001 state — any future `generate` run will re-propose objects that already exist in prod (this happened with `0002`, which had to be hand-trimmed down to just the actually-new `site_settings` table; `0002_snapshot.json` was kept as generated since it's a correct full-schema snapshot, which repairs the chain going forward). If you ever regenerate `0001` properly, re-verify `0002` still applies cleanly.
- **PATs are session-only.** Never commit a token, never write one into this file, .env files, or any doc. A fresh PAT is supplied in-chat per session.
- **neon-http driver only** — no node-postgres, no pooled connections outside what Neon's HTTP driver handles. Edge runtime compatible everywhere.
- Build verification (`npx tsc --noEmit` + `npm run build`) requires network access to `fonts.googleapis.com` (next/font/google) and to Neon (`DATABASE_URL`) for any DB-touching build step — both are unavailable in sandboxed dev environments without egress; run the full build locally or let Vercel's build do it.

## Session Log

### 2026-09-11 — Dashboard-driven metadata + Blog AuthorCard/JSON-LD
- Agent: claude-sonnet (chat)
- Added `site_settings` table (single row, `id=1`) — `title`, `description`, `job_title`, `keywords[]`, `og_title`, `og_description`, `updated_at`. Migration `0002_high_marrow.sql`, hand-trimmed (see Gotchas above).
- `app/layout.tsx`: static `metadata` export replaced with async `generateMetadata()` reading `getCachedSiteSettings()` (`unstable_cache`, 1h revalidate, tag `site-settings`). Root layout's inline JSON-LD Person block now also reads `jobTitle`/`description` from the same settings instead of a hardcoded duplicate.
- New admin route `/admin/settings` (`page.tsx` + `SettingsForm.tsx`), nav entry added to `AdminSidebar.tsx`, quick-action tile added to `/admin` dashboard.
- `saveSiteSettingsAction` (`app/admin/actions.ts`): `revalidateTag('site-settings', 'max')` + `revalidatePath('/')` on save.
- `components/AuthorCard.tsx` added, rendered at the bottom of `app/blog/[slug]/page.tsx` only. Links to `/projects`, `/blog`, GitHub, and the external design portfolio (`mahtamundesigns.vercel.app`) in place of a literal `/portfolio` route, which doesn't exist in this repo — matches the existing `Footer.tsx` convention.
- Blog post page had no JSON-LD at all before this change (despite PLANNER.md's AEO section referencing an Article schema). Added a full `Article` JSON-LD block with `headline`, `description`, `image`, `datePublished`, `dateModified`, and a nested `author` object (`Person`, `jobTitle` sourced from `site_settings`). Also added `authors` to the page's Next `Metadata` return.
- Verified: `npx tsc --noEmit` clean. `npm run build` could not complete in this sandbox — no egress to `fonts.googleapis.com` (next/font/google fetch) or Neon; needs verification locally or on Vercel.
- Not yet done: migration `0002` has not been applied to production Neon. Run `npx drizzle-kit migrate` once this is deployed, or seed the default row manually — `getSiteSettings()` will also create it lazily on first read if the migration is applied but the row doesn't exist yet.

### 2026-09-11 — Avatar upload (Cloudinary)
- Agent: claude-sonnet (chat)
- `site_settings.avatar_url` (text, nullable) — migration `0003`, clean diff this time (confirms the 0002 snapshot-chain repair worked).
- `lib/cloudinary.ts`: signed upload via plain `fetch` + Web Crypto SHA-1, not the `cloudinary` Node SDK — this repo dual-deploys to Cloudflare Workers via OpenNext, and Web Crypto works identically there and on Vercel. Fixed `public_id`/`folder` so re-uploads overwrite the same asset rather than accumulating orphaned images; response URL gets a `?v=timestamp` cache-buster.
- `uploadAvatarAction` / `removeAvatarAction` in `app/admin/actions.ts` — both do an explicit `isAuthenticated()` check inside the action itself. This is a deliberate deviation from the rest of this file (which relies entirely on the calling page's auth redirect): an unauthenticated file-upload endpoint is a meaningfully higher-risk surface than an unauthenticated text-field write. Worth considering the same explicit check for the other actions in this file at some point — flagging, not fixing, since that's a broader change than this task asked for.
- `AuthorCard.tsx` now renders the real photo when `avatarUrl` is set, initials fallback otherwise. Also threaded `avatarUrl` into both JSON-LD `Person` blocks (root layout + blog post Article author) as an `image` field, for the same reason `jobTitle`/`description` were threaded through earlier — keeping every rendering of the identity in sync with one source.
- Needs `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` set in Vercel + Cloudflare — not set anywhere yet, this is brand new infra for this repo (no prior image upload capability existed at all; blog covers are still the manual `blog-image` GitHub repo workflow).
- Verified: `npx tsc --noEmit` clean.

### 2026-09-11 — Fix: Server Action body size limit blocking avatar upload
- Agent: claude-sonnet (chat)
- Live `/admin/settings` upload was failing with a generic "An unexpected response was received from the server." — Next.js's default Server Action body limit is 1MB, so any real photo got rejected by the framework before `uploadAvatarAction` ever ran, producing that generic client-side parse-failure message rather than a real error.
- Fix: `next.config.ts` now sets `experimental.serverActions.bodySizeLimit: '4mb'`. Capped at 4MB rather than the previous 5MB check, to stay under Vercel's ~4.5MB serverless function request-body ceiling (a hard platform limit `bodySizeLimit` can't raise past).
- `MAX_AVATAR_BYTES` moved out of `lib/cloudinary.ts` into `lib/constants.ts` (no server-only deps) so `SettingsForm.tsx` can import the same constant for a client-side pre-check — oversized files now get an immediate "Image must be under 4MB." instead of a round trip that ends in the generic error.
- If upload still fails after this deploy with a *specific* message (not the generic one), the next likely cause is `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` not being set in Vercel yet.
