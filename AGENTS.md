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
- Dark-first palette: the page is true black (`#000000`) with a gray ladder above it (`#222222` surfaces, `#333333` lines, `#444444` glow and hover borders), `#3DF49A` mint accent. See DESIGN_GUIDE.md section 2. Fonts: Syne (`--font-clash`) for headings, Plus Jakarta Sans (`--font-jakarta`) for body, JetBrains Mono (`--font-jetbrains`) for labels/meta.
- No emojis anywhere in code or UI — lucide-react icons only.
- Motion is CSS-first (no animation library). Never `transition-all`: list the properties. Scroll reveals use `components/Reveal.tsx` / `BlurWords.tsx` (blur-fade, once per view); above-the-fold entrances use the CSS-only `.blur-load` / `BlurWords mode="load"`. Hidden states live under `@media (scripting: enabled)`, and `prefers-reduced-motion` is handled globally in `globals.css`. Full rules in DESIGN_GUIDE.md section 8. Do not use `.blur-stagger` on `gap-px` grids.
- Migrations are generated with `drizzle-kit generate`, never hand-skipped — see the Security/Gotchas note below on why `0001` broke that rule and what that costs.

## Security / Gotchas

- **Migration snapshot chain drift**: `drizzle/0001_credentials_tables.sql` exists with no matching `drizzle/meta/0001_snapshot.json`. This means `drizzle-kit generate` diffs against `0000_snapshot.json`, not the true post-0001 state — any future `generate` run will re-propose objects that already exist in prod (this happened with `0002`, which had to be hand-trimmed down to just the actually-new `site_settings` table; `0002_snapshot.json` was kept as generated since it's a correct full-schema snapshot, which repairs the chain going forward). If you ever regenerate `0001` properly, re-verify `0002` still applies cleanly.
- **PATs are session-only.** Never commit a token, never write one into this file, .env files, or any doc. A fresh PAT is supplied in-chat per session.
- **neon-http driver only** — no node-postgres, no pooled connections outside what Neon's HTTP driver handles. Edge runtime compatible everywhere.
- Build verification (`npx tsc --noEmit` + `npm run build`) requires network access to `fonts.googleapis.com` (next/font/google) and to Neon (`DATABASE_URL`) for any DB-touching build step — both are unavailable in sandboxed dev environments without egress; run the full build locally or let Vercel's build do it.

## Session Log

### 2026-10-09 (static glow + black): single fixed glow, background #000000, branch `glow-roam`
- Agent: claude-sonnet (chat)
- Request (Fahim): single glow, fixed blur, background `#000000`. Context: he asked whether the roaming branch is redundant if the blur drift is off; answered that drift (blur over time) and roam (position over time) are different, and he chose a static glow.
- Glow: `components/MintGlow.tsx` rewritten again. One orb, fixed Gaussian-style softness, no roaming, no drift, no hold timer. It is centred behind the hero portrait (`data-glow-anchor`), re-measured on load, resize and navigation, glides 1.2s between the portrait spot and the upper-right default used on pages without a portrait, fades in once placed, keeps the 28% scroll parallax. The roaming version is in git history at `14cec60`. The branch name `glow-roam` is now misleading (rename it if wanted; nothing depends on the name).
- Background: every `#111111` (public site and admin, 28 occurrences in 18 files, plus `--bg` and the favicon glyph) became `#000000`. `lib/email.ts` still has the old palette. Surfaces `#222222`, lines `#333333`, hover borders and glow `#444444` unchanged: he only specified the background, so the ladder is now black, 222, 333, 444 (a bigger jump from the page to the first surface than before).
- Check: the suit in the portrait averages about `#212121` (lower torso about `#111111`), so on pure black it stays visible, where it nearly vanished on `#111111`. The glow's centre colour is lower on black (alpha 0.22 of `#444444` is about `#0F0F0F`, was about `#1C1C1C` on `#111111`) though its lift over the page is a bit larger; raise `GLOW_PEAK` if it reads too faint.
- Docs: DESIGN_GUIDE palette (tokens, text, snippets) and the Ambient glow row updated; the 2026-06-29 changelog row was restored to its true `#070807` (an earlier bulk remap had rewritten it).
- Verified: `npx tsc --noEmit` clean after each commit; grep finds no `#111111` left outside the email template. NOT verified in a browser: how the portrait and glow read on pure black, and that the glow lands behind the portrait at 1024, 1366 and 1920 widths.

### 2026-10-09 (cleanup): `glow-drift` branch deleted, branch `glow-roam`
- Agent: claude-sonnet (chat)
- Decision (Fahim, after being told it held the only copy of the drift code): delete `glow-drift`, local and remote. Deleted at tip `ffc7af9` (commits `2ad28ca` drift code, `ffc7af9` docs). If the random softness drift is ever wanted again: `git fetch origin ffc7af9 && git branch glow-drift ffc7af9` works only while GitHub still serves the commit (not guaranteed, no PR was opened), otherwise rebuild from the description in the 2026-10-08 glow-drift entry above (two soft gradient layers, opacity cross-fade on random 6-14s timers, independent per orb).
- Earlier entries that say `glow-drift` was "kept for later" are history; the branch no longer exists. The roaming glow on `glow-roam` supersedes it.
- Remaining remote branches: `main`, `small-fixes` (already merged into `main`, 0 commits of its own, safe to delete), `motion-polish`, `face-reveal`, `glow-roam` (stacked in that order).

### 2026-10-09 (glow-roam): one softer, roaming background glow that starts behind the portrait, branch `glow-roam` (off `face-reveal`)
- Agent: claude-sonnet (chat)
- Request (Fahim): keep only the right-side glow, make it a bit more blurred, let it roam around the background, always starting from behind his picture and staying there for 3 seconds at the beginning.
- Done (`components/MintGlow.tsx` rewritten): (1) the lower-left echo orb is removed; (2) the remaining orb uses a smooth Gaussian-style falloff (11 stops, `closest-side`, no border-radius clip) and is about 13% larger, which is what "more blurred" means here (the old linear fade ended at a faintly visible disc edge); (3) roaming: placed instantly behind the portrait, fades in over 1.4s, rests 3s, then every 16-26s eases to a random viewport point at least 30% of the diagonal from where it is; (4) the portrait carries `data-glow-anchor`, and MintGlow centres on it (biased to face and shoulders, 38% down); (5) MintGlow lives in RootLayout, so it persists across client navigation: navigating to a page that has the portrait (the homepage) glides it back behind the portrait over 2.2s, rests 3s, then roams again; on other pages it keeps roaming.
- Implementation notes: only `transform` animates (CSS transition, compositor-only); scroll parallax moved to a separate zero-size wrapper so two transforms never fight; the orb is hidden (`.glow-orb`, `@media (scripting: enabled)`) until JS positions it so it never flashes at the wrong spot, and shows at the old upper-right position without JS. If the portrait is hidden (phones, below 640px) or scrolled out of view at load, it starts from the upper-right default instead. Reduced motion: no roaming, no glide, no parallax.
- Left alone: the separate faint glow at the bottom of the homepage closing "Reach Out!" section (`app/page.tsx`), because he spoke about the two background glows. The earlier random softness drift stays only on `glow-drift` (not adopted).
- Housekeeping: an earlier attempt in the same session had left a duplicate `data-glow-anchor` attribute/comment and an unused `glow-in` keyframes block; both removed before committing.
- Verified: `npx tsc --noEmit` clean. NOT verified in a browser: that the glow really starts behind the portrait (the anchor point is the portrait box centre, 38% down), that the pace feels like roaming and not drifting-too-fast/slow, and that the hold-then-glide feels right after navigating Home.

### 2026-10-09 (glow drift not adopted): back to the steady glow, branch `face-reveal`
- Agent: claude-sonnet (chat)
- Decision (Fahim): undo the random glow drift, but keep the `glow-drift` branch.
- Done: nothing to revert in code. The drift only ever existed on `glow-drift` (commits `2ad28ca` and `ffc7af9`, built on `face-reveal` at `f60c6c0`); `face-reveal` never contained it, so the steady `#444444` glow in `components/MintGlow.tsx` is what ships from here. `glow-drift` was deliberately left untouched on the remote so the experiment can be revisited (tuning knobs: `DRIFT_*` / `SOFT_*` constants at the top of `MintGlow.tsx` there).
- Consequence: `glow-drift` no longer contains the tip of `face-reveal` (it lacks this note). Harmless; if it is ever resurrected, merge `face-reveal` into it first. Do not re-add the drift without being asked.
- Work from `face-reveal` (and its preview deployment), not `glow-drift`.

### 2026-10-08 (palette): new neutral palette, branch `face-reveal`
- Agent: claude-sonnet (chat)
- Request (Fahim): background `#111111`; everything else `#222222` and `#333333`; glow `#444444`. (Triggered by his question whether the background was `#000000`; it was `#070807`.)
- How I read it: a four-step gray ladder. `#111111` page; `#222222` surfaces/fills; `#333333` lines; `#444444` glow. Text colours (`#F3F6F4`, `#8A938E`, `#5C615E`, `#C7CCCA`) and the mint accent `#3DF49A` were NOT in the request and are unchanged.
- Mapping applied (role-aware, via a throwaway script; roles read from the Tailwind utility or CSS property):
  - `#070807` (page, grid cells, nav) to `#111111`.
  - Fills `#0F0F0F`, `#0A0C0B`, `#090A09`, `#0F1210`, `#141712`, `#121312`, `#0C0D0C` to `#222222`.
  - Lines `#1F2421` to `#333333` (borders, dividers, the `gap-px` grid colour, decorative separators). Reason: a border must differ from the surface under it, and surfaces are now `#222222`.
  - `#2B302D` / `#3A3F3C` by role: as border or hover-border to `#444444` (so hover still reads as a step up from the new `#333333` borders), as fill to `#333333`, as TEXT or placeholder to `#5C615E` (the existing dim-text tone; `#333333` text on `#222222` would be about 1.3:1 and unreadable). `#3B3F3D` / `#474C49` text to `#5C615E`.
  - `--bg`, `--surface`, `--border` in `globals.css` updated; `rgba(31,36,33,.8)` pre border to `rgba(51,51,51,.8)`; code block background `rgba(0,0,0,.45)` to `rgba(34,34,34,.6)`; favicon glyph (light mode) to `#111111`.
- Glow: `components/MintGlow.tsx` `GLOW_RGB` is `'68, 68, 68'` (`#444444`). Alphas raised (0.06/0.02/0.03 became 0.24/0.08/0.12) because `#444444` over `#111111` needs about 4x the alpha to give the same faint lift the light-gray glow gave; if it reads too strong or too faint, tune those three numbers. The closing "Reach Out!" section glow (`app/page.tsx`) was mint and is now `rgba(68,68,68,0.28)`.
- Scope: public site and the admin dashboard (they share these tokens), as two separate commits so the admin one can be dropped. NOT changed: `lib/email.ts` (transactional emails keep the old dark palette), mint accent usages (buttons, focus rings, `.border-glow`, credential dot glow).
- Judgement calls Fahim may want to revisit: the hover-border `#444444`, placeholders at `#5C615E`, and the hero ticker band being `#222222` (a visibly lighter strip than the page).
- Verified: `npx tsc --noEmit` clean after each commit; Tailwind CLI compile contains the new utilities and none of the old hex values; grep finds no old neutral left in `app/`, `components/` (emails excepted). NOT verified in a browser: contrast and overall feel, especially cards (`#222222` on `#111111`), the gray glow strength, and the portrait against the lighter page.

### 2026-10-08 (face-reveal, alignment + glow colour): branch `face-reveal`
- Agent: claude-sonnet (chat)
- Feedback (Fahim, screenshot with two red lines): the head sat at the lower line (y about 173 at 1361px wide), he wants it at the upper line (about y 125-135, level with the top of "Build"). Also: change the mint glow to light gray.
- Why my earlier alignment was 34px low: I estimated the headline block height as h1 + `mb-8` (32) + sub row `mt-12` (48) = 80px between them, but adjacent sibling margins collapse, so the gap is 48px, not 80. That made the wrapper shorter than I assumed, so the `0.31 x font-size` offset I derived from the first screenshot was measured against the wrong wrapper top. The aspect-ratio width derivation itself was fine (it matched the rendered width). Fix: measured from the second screenshot instead: wrapper top at about y 131, "Build" glyph top at about y 140, so `top` is now `-0.04 x font-size` (head top about y 130). Portrait grows to about 535px high at 1361px wide (was 490). Horizontal `right` moved 11.5% to 10.5% so the centre stays where it was while the figure gets wider.
- Glow: the ambient glow is the site-wide fixed `components/MintGlow.tsx` (not hero-only), so every page changes. Colour is now one constant, `GLOW_RGB = '214, 220, 216'` (light gray), alphas lowered a little (0.07/0.025/0.04 became 0.06/0.02/0.03) because light gray reads brighter than mint at the same alpha. To revert to mint: `'61, 244, 154'`. The component is still called MintGlow; renaming it was left out to avoid churn.
- Not changed: the accent colour `#3DF49A` itself, `.border-glow`, and `DESIGN_GUIDE.md` "Accent Glow" (a separate CSS utility) are still mint.
- Verified: `npx tsc --noEmit` clean after each commit. NOT verified in a browser: head-to-"Build" alignment, and whether the gray glow is too strong/weak.

### 2026-10-08 (face-reveal, placement): portrait moved to the drawn spot, hero buttons hidden, branch `face-reveal`
- Agent: claude-sonnet (chat)
- Request (Fahim, with a screenshot drawn over in red): put the portrait in the marked area; he does not know what to do with the buttons, hide them for now and unhide them when he says so.
- Reading of the drawing (an interpretation, not a measurement): top aligned with the top of "Build", and the figure in the column between the two vertical lines (about x 812 to 1115 at 1366px wide), bottom still on the stats rule. So the portrait moved left, away from the right edge, and grew slightly in height (about 527px at 1366px, was 519px).
- Done: `HeroPortrait.tsx` now sets `top` from the h1 font size (0.31 x, measured from the screenshot: cap top y=145 vs line-box top y=103 at a 136.6px font), `bottom-[-4rem]`, `right-[11.5%]`, `aspect-[571/907]` for the width, and the img fills it (`object-contain object-bottom`). If the head sits a few px high or low against "Build", adjust the 0.31.
- Hero buttons: `const SHOW_HERO_CTAS = false` at the top of `app/page.tsx` wraps the buttons div. TO UNHIDE: set it to `true`. The buttons' JSX, delays and styles are untouched. While hidden, the homepage has no direct "contact" link above the fold (the nav still has Contact).
- Verified: `npx tsc --noEmit` clean; Tailwind CLI generates the new arbitrary classes. NOT verified in a browser: the `aspect-ratio` width derivation from a `top`+`bottom` absolute box (supported in current browsers, but check the figure is not stretched or offset at 1366, 1024 and 768 widths), and the head alignment with "Build".

### 2026-10-08 (face-reveal, revision): natural scale, no added glow, branch `face-reveal`
- Agent: claude-sonnet (chat)
- Feedback (Fahim): the photo feels zoomed, keep it normal; use the glow that existed before.
- Changes: (1) Removed the mint radial glow I had added behind the head and the bottom `mask-image`; the page's existing `MintGlow` is the only glow now. (2) Re-exported the asset as the FULL figure (571x907, 32 KB) instead of the head-and-chest crop, and shrank it: `clamp(320px, 38vw, 540px)` high, so the head is about two thirds of its previous size. (3) Because the photo is cut off at the waist, the cut now sits exactly on the stats rule so he stands on the line instead of fading out: the headline + intro row is wrapped in a new `relative` div (re-indented), the portrait is anchored to its bottom and pushed down `4rem` to match the `mt-16` above the rule. If either value changes, change both.
- Known trade-off: the "Let's talk" / "About me" buttons now sit over the lower part of the jacket and hands. They are above the portrait in the stacking order, so they stay clickable and readable (the filled mint button especially), but check it looks acceptable. Option if not: move the buttons next to the intro text.
- Not done: nothing below `sm` (phones); no `srcset`.
- Verified: `npx tsc --noEmit` clean; a Python mock at 1366x768 (no site glow in it) showed the proportions. NOT verified in a browser.

### 2026-10-08 (face-reveal): hero portrait, branch `face-reveal` (off `motion-polish`)
- Agent: claude-sonnet (chat)
- Request (Fahim): create a new branch `face-reveal` and try his photo (transparent B&W cutout, uploaded) in the empty right side of the homepage hero.
- Branch: `face-reveal` was cut from `motion-polish`, not `main`, because the hero uses `.blur-load` and the arrival gate that only exist there. A PR for `face-reveal` therefore also contains the unmerged motion commits: merge `motion-polish` first, or target it.
- Asset: the upload already had real transparency (70% of pixels alpha 0). Cropped to the subject (head to upper chest/arms, 571x629) and saved as `public/images/fahim-hero.webp`, quality 88 with alpha: 25 KB vs 245 KB for the PNG. Source resolution is the limit: it is slightly soft on 2x screens.
- Component: `components/HeroPortrait.tsx` (see DESIGN_GUIDE "Hero portrait"). `app/page.tsx`: hero container gets `relative` and renders `<HeroPortrait />` first. Plain `<img>` because the repo does not use `next/image` anywhere (Vercel + Cloudflare dual deploy).
- Design reasoning: a small circle would look like a sticker next to 9rem type, so it is a large cutout; the jacket is near-black on a near-black page, so a mint radial glow behind the head provides the silhouette and a bottom mask dissolves the torso before the CTA buttons.
- Not done: nothing is shown below `sm` (phones); a mobile placement is undecided. No `srcset`/second size.
- Verified: `npx tsc --noEmit` clean; Tailwind CLI generates the arbitrary classes used; an approximate mock rendered in Python (not a browser) looked right at 1366x768. NOT verified in a browser: check overlap with the headline at 1024 and 768 widths, the CTA buttons over the faded torso, and that the glow does not look like a hard disc.

### 2026-10-08 (projects page + dashboard): `type` removed everywhere, branch `motion-polish`
- Agent: claude-sonnet (chat)
- Request (Fahim, answering "remove the Types stat and the `type` field from the dashboard, with or without the DB column?"): "yes, remove". Read as all of it, including the column, following the 2026-10 credentials-timeline cleanup precedent (schema edit, `drizzle-kit generate`, Neon SQL given separately and run by hand).
- Commits: (1) `/projects` hero: "Types" stat removed, stats row is now three columns (`grid-cols-3`, so no orphan on mobile). (2) `type` removed from `/admin/projects` (form field, list badge, JSON import normalisation, JSON help panel and its example), from `lib/db/schema.ts`, and `drizzle/0011_remove_project_type.sql` generated (`ALTER TABLE "projects" DROP COLUMN "type";`) with its snapshot and journal entry. Tags field now sits full width in the form. `PLANNER.md` schema and form-field lines updated.
- NOT applied to the database. The migration is not run by the build (`db:migrate` is manual), so nothing changes in Neon until Fahim runs SQL. ORDER MATTERS, because Vercel previews and production share one database:
  1. Now, before using the dashboard on the preview: `ALTER TABLE projects ALTER COLUMN type DROP NOT NULL;` (safe for both the old and new code; without it, creating a project from the new code fails because `type` is NOT NULL with no default).
  2. Only AFTER this branch is merged and production has redeployed: `ALTER TABLE projects DROP COLUMN type;` (irreversible). Doing it earlier breaks production, whose code still reads the column.
- Left alone: `components/ProjectsSection.tsx` has its own hardcoded demo data with a `type` field and is not imported anywhere (dead code, not connected to the database). Old exports/backups still containing `type` are harmless: the JSON import ignores unknown keys.
- Verified: `npx tsc --noEmit` clean after each commit; drizzle-kit generated exactly one statement. NOT verified in a browser or against the database: after SQL step 1, create and edit a project on the preview, and run a JSON import.

### 2026-10-08 (projects page): "By Type" section removed, dashboard connection checked, branch `motion-polish`
- Agent: claude-sonnet (chat)
- Request (Fahim): on `/projects` remove everything after "By Type", along with it; check whether anything removed so far was also connected to the dashboard and, if so, remove it there too.
- Done: deleted the "By Type" section (heading plus the per-type groups of `ProjectCard` grids). Nothing was left after it (the Technologies section went in the previous change). `/projects` is now: hero (title, lead, stats, technologies ticker) and the all-projects grid. `public/llms.txt` described the page as "filtered by type"; reworded so the AEO summary matches the page.
- Dashboard check (grepped `app/admin`, `lib`, `components`, `app/api`, and the repo for both section names): neither removed section had any dashboard control, setting or table. Their headings and intro text were hardcoded in `app/projects/page.tsx`; their content was computed from each project's `tags` and `type`.
  - `tags`: still fully live (card chips, the Technologies stat, the hero ticker). Nothing to remove.
  - `type`: after this change it only feeds the "Types" stat in the hero, the small type badge in `/admin/projects`, the admin form field, JSON import and the `type` column (NOT NULL, no default). It is the one thing that became close to dead. NOT removed yet: removing the field while keeping the "Types" stat would leave a stale number, so removing it means removing that stat too, and removing the column means a drizzle migration plus Neon SQL (as in the 2026-10 credentials-timeline cleanup). Waiting on Fahim's call.
- Verified: `npx tsc --noEmit` clean. NOT verified in a browser.

### 2026-10-08 (projects page): technologies ticker in the hero, Technologies section removed, branch `motion-polish`
- Agent: claude-sonnet (chat)
- Request (Fahim, with a screenshot of the `/projects` preview): remove the Technologies section on `/projects` and put a marquee of technologies in the hero, just below the numbers.
- Done: deleted the "Technologies" chip-grid section (below "By Type"). New `components/TechMarquee.tsx` (server component): list doubled for a seamless loop, track is `w-max`, second copy `aria-hidden`, edge fade via `mask-image`, hover pause, duration scales with item count. It sits inside the hero section directly under the stats grid, `blur-load` entrance, bottom border so stats and ticker read as one band. Items are the unique project tags, most used first then alphabetical (the removed section was alphabetical).
- Kept on purpose: the "Technologies" stat number in the hero (he only asked to remove the section). Say so if the stat should go too.
- Noticed, not changed: the homepage ticker (`app/page.tsx`) has no `w-max` on its track, so `translateX(-50%)` is half the container width, not half the content width, and the loop probably jumps at the seam. Fix is adding `w-max` to that div (and swapping in `TechMarquee` would remove the duplication).
- Verified: `npx tsc --noEmit` clean; Tailwind CLI generates `w-max`, the mask utility and `animate-marquee`. NOT verified in a browser: check the ticker speed, the edge fade, the loop seam and the hover pause on the preview, plus how the hero looks with the section removed on mobile.

### 2026-10-08 (motion pass, fix): hero entrance missed after clicking a nav link from the bottom of a page, branch `motion-polish`
- Agent: claude-sonnet (chat)
- Report (Fahim): after scrolling to the bottom of a page and clicking a nav link, the page scrolls up on its own (wanted) but the hero entrance is missed. He asked for the animation to start once the scroll reaches the top, and chose to keep the smooth scroll-up.
- Cause (read from code and the Next source, not reproduced in a browser): `html` has `scroll-behavior: smooth` and no `data-scroll-behavior="smooth"` attribute. In Next 16.2.6, `disableSmoothScrollDuringRouteTransition` only forces an instant scroll when that attribute is present, so the route-change scroll-to-top is smooth. The hero entrance (`.blur-load`, `BlurWords mode="load"`) is timer-based and starts at mount, so it finished before the scroll arrived.
- Fix: `app/template.tsx` (client) runs a layout effect: if the page mounts with `scrollY > 24`, it sets `data-await-top` on the wrapper before first paint; CSS pauses the hero entrance while that attribute is present (`globals.css`); a passive scroll listener releases it at `scrollY <= 24`, with a 2s safety timeout for manual scrolling, `#anchor` navigation or a stalled scroll. At the top on mount nothing is gated, so first paint and no-JS visitors are unaffected. Not gated: the 180ms route fade and scroll-triggered reveals (they fire when in view).
- Alternative not taken: `data-scroll-behavior="smooth"` on `<html>` would make route changes jump instantly (one attribute) but removes the smooth scroll-up he likes. Still available if the gate ever misbehaves.
- Verified: `npx tsc --noEmit` clean. NOT verified in a browser: check on the preview from the bottom of `/credentials` (long page) and from a short page, plus a reload mid-page.

### 2026-10-08 (motion pass, fix): navbar lost its background blur, branch `motion-polish`
- Agent: claude-sonnet (chat)
- Report (Fahim): the navbar lost its background blur. `backdrop-blur-md` is still on the pill, so the cause is an ancestor. My `app/template.tsx` wrapped every page, navbar included, in a `div` animating opacity with `both` fill (it stays applied after the fade). An element with an opacity animation becomes a backdrop root, which restricts what a descendant's `backdrop-filter` can see, and Chromium keeps that state while the animation fills forward.
- Fix: the fade now targets `.route-enter > main` and `.route-enter > footer` (every public page renders Navbar, `<main>`, Footer as siblings), the wrapper itself no longer animates, and the keyframes are `from`-only with `backwards` fill.
- Rule to keep: never put an opacity, filter, mask or transform animation on an ancestor of the navbar.
- Verified: `npx tsc --noEmit` clean. NOT verified in a browser (none available here): confirm on the preview that the pill blurs the hero and cards behind it on first load and after navigating between pages.

### 2026-10-08 (motion pass, follow-up): slower reveals and per-card reveals, same branch `motion-polish`
- Agent: claude-sonnet (chat)
- Request (Fahim): the reveal is too fast, make it a bit slower, and give the cards the same blur reveal.
- Slower (commit "Slow the blur reveal"): block reveal 600ms to 900ms, per-word 550ms to 800ms, word stagger 45ms to 70ms, `.blur-stagger` steps 70ms to 110ms (cap 420ms to 660ms), hero delays 220/320/420ms to 340/480/620ms, h1 line delays 90/180ms to 140/280ms, inner-page lead text 140ms to 220ms. All of it is CSS variables or the numeric `delay` props, so it is a one-line retime if it still feels off.
- Bug found while adding cards, fixed in its own commit: the reveal keyframes used `to { opacity: 1 }` with `both` fill, which pinned `opacity: 1` after the animation and would have overridden the dimmed foundational certs (`opacity-50 hover:opacity-70`) on `/credentials`. Keyframes are now `from`-only with `backwards` fill and the hidden state is dropped via `:not([data-revealed='true'])`, so the end state is always the element's own style. Do not change the fill back to `both`.
- Cards (commit "Cards reveal one by one"): `ProjectCard` (home + both grids on `/projects`) and the home blog teaser cards keep their cell (background, 1px grid lines, hover) and blur only their content in, per card, as each scrolls into view; cards in the same row stagger by 180ms (`index` prop on `ProjectCard`). Removed the grid-level `Reveal` wrappers from those two homepage grids (a hidden wrapper would have hidden the cards too). `/blog` list: each card wrapped in its own `Reveal` (col-span moved to the wrapper, `h-full` on the `Link`), `--blur-from: 3px` because of the large cover images. `/credentials`: cert, community and contribution grids use `.blur-stagger`.
- Skipped on purpose: the credentials timeline (vertical, continuous, per-item reveal would fight the line) and the skills cards (already revealed individually).
- Docs: DESIGN_GUIDE.md section 8 (new durations, fill-mode warning, the three card patterns), PLANNER.md timeline row.
- Verified: `npx tsc --noEmit` clean after each commit; Tailwind CLI compile confirms the new hidden/revealed selectors. NOT verified: `npm run build` (no Google Fonts egress here), browser, real feel of the new timings.

### 2026-10-08 (motion pass): blur-fade reveals and microinteractions, branch `motion-polish`
- Agent: claude-sonnet (chat)
- Request (Fahim): add motion/animation to the site, audit first, approve, then implement in small commits. Fahim's own direction: he loves scroll-triggered faded-blur reveals (seen in motion-primitives' Text Effect "speed" demo) and asked for it to be applied his own way, not by importing that library. Approved the suggested cut (items 1-6, 8, 10); skipped card hover polish, skeleton `loading.tsx` and the beta popup animation.
- Audit findings that drove the work: `framer-motion` installed but imported nowhere; `animate-fade-up`/`fade-in` defined but unused; no `prefers-reduced-motion` handling; no `loading.tsx`/`error.tsx`/`template.tsx`; 19 `transition-all` uses; no hero entrance; mobile menu links set `animationDelay` with no animation class (dead stagger); inputs removed the outline and only changed border colour.
- Decision: CSS-only, no `framer-motion` (about 17 KB gzipped saved by my estimate, not measured). `Navbar`/`Footer` stay per-page (moving them into the layout is a structural change outside a motion pass).
- Commits, one concern each, `npx tsc --noEmit` clean after every one:
  1. Foundation: `--ease-out`/`--ease-in-out` tokens (+ `ease-ui-out`/`ease-ui-in-out` in `tailwind.config.ts`), global reduced-motion guard, MintGlow parallax skips under reduced motion, `transition-all` replaced with explicit properties on every public page and component (Navbar done in its own commit), marquee pauses on hover.
  2. Blur reveal primitives: `components/Reveal.tsx` (client, one IntersectionObserver, sets `data-revealed` on the DOM node, plays once), `components/BlurWords.tsx` (per-word, `mode` load/scroll, `delay`/`stagger`/`duration` knobs), CSS in `globals.css`. Hero h1 words plus sub text, CTAs and stats enter in pure CSS (no wait for hydration, h1 first line has no delay so first paint is not held back).
  3. Homepage section headings blur in per word on scroll; teaser paragraphs, code card, skills list (`.blur-stagger`) and the two `gap-px` grids (as one block) reveal on scroll. Inner pages (`/about`, `/projects`, `/blog`, `/contact`, `/credentials`): h1 per-word on load, lead paragraph `.blur-load`, below-the-fold h2s on scroll. About/contact h1 used `<br />` plus an accent `<span>`; now two `block` BlurWords lines (same layout).
  4. Buttons: `active:scale-[0.97]` press everywhere, hover grow (`hover:scale-105`, `scale-[1.01]`) removed.
  5. Focus: global mint `:focus-visible` outline for links/buttons; contact inputs get a soft 3px mint ring (they already removed the outline).
  6. Navbar: passive scroll listener and initial state on mount, outer nav no longer transitions, underline slides in on hover (stays on for the active page), mobile menu links now really stagger (opacity + rise + blur via `transitionDelay`, immediate on close), closed menu is `invisible` (links leave the tab order), Esc closes, body scroll locked while open, `aria-expanded`/`aria-controls`/state-aware label.
  7. `app/template.tsx`: 180ms enter-only opacity fade on every navigation (skipped on `/admin`). Enter-only because the App Router unmounts the old page first; an exit animation would need a router-freezing hack.
  8. Contact form: `Loader2` spinner while sending, success circle pops and the check draws (`pathLength` stroke animation), error message eases in and now has `role="alert"`.
