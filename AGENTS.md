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

### 2026-10-03 (skills section): real row/column layout switch, not just image-side
- Agent: claude-sonnet (chat)
- Misread Fahim's earlier sketch as "rows, with per-skill left/right image toggle." What he actually wanted was two complete arrangements (full-width rows, and a card grid with a centered icon) with a dashboard switch between them — should have asked when the sketch was ambiguous between those two readings instead of guessing.
- Built it properly this time: new `skillsLayout` column (`'rows' | 'columns'`, default `'rows'`) on `site_settings` (a site-wide switch, not per-skill), with a toggle at the top of `/admin/skills`. `app/page.tsx` renders one of two complete JSX blocks for the "What I do" section depending on this setting.
- Columns mode: unified card (one background/border, no split), icon centered above left-aligned title/desc, grid up to 3 across on desktop — matches Fahim's reference screenshot of his own already-uploaded icons. Rows mode is unchanged from last session (50/50 split, per-skill `imagePosition`). `imagePosition` is stored regardless of which layout is active, but only has a visible effect in rows mode — the admin form now says so.
- `drizzle-kit generate` run immediately after the schema edit, before committing. Neon SQL provided separately for the live DB.

### 2026-10-02 (skills section): back to stacked rows, image side switchable per entry
- Agent: claude-sonnet (chat)
- Per Fahim's sketch: skills section is no longer the 3-column card grid — it's a single-column stack of full-width rows again, each split 50/50 into image and text. New `imagePosition` column (`'left' | 'right'`, default `'left'`) on `skills`, with a Left/Right toggle in `/admin/skills`'s create/edit form, so which side the image sits on is per-skill and dashboard-controlled rather than fixed or auto-alternated. New entries default to alternating based on position in the list, as a starting suggestion only — fully overridable per skill.
- Image half keeps the transparent-background treatment from last session (blends a transparent PNG into the page); text half keeps its solid `bg-[#0A0C0B]`. On phones, `imagePosition` is ignored — always image-then-text, stacked, since left/right has no meaning in one column.
- Ran `drizzle-kit generate` immediately after the schema edit, before anything else, per the standing rule from the skills/footer-links mistakes earlier.
- Neon SQL provided separately (`add-skills-image-position.sql`) — adds the column (safe on an existing table: `NOT NULL DEFAULT 'left'` backfills automatically) and optionally alternates the 3 existing seeded skills left/right/left by sort order, matching the sketch's pattern.

### 2026-10-02 (skills section): thumbnail area transparent, text block solid
- Agent: claude-sonnet (chat)
- Per Fahim's annotated screenshot: reversed the earlier call on the skills-card thumbnail background. The top (image) area now has no background of its own (removed `bg-[#141712]`) so a transparent PNG blends straight into the page with no visible box around it. The bottom (title/desc) block now has an explicit solid background (`bg-[#0A0C0B]`), the opposite of the thumbnail above it.
- Admin skills manager description text updated to match. Left the small 64px thumbnail preview in the admin list view (`/admin/skills`) with its own light background unchanged on purpose — that's an internal management UI showing where the image slot is, not a copy of the public card's exact rendering, so the light box still earns its keep there.

### 2026-10-02 (branch cleanup): small-ui-fixes merged, replaced by small-fixes
- Agent: claude-sonnet (chat)
- `small-ui-fixes` was merged into `main` via PR #6 (up through the stray-typo-fix commit). My last commit on that branch — switching the skills-grid thumbnail to full-bleed (`object-cover`, no padding) — landed ~3 minutes after the merge, so it never made it into `main`.
- Fahim then hand-edited `main` directly: homepage copy/typo fixes, the `knowsAbout` list in `layout.tsx`, the availability section wording, renamed the skills-section heading to "I like building." (matching his reference) with a simplified header, and nudged the navbar blur `sm` -> `md` on top of my earlier change. None of that touched the skills-card markup itself, so no conflict with the thumbnail fix below.
- Deleted `small-ui-fixes` (stale, diverged from `main` post-merge) and created `small-fixes` fresh off current `main`. Reapplied the full-bleed thumbnail fix against `main`'s actual current file (not a blind cherry-pick, since the surrounding heading/header markup had changed) and updated the matching description text in `/admin/skills`.

