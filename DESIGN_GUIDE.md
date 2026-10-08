# DESIGN_GUIDE.md — Mahtamun Personal Website

> **Rule:** Update this file every time you change a color, token, component pattern, or layout convention.
> It is the single source of truth for the visual system.

---

## 1. Brand Identity

**Site name:** `Mahtamun`  
**Tagline:** Designing the gap between beauty and function.  
**Tone:** Direct, minimal, confident. No buzzwords. No fluff.  
**Audience:** Potential clients, collaborators, employers — people who value craft.

---

## 2. Color System

All colors are defined as CSS variables in `app/globals.css` and extended into `tailwind.config.ts`.

### CSS Variables

```css
/* app/globals.css */
:root {
  --accent:     #3DF49A;   /* primary green — CTAs, active states, highlights */
  --accent-dim: #5BFBA8;   /* hover/pressed state for accent */
  --bg:         #070807;   /* page background */
  --surface:    #0F0F0F;   /* card / panel background */
  --border:     #1F2421;   /* default border color */
  --text:       #F3F6F4;   /* primary text — warm white, not pure #fff */
  --muted:      #8A938E;   /* secondary / supporting text */
}
```

### Named Palette (reference)

| Token          | Hex       | Usage                                              |
|----------------|-----------|----------------------------------------------------|
| `--accent`     | `#3DF49A` | CTAs, active nav underline, icons, eyebrow labels  |
| `--accent-dim` | `#5BFBA8` | Accent hover / pressed states                      |
| `--bg`         | `#070807` | Body background                                    |
| `--surface`    | `#0F0F0F` | Cards, code blocks, admin panels                   |
| `--border`     | `#1F2421` | All borders, dividers, grid lines                  |
| `--text`       | `#F3F6F4` | Primary readable text                              |
| `--muted`      | `#8A938E` | Secondary text, meta info, placeholders            |
| `#2B302D`      | —         | Ghost/faded numbers (post index, inactive states)  |
| `#090A09`      | —         | Hover bg on list rows (slightly off `--bg`)        |
| `#C7CCCA`      | —         | Body copy inside `prose-dark` blog content         |

### Convention: Hardcoded Hex Over Mapped Tokens

This codebase consistently uses hardcoded hex literals (`bg-[#3DF49A]`) for one-off color usage rather than the mapped Tailwind tokens (`bg-accent`). Both work — Tailwind's JIT scans for the literal class string in source and generates valid CSS either way — this is purely an established convention for this project, not a technical limitation.

```tsx
// Established convention in this codebase
<p className="text-[#3DF49A]">Hello</p>

// Also valid, but inconsistent with the rest of the codebase
<p className="text-accent">Hello</p>

// Also valid for one-offs tied to a CSS custom property directly
<p style={{ color: 'var(--accent)' }}>Hello</p>
```

The Tailwind color extensions (`accent`, `surface`, etc.) in `tailwind.config.ts` exist for documentation/reference and for any future component that wants to opt into the mapped tokens.

---

## 3. Typography

> **Branch note (`design/syne-title-variant`):** this branch is a side-by-side comparison — display/heading role uses **Syne** (matching `main`) instead of Clash Display below, via `--font-clash` in `app/globals.css` repointed to `var(--font-syne)`. Everything else in this doc (palette, body font, component patterns) is unchanged from `blog/tags-bottom-placement`. Not the source of truth if this branch doesn't get merged — written from the Clash Display branch's perspective.

### Font Stack

| Role        | Font               | CSS Variable            | Tailwind Class    | Weights Used      |
|-------------|--------------------|--------------------------|-------------------|-------------------|
| Display     | Clash Display      | `var(--font-clash)`     | `font-display`    | 400, 500, 600, 700|
| Body        | Plus Jakarta Sans  | `var(--font-jakarta)`   | `font-body`       | 400–800           |
| Monospace   | JetBrains Mono     | `var(--font-jetbrains)` | `font-mono`       | 400, 500          |