- Gotchas worth remembering: the hidden state for reveals is only applied under `@media (scripting: enabled)`, so no-JS visitors see everything. Reveals end on `filter: none` / `transform: none` so no stacking context is left behind. `.blur-stagger` must not wrap a `gap-px` grid (the grid colour shows through hidden cells), which is why the projects and blog teaser grids reveal as one block.
- Docs: DESIGN_GUIDE.md section 8 rewritten (principles, tokens, blur reveal, other motion), button/navbar snippets updated, changelog row added. PLANNER.md: architecture tree, timeline row, next steps.
- Verified: `npx tsc --noEmit` clean at baseline and after each commit. Tailwind CLI compile confirmed the new utilities are generated (`ease-ui-out`, `active:scale-[0.97]`, the arbitrary `transition-[...]` lists, `blur-[6px]`, `scale-x-100`).
- NOT verified: `npm run build` fails in the sandbox on `next/font` (Google Fonts unreachable), the known limitation noted under Security/Gotchas. No browser test, no Lighthouse run, no real bundle-size measurement, no ESLint (the repo has no ESLint config). Needs a Vercel preview check, see the test checklist in the PR.
- Open follow-ups: skeleton `loading.tsx` (each skeleton would need its own Navbar since pages render it themselves), beta popup in `ProjectsSection` may be dead code since the status badges were removed, `framer-motion` can be removed from `package.json` if the CSS-only approach stays.