### 2026-10-02 (homepage copy pass): typos, code-block syntax, "Aspiring" positioning
- Agent: claude-sonnet (chat)
- `app/page.tsx`: fixed typos (seperated, Develope, Postgress, Cause, centrice/softwares), missing spaces after punctuation, "curious about the space between pixels", and "Most developers leave security for last". Hero code block: unclosed `'Polymath;` string fixed, `Description`/`Availability` keys lowercased to match the rest.
- Eyebrow "Things I like and.." replaced with "Selected work"; "Things I write.." now ends with a single period.
- Positioning decision (Fahim): "Aspiring AI Engineer" everywhere. Updated `DEFAULT_SITE_SETTINGS` in `lib/db/queries.ts` and the placeholders in `app/admin/settings/SettingsForm.tsx`. The LIVE title/OG/description/jobTitle come from the `site_settings` DB row, so they must also be changed in `/admin/settings`. `lib/db/schema.ts` column defaults and `drizzle/meta` snapshots were deliberately NOT touched (changing them would need a migration).
- Hero stats (9+/2+/1+ years) kept as is, per Fahim. Note: `app/credentials/page.tsx` meta says "7+ years of professional design, 4+ years of full-stack development" - inconsistent with the homepage; unresolved.
- Project status badges (e.g. Bindu and LearnDE showing both `live` and `beta`) are DB-driven via `/admin/projects`, not code. Beta projects render "Live" as a button that opens a warning modal, not an anchor, so a missing `<a>` for those is expected behavior.
- Not run this session: `npx tsc --noEmit` / `npm run build` (string-only edits; Vercel build is the check).

### 2026-09-28 (skills section): switched from wide rows to compact icon-card grid
- Agent: claude-sonnet (chat)
- Per Fahim's reference (another site's "What I work on" section): replaced the full-width image-beside-text row layout (from the earlier Frame_6 sketch) with a compact card grid — 1 column on phones, up to 3 across on desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), each card holding a small 56px icon slot above the title and description, not a large image block beside it.
- Icon slot keeps the same transparent-PNG-friendly background idea as before (`#141712`, a shade lighter than the page), just much smaller and square instead of wide. No image uploaded yet -> falls back to showing the skill's number, same as before.
- Updated the stale "image beside text on wide screens" description text in `/admin/skills` to match the new grid.
- Section heading ("What I do" / "— three disciplines, one person") left untouched — only the cards below it changed.

### 2026-09-28 (navbar): more transparent, less blur, rounded hamburger bars
- Agent: claude-sonnet (chat)
- Navbar pill: `backdrop-blur-xl` -> `backdrop-blur-sm`, background opacity dropped a tier at both states (`/70`->`/40` idle, `/95`->`/70` scrolled), so more of what's behind it shows through.
- Hamburger icon: its 3 bars gained `rounded-full` end caps instead of square ones.

### 2026-09-28 (home CTA button): one-line label, again
- Agent: claude-sonnet (chat)
- Same "Start a conversation" wrap bug as the hero CTA fixed earlier — but that fix was made on `over-engineered`, a separate branch from `main` that `small-ui-fixes` doesn't include (neither branch has been merged). Applied the identical fix here: `whitespace-nowrap` + smaller `px-6` below 380px, with the label itself swapping to "Start conversation" below 380px and "Start a conversation" at 380px and up.
- Worth remembering next merge: `over-engineered` and `small-ui-fixes` both touch some of the same spots (this button, likely others) independently — check for overlapping fixes when either merges to main, to avoid reverting one branch's fix with the other's older version.