Plus Jakarta Sans and JetBrains Mono load via `next/font/google` in `app/layout.tsx` (self-hosted, zero layout shift). **Clash Display is not on Google Fonts** — it's an Indian Type Foundry / Fontshare release, loaded via a `<link>` to Fontshare's CDN in the `<head>` block of `app/layout.tsx`:

```tsx
<link rel="preconnect" href="https://api.fontshare.com" />
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" />
```

`--font-clash` in `app/globals.css` falls back to `var(--font-jakarta)` then `sans-serif` if the Fontshare request is slow or blocked. **Tradeoff to know about:** this is an external runtime request, not self-hosted like the other two fonts — slightly more FOUT risk and a dependency on Fontshare's uptime. If that ever becomes a problem, the fix is downloading the Clash Display files from fontshare.com (free license) and switching to `next/font/local`.

### Usage Patterns

```tsx
// Display heading (hero, section titles)
<h1 style={{ fontFamily: 'var(--font-clash)' }}>Design. Code. Create.</h1>

// Body copy
<p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 400 }}>...</p>

// Labels, tags, code snippets, meta info
<span style={{ fontFamily: "'JetBrains Mono', monospace" }}>// comment</span>
```

### Type Scale

| Element            | Size                          | Font    | Weight |
|--------------------|-------------------------------|---------|--------|
| Hero heading       | `clamp(3.5rem, 10vw, 9rem)`   | Clash Display | 700 |
| Page heading (H1)  | `clamp(2.5rem, 7vw, 6rem)`    | Clash Display | 700 |
| Section heading    | `text-4xl` – `text-6xl`       | Clash Display | 700 |
| Card heading       | `text-xl` – `text-2xl`        | Clash Display | 600–700|
| Body text          | `text-base` – `text-lg`       | Plus Jakarta Sans | 400 |
| Small / meta       | `text-xs` – `text-sm`         | Plus Jakarta Sans / JetBrains Mono | 400 |
| Eyebrow labels     | `text-xs`, tracking `0.2em+`  | JetBrains Mono | 400 |

### Eyebrow Label Pattern

Used before all major section headings:

```tsx
<p
  className="text-[#3DF49A] text-xs tracking-[0.2em] uppercase mb-6"
  style={{ fontFamily: "'JetBrains Mono', monospace" }}
>
  Section Name
</p>
```

---

## 4. Spacing & Layout

### Max Width

All content is constrained to `max-w-6xl` (`72rem`) centered with `mx-auto px-6`.

### Padding Conventions

| Context           | Value                    |
|-------------------|--------------------------|
| Page top (navbar) | `pt-32` (clears fixed nav)|
| Section vertical  | `py-16` – `py-28`         |
| Card inner        | `p-6` – `p-8`             |
| Border gaps       | `gap-px bg-[#1F2421]` (CSS grid trick for 1px dividers between cards) |

### Grid System

- **3-column service grid:** `grid-cols-1 md:grid-cols-3 gap-px bg-[#1F2421]` with `bg-[#070807]` children — creates seamless 1px separators
- **2-column content split:** `grid-cols-1 md:grid-cols-2 gap-16`
- **Blog list:** `space-y-0` with `border-b border-[#1F2421]` per row

---

## 5. Component Patterns

### Buttons

```tsx
// Primary CTA — filled accent, rounded-full
<button
  className="px-7 py-3 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-full
             hover:bg-[#5BFBA8] transition-[background-color,transform] duration-200 active:scale-[0.97]"
  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
>
  Let's talk
</button>

// Secondary — ghost border, rounded-full
<button
  className="px-7 py-3 border border-[#1F2421] text-[#F3F6F4] text-sm rounded-full
             hover:border-[#8A938E] transition-[border-color,color,transform] duration-200 active:scale-[0.97]"
  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
>
  About me
</button>

// Admin / small action — border, rounded-lg
<button
  className="text-xs px-3 py-1.5 border border-[#1F2421] rounded-lg text-[#8A938E]
             hover:text-[#3DF49A] hover:border-[#3DF49A] transition-colors"
  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
>
  Edit
</button>
```

### Cards / Surface Panels

```tsx
<div className="bg-[#0F0F0F] border border-[#1F2421] rounded-xl p-6 md:p-8">
  ...
</div>
```