### 2026-10-06 (homepage teaser editable from dashboard)
- Agent: claude-sonnet (chat)
- Request (Fahim): "make editable" for the homepage block left hardcoded in the previous entry ("Design can't be separated from engineering", the two paragraphs, "Full story" link and the code-style card).
- Extended `about_content` with 9 columns: `home_heading`, `home_paragraph_one`, `home_paragraph_two`, `home_link_label`, `home_card_role`, and four `text[]` lists (`home_card_description`, `home_card_stack`, `home_card_availability`, `home_card_obsessions`). Defaults equal the previous hardcoded copy. New migration `drizzle/0010_about_homepage_teaser.sql` (+ snapshot); `0009` was left untouched because it was already pushed.
- `app/page.tsx` now reads `getCachedAboutContent()` in its existing `Promise.all`; a small `quoteList()` helper renders the card lists as `'a', 'b'`. The card keys (`role`, `description`, ...), brackets, and the `/about` link stay in code.
- `/admin/about` gained a "Homepage teaser" section above the About page fields. Card lists are comma-separated inputs (max 8 items, 40 chars each, parsed client-side and re-validated in `saveAboutContentAction`). The save action now also revalidates `/`.
- MUST DO: run BOTH `0009` and `0010` (`npx drizzle-kit migrate`, back up first). If only `0009` is applied, `select *` hits missing columns, the catch returns the defaults, and saving errors, so the dashboard looks inert.
- Verified: `npx tsc --noEmit` clean. Not run: `npm run build`, browser test.