### 2026-09-28 (navbar): floating rounded pill instead of flush top bar
- Agent: claude-sonnet (chat)
- Per Fahim's sketch: Navbar.tsx no longer sits flush against the top edge as a square-cornered, full-bleed bar. It's now a floating pill, inset `top-4` from the viewport top (and `px-4`/`sm:px-6` from the sides), `rounded-full`, with a blurred background at all times — not just after scroll. Scroll still deepens the background opacity and adds a shadow for legibility over busy content, but the shape itself (floating, rounded, inset) is now constant, mobile and desktop alike.
- Logo stays left, hamburger stays right on mobile; desktop nav links replace the hamburger inside the same pill, same as before — only the outer shape changed, matching "expanded but like this" from the sketch.
- No page padding changes needed — the pill's total height (~16px top offset + ~60px bar) is well under the existing `pt-32` every page already uses to clear the fixed nav.

### 2026-09-28 (credentials admin): removed dead type/tags controls, no DB change needed
- Agent: claude-sonnet (chat)
- Checked: yes, the type badge (work/education/milestone) and the tag chips removed from the public timeline last session were both dashboard-editable, in `/admin/credentials`'s timeline form (`CredentialsManager.tsx`) — a Type dropdown, a "Tags (comma separated)" input, and matching read-only badges in the admin's own list view. With nothing on the public page rendering either anymore, both were dead controls (editing them had no visible effect) and are now removed from the form, the list view, and the JSON-import placeholder example. `isCurrent` ("Current role" checkbox) was left alone — still live, still tints the year/dot on the public page.
- Checked whether this needs Neon SQL: no. `credential_timeline.type` and `.tags` are both `NOT NULL` with DB-level defaults (`'work'` and `'{}'`), so omitting them from the dashboard's create payload is safe — Postgres fills the default, no constraint violation, no migration. Existing rows keep whatever type/tags values they already had; they're just inert now, not blanked out.
- Left the `type` and `tags` columns in `lib/db/schema.ts` as they are — removing them outright would be a bigger, less reversible step (an actual migration) that wasn't asked for. Easy to revisit if Fahim wants a full cleanup later.

### 2026-09-28 (credentials timeline): remove type badge, Current badge, tags
- Agent: claude-sonnet (chat)
- Per Fahim's annotated screenshot: removed, from every entry in the Experience & Education timeline (`app/credentials/page.tsx`) — the WORK/EDUCATION/MILESTONE type label next to the title, the green "Current" pill, and the row of tag chips below the description (e.g. "AI Engineering", "Remote", "Internship").
- Removed the now-dead `typeLabel()` helper along with it. Left `event.isCurrent` itself alone — it still tints the year and timeline dot mint-green for the current entry, which is a different, subtler cue than the text pill that got removed and wasn't part of what was circled.
- Scoped to the timeline section only. The Certifications badge text and the Contributions "releases" label are different content (not type/status chips) and weren't touched.

### 2026-09-28 (about CTA): last remaining unstacked button pair
- Agent: claude-sonnet (chat)
- Fahim's screenshot for the "credentials CTA" fix actually showed /about's CTA ("Get in touch" / "See portfolio ↗") — same no-wrap flex row bug, same fix. Searched the whole `app/` tree for the pattern (`flex gap-4 shrink-0` beside `rounded-full` buttons) to confirm this was the last one; /credentials was already fixed, /page.tsx's hero and bottom CTA were already fixed earlier this session, /projects and /contact have no button pairs like this.
- All secondary-CTA button pairs across the site now share the same rule: `flex-col` (full-width, stacked) below `sm` (640px), `flex-row` (auto-width, side by side) at `sm` and up.

### 2026-09-28 (credentials CTA): buttons stack on phone
- Agent: claude-sonnet (chat)
- /credentials page's "Want to work together?" CTA ("Get in touch" / "LinkedIn") sat in a no-wrap flex row, same overflow risk as the hero and footer bugs this session. Now `flex-col` (full-width, stacked) below `sm` (640px), `flex-row` (auto-width, side by side) at `sm` and up.