Hover state on interactive cards: `hover:bg-[#090A09]` or `hover:border-[#2B302D]`.

### Status Badges

```tsx
// Published / active
<span className="text-xs px-2 py-0.5 bg-[#3DF49A]/10 text-[#3DF49A] border border-[#3DF49A]/20 rounded-full"
  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
  Published
</span>

// Draft / inactive
<span className="text-xs px-2 py-0.5 bg-[#2B302D] text-[#8A938E] border border-[#1F2421] rounded-full"
  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
  Draft
</span>
```

### Availability Pulse

```tsx
<div className="flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-[#3DF49A] animate-pulse" />
  <span className="text-[#3DF49A] text-xs tracking-[0.25em] uppercase"
    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
    Available for work
  </span>
</div>
```

### Accent Glow (radial background)

Used on hero and CTA sections:

```tsx
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    background: 'radial-gradient(ellipse at center bottom, rgba(61,244,154,0.07) 0%, transparent 70%)',
  }}
/>
```

### Code Aesthetic Block

Terminal-style card used in the homepage personality section:

```tsx
<div className="bg-[#0F0F0F] border border-[#1F2421] rounded-xl p-8"
  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
  {/* Traffic light dots */}
  <div className="flex gap-2 mb-6">
    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
  </div>
  ...
</div>
```

### Skills Ticker (Marquee)

```tsx
<div className="overflow-hidden border-y border-[#1F2421] py-4 bg-[#090A09]">
  <div className="flex gap-12 animate-marquee whitespace-nowrap">
    {ticker.map((skill, i) => (
      <span key={i} className="text-sm tracking-widest uppercase shrink-0"
        style={{ color: i % 3 === 0 ? '#3DF49A' : '#8A938E' }}>
        {skill}
        <span className="ml-12 text-[#1F2421]">◆</span>
      </span>
    ))}
  </div>
</div>
```

The `animate-marquee` keyframe runs `translateX(0% → -50%)` over 30s. Array must be doubled (`[...skills, ...skills]`) for seamless looping, and the track must be `w-max`: `translateX(-50%)` is half of the track's OWN width, so a track that is only as wide as its container loops at the wrong point.

`components/TechMarquee.tsx` is the reusable version (used on `/projects`, directly under the hero stats): it doubles the list itself, marks the second copy `aria-hidden`, fades both edges with a `mask-image`, pauses on hover, and scales `animationDuration` with the item count (2.5s per item) so the speed stays constant for long lists. Items on `/projects` are the unique project tags, most used first.

### Navbar

- Fixed, `z-50`, transparent by default
- On scroll (`window.scrollY > 40`): `bg-[#070807]/90 backdrop-blur-xl border-b border-[#1F2421]`
- Logo: `fahim` + `.` in `#3DF49A`
- Active link: `text-[#3DF49A]` + `1px` underline via absolute `<span>`; other links slide the same underline in from the left on hover (`scale-x-0` to `scale-x-100`, `origin-left`)
- Hidden on `/admin/*` routes
- Mobile: full-screen overlay. Links fade, rise and de-blur in with a staggered `transitionDelay` (80ms + 50ms per link); closing is immediate. The closed menu is `invisible` so its links leave the tab order. Esc closes it, body scroll is locked while open, and the button carries `aria-expanded`.

### Footer

- `border-t border-[#1F2421] mt-24 py-12 px-6`
- Three columns: logo + tagline | nav links | copyright year
- Year is dynamically rendered: `new Date().getFullYear()`

---

## 6. Global CSS Utilities

Defined in `app/globals.css` under `@layer utilities`:

| Class            | Effect                                               |
|------------------|------------------------------------------------------|
| `.text-balance`  | `text-wrap: balance` — even heading line lengths     |
| `.mask-fade-right` | Gradient mask fading content to the right          |
| `.border-glow`   | `box-shadow: 0 0 0 1px var(--accent), 0 0 20px rgba(61,244,154,0.1)` |

### Special Effects