### 2026-10-06 (about page editable from dashboard)
- Agent: claude-sonnet (chat)
- Request (Fahim): make the About section texts editable from the dashboard. Interpreted as the `/about` page (header, story, call to action). The homepage "Design can't be separated from engineering" block is NOT included; it is still hardcoded in `app/page.tsx`.
- New `about_content` table (single row, `id=1`): `headline_top`, `headline_accent`, `intro`, `story_heading`, `story_paragraphs text[]`, `cta_heading`, `cta_text`, `cta_primary_label`, `cta_secondary_label`, `updated_at`. Column defaults equal the previous hardcoded copy, with the three em dashes replaced (colon, comma) to match the dash cleanup. Migration `drizzle/0009_about_content.sql` plus `0009_snapshot.json`, generated cleanly (only the new table).
- `lib/db/queries.ts`: `DEFAULT_ABOUT_CONTENT`, `getAboutContent()` (uncached, creates the row on first read, falls back to defaults on any error), `getCachedAboutContent()` (1h `unstable_cache`, tag `about-content`), `updateAboutContent()`.
- `app/about/page.tsx` is now an async server component rendering from `getCachedAboutContent()`. The "About" eyebrow label and the button links (`/contact`, the design portfolio) stay in code.
- New admin route `/admin/about` (`page.tsx` + `AboutForm.tsx`), sidebar entry "About". Story paragraphs are one textarea, blank line between paragraphs, max 12.
- `saveAboutContentAction` in `app/admin/actions.ts` checks `isAuthenticated()` itself (unlike `saveSiteSettingsAction`, which relies on the page gate), validates and length-caps each field, and copies known fields only. Revalidates tag `about-content`, `/about`, `/admin/about`.
- MUST DO before the dashboard works: run `npx drizzle-kit migrate` against Neon (back up first with `npx tsx scripts/export-backup.ts`). Until then `/about` renders the defaults and the admin form loads but saving errors.
- Verified: `npx tsc --noEmit` clean. Not run: `npm run build` (needs Neon and Google Fonts egress), no browser test. The repo has no ESLint config, so lint was skipped.