### 2026-09-28 (footer): dashboard-driven, restructured to fix mobile overflow
- Agent: claude-sonnet (chat)
- Bug: the footer's 5 nav links (About, Blog, Contact, Portfolio, LinkedIn) sat in one `flex` row with no wrap, so on phones the row overflowed and the first item ("About") got clipped off the left edge.
- Fix + feature: new `footer_links` table (label, url, groupLabel, external, sortOrder), full CRUD at `/admin/footer-links` (`FooterLinksManager.tsx`), linked from the sidebar. Links sharing a `groupLabel` render as one footer column.
- `Footer.tsx` is now an async Server Component reading `getFooterLinks()` (previously a static component with a hardcoded link list). Layout: brand block + link columns side by side on desktop (`md:flex-row`), brand then each column stacked full-width on phones (`flex-col`, `grid-cols-1` under `sm`), divider + centered copyright below — matches the structural pattern Fahim sketched (not its colors/copy).
- Grouping is by label only, not by numeric contiguity: bucketed with a `Map` keyed by `groupLabel`, so reordering one link can never split it from its group. Per-item reorder swaps `sortOrder` only with the neighbor *within the same group*, so it can't accidentally jump columns either.
- Neon seed SQL provided separately (`create-and-seed-footer-links.sql`) — seeds the current 5 links as "Navigate" (About, Blog, Contact) and "Elsewhere" (Portfolio, LinkedIn), matching current hrefs/targets exactly.
- Learned from the skills-table mistake last session: ran `drizzle-kit generate` immediately after finalizing schema.ts this time, before committing, so the migration and schema never drift apart in the same commit.

### 2026-09-28 (hero buttons): stack on phone
- Agent: claude-sonnet (chat)
- Hero "Let's talk" / "About me" buttons sat side by side at every width, cramped on narrow phones. Now `flex-col` (full-width, stacked) below the `sm` breakpoint (640px) and `flex-row` (auto-width, side by side) at `sm` and up, per Fahim's sketch.

### 2026-09-28: Skills CRUD + "What I do" redesign (branch small-ui-fixes)
- Agent: claude-sonnet (chat)
- Branch created fresh from `main` (not from `over-engineered` — no eyebrow/dash/font changes carried over).
- New `skills` table (`lib/db/schema.ts`): title, desc, imageUrl, sortOrder, timestamps. Full CRUD in `lib/db/queries.ts` and `app/admin/actions.ts`, admin UI at `/admin/skills` (`SkillsManager.tsx`), linked from `AdminSidebar.tsx`.
- Image upload: new `uploadSkillImageToCloudinary` in `lib/cloudinary.ts`, separate from the avatar uploader — each skill's thumbnail lives at its own `skill-<id>` Cloudinary public_id, so uploads don't collide across skills or force a single shared slot.
- Home page "What I do" (`app/page.tsx`): replaced the hardcoded `services` array with `getSkills()`; rebuilt from a 3-column grid into a single-column list of full-width rows — image beside text on desktop (`md:flex-row`), image above text on phones (`flex-col`). No image yet → falls back to showing the skill's number.
- Thumbnail background is `#141712` (a shade lighter than the page's `#070807`) specifically so a transparent PNG upload still reads as a card instead of floating on empty space.
- Neon seed SQL provided separately (`create-and-seed-skills.sql`) — creates the table and seeds the 3 existing cards (Graphic Design, UI/UX Design, Full-Stack Dev) with `image_url` left NULL; images to be uploaded later from the dashboard.
- Known gap: `MAX_AVATAR_BYTES` (4MB) is reused as the skill-image size cap rather than a dedicated constant — fine for now, rename if a different limit is ever wanted for skill thumbnails specifically.

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