- **Noise texture:** `body::before` — SVG fractalNoise, `opacity: 0.4`, `pointer-events: none`, `z-index: 9999`
- **Scrollbar:** 4px wide, accent-colored thumb, bg-colored track
- **Selection:** `background: var(--accent)`, `color: #06160E`

---

## 7. Blog — `prose-dark` Styles

Blog post content is rendered from Markdown via a custom `renderMarkdown()` function (`lib/markdown.ts`) — **no external library**. Styles live in `app/globals.css` under `.prose-dark`.

| Element      | Style                                                        |
|--------------|--------------------------------------------------------------|
| Headings     | Clash Display, 700, `var(--text)`, margins: `2rem` top / `0.75rem` bottom |
| Body `<p>`   | Plus Jakarta Sans, `#C7CCCA`, `1.25rem` bottom margin                   |
| `<a>`        | `var(--accent)`, underline, 3px offset                       |
| Inline `<code>` | `var(--surface)` bg, `var(--border)` border, accent text, JetBrains Mono |
| `<pre>`      | `var(--surface)` bg, 8px radius, scrollable overflow        |
| `<blockquote>` | 3px left border accent, italic, muted color               |
| `<img>`      | Full width, 8px radius, `var(--border)` border, `1.5rem` vertical margin |
| `<hr>`       | `var(--border)` top border                                   |

---

## 8. Animations

### Principles

- **CSS-first.** No animation library. `framer-motion` is installed but unused; adding it would cost bundle for no gain here.
- **Animate `opacity`, `transform` and (sparingly) `filter` only.** Never `transition-all`; list the properties (`transition-[background-color,transform]`).
- **Reveal once.** Scroll reveals play a single time per page view, then the observer is dropped.
- **Motion never delays reading.** Headings may reveal per word; paragraphs reveal as one block. Not used on blog post bodies, nav, footer, form fields or `/admin`.
- **Reduced motion is global.** `@media (prefers-reduced-motion: reduce)` in `globals.css` collapses every animation and transition to 0.01ms, so content simply appears. The MintGlow parallax skips itself.
- **Hidden states only exist under `@media (scripting: enabled)`**, so visitors without JS see all content.

### Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--ease-out` / `ease-ui-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | entrances, press feedback |
| `--ease-in-out` / `ease-ui-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | on-screen movement (hamburger bars) |

Durations: press 200ms, hover 150-300ms, route fade 180ms, block reveal 900ms, per-word reveal 800ms with a 70ms stagger between words. Hero delays: sub text 340ms, buttons 480ms, stats 620ms. Everything is driven by CSS variables (`--reveal-duration`, `--word-duration`, `--stagger`, `--reveal-delay`) with the defaults in `globals.css`, so retiming is a one-line change.

### Blur reveal (the signature effect)

Fade + 6px blur + 8px rise. The keyframes define only `from` and use `backwards` fill, so the end state is the element's normal style: no leftover blur layer or stacking context, and elements with their own opacity (dimmed cards) or hover styles keep working. Do not switch the fill to `both`/`forwards`: that pins `opacity: 1` and silently overrides those.

| Piece | What it does |
|-------|--------------|
| `components/BlurWords.tsx` | Per-word blur-in. `mode="load"` is pure CSS (above the fold, no wait for hydration); `mode="scroll"` waits for view. Knobs: `delay`, `stagger` (ms between words), `duration` (ms per word). |
| `components/Reveal.tsx` | Client wrapper, one IntersectionObserver, sets `data-revealed` once. Props: `as`, `delay`, `blurSelf={false}` for wrappers whose children animate. |
| `.blur-load` | CSS-only entrance for above-the-fold blocks; delay via `--reveal-delay`. |
| `.blur-stagger` | On a `Reveal` container of a small set of independent cards (skills, credentials grids): children reveal in turn (110ms steps, capped at 660ms). Observed once for the whole container, so do not use it on tall lists. |
| Card in a `gap-px` grid | The cell (background, 1px lines, hover) stays visible; wrap only the card CONTENT in `<Reveal>` so each card blurs in on its own as it scrolls into view (see `ProjectCard`, home blog teaser). Hiding the cell itself would show the grid colour through it. Stagger cards that share a row with `delay={(index % columns) * 180}`. |
| Tall list of bordered cards | Wrap each card in its own `<Reveal>` (see `/blog`); image cards use `--blur-from: 3px` to keep the reveal cheap. |

### Hero portrait

`components/HeroPortrait.tsx`, used once in the homepage hero. The full figure at natural proportions (`public/images/fahim-hero.webp`, transparent WebP, about 32 KB, cropped from the original), no zoom and no mask. It lives inside a `relative` wrapper around the headline and intro row, anchored to that wrapper's bottom-right and pushed down 4rem (`bottom-[-4rem]`) so it lands exactly on the stats rule below; that 4rem is the `mt-16` above the rule in `app/page.tsx`, so change one with the other. The photo is cut off at the waist and the cut sits on the rule, so he reads as standing on the line. No extra glow: the page's existing `MintGlow` is the only light behind him. Height `clamp(320px, 38vw, 540px)`, behind the headline (`-z-10`), hidden below `sm`. Enters with `.blur-load` (220ms delay, 1.2s, 4px blur), so the route arrival gate holds it too. Plain `<img>` with `fetchPriority="high"`, not `next/image` (the site does not use it). To change the photo, replace the WebP and update `width`/`height` in the component.

### Other motion

| Where | Behavior |
|-------|----------|
| Route change | `app/template.tsx`: 180ms opacity fade on enter, replayed every navigation, applied to `<main>` and `<footer>` only (never an ancestor of the navbar: an opacity animation on an ancestor kills the navbar's `backdrop-filter`). Enter-only (exit animations need a router-freezing hack). Skipped on `/admin`. |
| Arrival gate | The site uses `scroll-behavior: smooth`, so after a link click from far down a page Next scrolls to the top smoothly. If the new page mounts scrolled down, `app/template.tsx` sets `data-await-top`, which pauses the hero entrance (`.blur-load`, `BlurWords mode="load"`) until `scrollY` is within 24px of the top (2s safety timeout). At the top on mount nothing is gated, so first paint never waits for JS. Scroll-triggered reveals need no gate (they fire when in view). |
| Buttons | `active:scale-[0.97]` press. No hover grow. |
| Keyboard focus | `:focus-visible` mint outline (2px, 3px offset) on links and buttons; form fields use a soft 3px mint ring. |
| Contact form | Spinner while sending; success circle pops in and the check draws (`.pop-in`, `.check-draw`); error message eases in with `role="alert"`. |
| Skills ticker | Pauses on hover. |

### Tailwind keyframes (`tailwind.config.ts`)

| Name            | Keyframe                             | Duration   | Usage                    |
|-----------------|--------------------------------------|------------|--------------------------|
| `animate-fade-up`  | opacity 0→1, translateY 24px→0    | 0.6s ease  | Currently unused (superseded by blur reveal) |
| `animate-fade-in`  | opacity 0→1                       | 0.4s ease  | Currently unused         |
| `animate-marquee`  | translateX(0% → -50%)             | 30s linear | Skills ticker            |
| `animate-spin-slow` | Full rotation                    | 8s linear  | Reserved for future use  |
| `animate-pulse`    | Tailwind built-in                 | —          | Availability dot         |

---

## 9. Page Structure Reference

| Route                  | Runtime | Auth  | Data Source       |
|------------------------|---------|-------|-------------------|
| `/`                    | edge    | —     | Static            |
| `/about`               | edge    | —     | Static            |
| `/blog`                | edge    | —     | Supabase          |
| `/blog/[slug]`         | edge    | —     | Supabase          |
| `/contact`             | edge    | —     | Static (form is client component) |
| `/admin`               | edge    | Cookie | Supabase          |
| `/admin/login`         | edge    | —     | —                 |
| `/admin/posts`         | edge    | Cookie | Supabase          |
| `/admin/posts/new`     | edge    | Cookie | —                 |
| `/admin/posts/[id]`    | edge    | Cookie | Supabase          |
| `/admin/messages`      | edge    | Cookie | Supabase          |

All pages export `export const runtime = 'edge'` — required for Cloudflare Pages compatibility.

---

## 10. Supabase Schema

### `blog_posts`

| Column         | Type        | Notes                        |
|----------------|-------------|------------------------------|
| `id`           | uuid        | Auto-generated primary key   |
| `title`        | text        | Required                     |
| `slug`         | text        | Unique, auto-generated       |
| `excerpt`      | text        | Listing preview              |
| `content`      | text        | Raw Markdown                 |
| `cover_image`  | text        | Optional URL                 |
| `published`    | boolean     | false = draft, true = live   |
| `tags`         | text[]      | Array of strings             |
| `reading_time` | int         | Estimated minutes            |
| `created_at`   | timestamptz | Auto                         |
| `updated_at`   | timestamptz | Updated on edit              |

### `contact_messages`

| Column      | Type        | Notes                        |
|-------------|-------------|------------------------------|
| `id`        | uuid        | Auto-generated primary key   |
| `name`      | text        | From contact form            |
| `email`     | text        | From contact form            |
| `subject`   | text        | Selected category            |
| `message`   | text        | Message body                 |
| `read`      | boolean     | Toggled in admin dashboard   |
| `created_at`| timestamptz | Auto                         |

---

## 11. Environment Variables

```env
# Supabase — both are public/safe (anon key, not service key)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Admin dashboard — set a strong value before deploying
ADMIN_PASSWORD=your_secure_password