### 2026-10-06 (homepage review fixes): copy fixes in code, remaining ones are DB-side
- Agent: claude-sonnet (chat)
- Source: an external review of the live homepage, checked against the repo before editing. Branch `small-fixes` fast-forwarded to `main`, then `app/page.tsx` only.
- Hero: "Fahim  - an Aspiring AI Engineer. I build better and secure web architecture." became "Fahim, an Aspiring AI Engineer. I build better, more secure web architecture." Comma instead of the review's suggested " - " because spaced hyphens fall under the dash cleanup; the old line also produced a double space.
- Home about teaser: "the way I design — with intention" became "the way I design, with intention" (em dash out).
- Contact CTA: added the missing period after "AI era" (the review wrongly put it after "harder") and fixed "nowdays" to "nowadays".
- NOT fixable from code, still live and must be done in the dashboard: (1) `/admin/settings` keywords still contain "most handsome man in bangladesh" (the code defaults in `lib/db/queries.ts` are clean; the live value is the DB row); delete the whole keywords tag content if wanted, since Google ignores it. (2) `/admin/projects` Bindu description "better then NGL" should read "better than NGL". (3) `/admin/skills` "Web products" description "CMS,E-commerce" needs a space after the comma.
- Deliberately not done: no project cards added (Fahim's call), D-SHASTHO "my role" line skipped until Fahim supplies a true one-sentence contribution.
- Open: head metadata showed no og:image / twitter:image on the homepage despite `summary_large_image`; verify in view-source or a share debugger. The CTA button label rendered as "Start conversationStart a conversation" in a text scrape; check it is a hover-swap or sr-only span and not a double render.
- Not run: `npx tsc --noEmit` / `npm run build` (string-only edits; Vercel build is the check).

### 2026-10-03 (about page): removed "Tools & stack" too
- Agent: claude-sonnet (chat)
- Deleted the "Tools & stack" section from `app/about/page.tsx` (Design/Frontend/Backend/DevOps 4-column breakdown, inline data, no DB). Same page as last entry -- About is down to header, "The honest story", and the closing CTA now.

### 2026-10-03 (about page): removed "What I believe" and "How I got here"
- Agent: claude-sonnet (chat)
- Deleted both sections from `app/about/page.tsx` wholesale: the Values block ("What I believe", a 2-column grid partner to "The honest story") and the whole Timeline section ("How I got here", the 2019-2024+ history with the vertical line/dots). Removed their now-unused `values` and `timeline` data arrays too.
- "The honest story" survives on its own, no longer paired in a 2-column grid -- changed that grid to a single `max-w-2xl` column so the remaining text isn't stretched full-width.
- This page is fully static (no DB query, no admin page) -- nothing to clean up on the dashboard side, unlike the skills/projects/credentials removals earlier this conversation.

### 2026-10-03 (projects page): status badges removed entirely, including from DB
- Agent: claude-sonnet (chat)
- Per screenshot, phrased as "gone for good": removed the LIVE/BETA/DEPRECATED/FUNDING pills shown on each project card, and -- unlike the credentials-timeline cleanup earlier, where unused columns were deliberately left in place -- this time dropped the underlying `status_badges` column from `projects` outright, since the instruction was for a permanent removal this time, not a soft deprecation.
- Flagged before removing, since it wasn't purely decorative: `statusBadges` also gated a "this project is in beta, might be unstable" warning modal before opening a beta project's Live link (`BetaModal` in the old `ProjectCard.tsx`). That whole interaction is gone with the column -- Live links now always open directly. `ProjectCard.tsx` lost its `'use client'` directive too, since nothing in it needs client-side state anymore.
- Swept the whole codebase for every reference, not just the obvious ones: the admin form's toggle buttons and list-view pills (`/admin/projects`'s `ProjectsManager.tsx`), the bulk-JSON import's parsing/validation and its example/doc text (`JsonHelpPanel.tsx`), and two sanitize helpers in `app/admin/actions.ts` (`sanitizeStatusBadges`, the `ALLOWED_BADGES` list) used by both the single-project and bulk-upsert actions.
- `drizzle-kit generate` run immediately after the schema edit. Neon SQL (`DROP COLUMN`) provided separately, marked irreversible.