# Cloudflare Pages only — disables Next.js image optimization
CF_PAGES=1
```

---

## 12. Changelog

| Date       | Change                                                                 |
|------------|------------------------------------------------------------------------|
| 2025-01    | Initial design system established                                      |
| 2025-01    | `prose-dark` blog styles added                                         |
| 2025-01    | Noise texture overlay, custom scrollbar, selection styles added        |
| 2026-04-04 | Supabase client refactored for Edge safety — no singleton, Realtime disabled, `persistSession: false`. Fixes CF Pages blog crash. |
| 2026-04-04 | `DESIGN_GUIDE.md` created — consolidated design system documentation   |
| 2026-05-15 | Better Auth UI added — login, forgot password, reset password pages use existing design tokens (no new colors required) |
| 2026-06-29 | Full palette + typeface rebrand: adopted the academic-line system from `learnDE`'s `DESIGN_GUIDE.md` — accent green `#3DF49A`→mint, `#070807` bg, Plus Jakarta Sans replacing Syne + Onest (JetBrains Mono unchanged). Every hardcoded hex and font reference updated across `app/`, `components/`, `lib/email.ts`, and this file. Scoped to color tokens + typography only — component structure (button shapes, badge sizes, spacing scale) was left as this project's own, not migrated to match learnDE's dashboard-oriented patterns. |
| 2026-09-28 | `small-ui-fixes` branch (off `main`): "What I do" section moved from a hardcoded array to a `skills` table, CRUD-able from `/admin/skills`. Each skill has an optional thumbnail (Cloudinary, own `skill-<id>` public_id per skill). Section layout changed from a 3-column grid to a single-column list of rows: image beside text on desktop, image above text on phones. Thumbnail slot background (`#141712`) is a shade lighter than the page so transparent PNG uploads still read as a tile. |
| 2026-06-29 | Display font split back out from body: every heading/display element that was originally Syne (recovered from git history, not guessed) now uses Clash Display via Fontshare's CDN link; Plus Jakarta Sans stays for body/UI text. `--font-clash` added to `:root` with a Jakarta/sans-serif fallback chain. |
| 2026-10-08 | Motion pass (`motion-polish`): CSS-only blur-fade reveal system, motion tokens, global reduced-motion guard, route fade, button press and focus states, navbar menu and contact form state animations. Section 8 rewritten; button snippets no longer use `transition-all` or hover grow. |

> **Note:** Sections 9–11 (Page Structure, Supabase Schema, Environment Variables) predate the Neon/Drizzle/Better Auth migration and Next.js runtime changes — they describe an older version of this codebase and weren't in scope for this pass. Worth a dedicated audit separately.