### 2026-10-03 (projects page): remove per-card type eyebrow
- Agent: claude-sonnet (chat)
- Per screenshot: removed the small uppercase `{project.type}` label (TOOL/WEB/EDUCATION) that sat above each project card's title, in `components/ProjectCard.tsx`. Since ProjectCard is shared, this clears it from both the main grid and the "By Type" breakdown section further down `/projects` in one place -- "the whole page" as asked.
- Did NOT remove the `type` field from `/admin/projects` or the DB column: unlike the credentials-timeline cleanup, this one isn't fully dead. It still drives the "Types" count stat at the top of `/projects` and the "By Type" grouped section (real `h3` headings, not eyebrows) further down the same page -- neither of which was part of what Fahim circled. Left the admin list view's own small type badge alone too (a pill, not the same bare eyebrow pattern, and still an accurate reflection of a live field).

### 2026-10-03 (skills section): real row/column layout switch, not just image-side
- Agent: claude-sonnet (chat)
- Misread Fahim's earlier sketch as "rows, with per-skill left/right image toggle." What he actually wanted was two complete arrangements (full-width rows, and a card grid with a centered icon) with a dashboard switch between them — should have asked when the sketch was ambiguous between those two readings instead of guessing.
- Built it properly this time: new `skillsLayout` column (`'rows' | 'columns'`, default `'rows'`) on `site_settings` (a site-wide switch, not per-skill), with a toggle at the top of `/admin/skills`. `app/page.tsx` renders one of two complete JSX blocks for the "What I do" section depending on this setting.
- Columns mode: unified card (one background/border, no split), icon centered above left-aligned title/desc, grid up to 3 across on desktop — matches Fahim's reference screenshot of his own already-uploaded icons. Rows mode carries over from last session, per-skill `imagePosition`. `imagePosition` is stored regardless of which layout is active, but only has a visible effect in rows mode — the admin form now says so.
- `drizzle-kit generate` run immediately after the schema edit, before committing. Neon SQL provided separately for the live DB.
- Correction, same day: the rows split was 50/50, not matching the sketch — re-checked it and the actual ratio is closer to 40% image / 60% text. Changed `md:w-1/2`/`md:w-1/2` to `md:w-2/5`/`md:w-3/5`.

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
