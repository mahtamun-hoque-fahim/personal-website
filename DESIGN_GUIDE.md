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
  --bg:         #111111;   /* page background */
  --surface:    #222222;   /* card / panel background */
  --border:     #333333;   /* default border color */
  --text:       #F3F6F4;   /* primary text — warm white, not pure #fff */
  --muted:      #8A938E;   /* secondary / supporting text */
}
```

### Named Palette (reference)

The neutrals are a strict four-step gray ladder: `#111111` (page), `#222222` (surfaces), `#333333` (lines and raised hover fills), `#444444` (ambient glow, and the stronger/hover border). Text keeps its own tones; the accent is unchanged.

| Token          | Hex       | Usage                                              |
|----------------|-----------|----------------------------------------------------|
| `--accent`     | `#3DF49A` | CTAs, active nav underline, icons, eyebrow labels  |
| `--accent-dim` | `#5BFBA8` | Accent hover / pressed states                      |
| `--bg`         | `#111111` | Body background, the cells of `gap-px` grids       |
| `--surface`    | `#222222` | Cards, panels, inputs, code blocks, admin panels, the ticker band, hover fill on grid cells |
| `--border`     | `#333333` | All borders, dividers, grid lines (the `bg` of a `gap-px` grid), decorative separators |
| (no token)     | `#444444` | Ambient glow colour (`GLOW_RGB` in `MintGlow.tsx`, plus the closing-CTA glow), stronger/hover borders, the timeline dot border |
| `--text`       | `#F3F6F4` | Primary readable text                              |
| `--muted`      | `#8A938E` | Secondary text, meta info                          |
| `#5C615E`      | —         | Dim text: placeholders, ghost numbers (post index, inactive states), the old dark-gray text tones |
| `#C7CCCA`      | —         | Body copy inside `prose-dark` blog content         |

Rule of thumb: a border must differ from the surface it sits on. Surfaces are `#222222`, so their borders are `#333333`; on a `#111111` page, `#333333` hairlines are the visible-but-quiet default.

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
| Border gaps       | `gap-px bg-[#333333]` (CSS grid trick for 1px dividers between cards) |

### Grid System

- **3-column service grid:** `grid-cols-1 md:grid-cols-3 gap-px bg-[#333333]` with `bg-[#111111]` children — creates seamless 1px separators
- **2-column content split:** `grid-cols-1 md:grid-cols-2 gap-16`
- **Blog list:** `space-y-0` with `border-b border-[#333333]` per row

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
  className="px-7 py-3 border border-[#333333] text-[#F3F6F4] text-sm rounded-full
             hover:border-[#8A938E] transition-[border-color,color,transform] duration-200 active:scale-[0.97]"
  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
>
  About me
</button>

// Admin / small action — border, rounded-lg
<button
  className="text-xs px-3 py-1.5 border border-[#333333] rounded-lg text-[#8A938E]
             hover:text-[#3DF49A] hover:border-[#3DF49A] transition-colors"
  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
>
  Edit
</button>
```

### Cards / Surface Panels

```tsx
<div className="bg-[#222222] border border-[#333333] rounded-xl p-6 md:p-8">
  ...
</div>
```

Hover state on interactive cards: `hover:bg-[#222222]` or `hover:border-[#444444]`.

### Status Badges

```tsx
// Published / active
<span className="text-xs px-2 py-0.5 bg-[#3DF49A]/10 text-[#3DF49A] border border-[#3DF49A]/20 rounded-full"
  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
  Published
</span>

// Draft / inactive
<span className="text-xs px-2 py-0.5 bg-[#333333] text-[#8A938E] border border-[#333333] rounded-full"
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

### CTA glow (radial background)

A faint `#444444` glow at the bottom of the closing "Reach Out!" section on the homepage (it was mint before the 2026-10 palette change). The page-wide ambient glow is separate: `components/MintGlow.tsx`, constant `GLOW_RGB`.

```tsx
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    background: 'radial-gradient(ellipse at center bottom, rgba(68,68,68,0.28) 0%, transparent 70%)',
  }}
/>
```

### Code Aesthetic Block

Terminal-style card used in the homepage personality section:

```tsx
<div className="bg-[#222222] border border-[#333333] rounded-xl p-8"
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
<div className="overflow-hidden border-y border-[#333333] py-4 bg-[#222222]">
  <div className="flex gap-12 animate-marquee whitespace-nowrap">
    {ticker.map((skill, i) => (
      <span key={i} className="text-sm tracking-widest uppercase shrink-0"
        style={{ color: i % 3 === 0 ? '#3DF49A' : '#8A938E' }}>
        {skill}
        <span className="ml-12 text-[#333333]">◆</span>
      </span>
    ))}
  </div>
</div>
```

The `animate-marquee` keyframe runs `translateX(0% → -50%)` over 30s. Array must be doubled (`[...skills, ...skills]`) for seamless looping, and the track must be `w-max`: `translateX(-50%)` is half of the track's OWN width, so a track that is only as wide as its container loops at the wrong point.

`components/MarqueeStrip.tsx` is the ONE strip component, used by the homepage skills strip and the `/projects` technologies strip, so both always have the same band (`#222222` fill, `#333333` top and bottom lines, full-bleed) and the same speed. It doubles the list itself, marks the second copy `aria-hidden`, pauses on hover, and sets the speed in pixels per second: the animation duration is `distance / speed`, where distance is the measured width of one copy (re-measured on resize and when fonts load), so a long list and a short one move at the same pace. The speed is `site_settings.marquee_speed` (default 60 px/s, range 10-200), edited with the "Strip speed" slider in Admin > Settings. The seam is exact because spacing lives inside each item (`mx-12` on the separator) and not in a flex `gap`: with a gap, half the track would be half a gap short of one copy and the loop would jump. Items on `/projects` are the unique project tags, most used first.

### Navbar

- Fixed, `z-50`, transparent by default
- On scroll (`window.scrollY > 40`): `bg-[#111111]/90 backdrop-blur-xl border-b border-[#333333]`
- Logo: `fahim` + `.` in `#3DF49A`
- Active link: `text-[#3DF49A]` + `1px` underline via absolute `<span>`; other links slide the same underline in from the left on hover (`scale-x-0` to `scale-x-100`, `origin-left`)
- Hidden on `/admin/*` routes
- Mobile: full-screen overlay. Links fade, rise and de-blur in with a staggered `transitionDelay` (80ms + 50ms per link); closing is immediate. The closed menu is `invisible` so its links leave the tab order. Esc closes it, body scroll is locked while open, and the button carries `aria-expanded`.

### Footer

- `border-t border-[#333333] mt-24 py-12 px-6`
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

### About page blocks

Two text blocks above the call to action, laid out as a wireframe (the cell borders in that wireframe were only explanatory; the real page has none): the EXTRA block (new) is image on the left (36.5% of the width) and heading plus text on the right; the STORY block is text on the left (63.5%) and image on the right. Both images are square (`aspect-square`, `object-cover`, `rounded-xl`), lazy-loaded, reveal with a light blur, and stack on phones (image first for the extra block, text first for the story). Every part is optional: the extra block does not render while its heading and text are both empty, and a block without an image lets the text take the full width. Everything comes from `about_content` and is edited in Admin > About (including the two image uploads, stored in Cloudinary at `personal-website/about/about-extra` and `about-story`). `squareImage()` in `app/about/page.tsx` asks Cloudinary for a 900px smart-cropped (`g_auto`), compressed, best-format version instead of the raw upload.

### Hero portrait

`components/HeroPortrait.tsx`, used once in the homepage hero. The full figure at natural proportions (`public/images/fahim-hero.webp`, transparent WebP, about 32 KB), no zoom, no mask, no extra glow (the page's ambient glow component, `MintGlow`, is the only light behind him; it is light gray now, see its `GLOW_RGB` constant). It lives inside a `relative` wrapper around the headline and intro row.
- **Vertical:** the top sits just above the wrapper's top edge (`top` = -0.04 x the h1 font size, following the headline's `clamp(3.5rem, 10vw, 9rem)`), which puts the top of the head level with the top of the "Build" ascenders; the bottom is pushed down 4rem (`bottom-[-4rem]`) so the waist cut lands exactly on the top border of the marquee strip below the hero (he stands on the strip). The 4rem is the `pb-16` on the hero container in `app/page.tsx`, and the clamp must match the h1 there. Height comes from the layout and `aspect-[571/907]` derives the width.
- **Horizontal:** `right-[10.5%]` of the container, so he stands in the free column right of the headline, not against the edge.
- Behind the headline (`-z-10`), hidden below `sm`. Enters with `.blur-load` (220ms delay, 1.2s, 4px blur), so the route arrival gate holds it too. Plain `<img>` with `fetchPriority="high"` (the site does not use `next/image`). To change the photo, replace the WebP and update `width`/`height`.

The hero "Let's talk" / "About me" buttons are behind `const SHOW_HERO_CTAS = false` at the top of `app/page.tsx`. Set it to `true` to bring them back; nothing else changes.

### Other motion

| Where | Behavior |
|-------|----------|
| Route change | `app/template.tsx`: 180ms opacity fade on enter, replayed every navigation, applied to `<main>` and `<footer>` only (never an ancestor of the navbar: an opacity animation on an ancestor kills the navbar's `backdrop-filter`). Enter-only (exit animations need a router-freezing hack). Skipped on `/admin`. |
| Arrival gate | The site uses `scroll-behavior: smooth`, so after a link click from far down a page Next scrolls to the top smoothly. If the new page mounts scrolled down, `app/template.tsx` sets `data-await-top`, which pauses the hero entrance (`.blur-load`, `BlurWords mode="load"`) until `scrollY` is within 24px of the top (2s safety timeout). At the top on mount nothing is gated, so first paint never waits for JS. Scroll-triggered reveals need no gate (they fire when in view). |
| Buttons | `active:scale-[0.97]` press. No hover grow. |
| Keyboard focus | `:focus-visible` mint outline (2px, 3px offset) on links and buttons; form fields use a soft 3px mint ring. |
| Contact form | Spinner while sending; success circle pops in and the check draws (`.pop-in`, `.check-draw`); error message eases in with `role="alert"`. |
| Skills ticker | Pauses on hover. |
| Ambient glow | `components/MintGlow.tsx`: ONE soft `#444444` orb behind everything, fixed softness (smooth Gaussian-style falloff, 11 stops, no clipped edge), about 66vw wide. Nothing about it varies over time. It is centred behind the hero portrait (the element marked `data-glow-anchor`), measured on load, on resize and on navigation, so it stays behind the portrait at any width; pages without a portrait keep it at the old upper-right position, and it glides between the two (1.2s). It fades in once placed so it never flashes at the wrong spot. Scroll parallax (28%) lives on a separate zero-size wrapper. Reduced motion: no glide, no parallax. No-JS: shows at the upper-right default. Tuning constants (`GLOW_PEAK`, `GLOW_SIZE`, `GLIDE_MS`) are at the top of the file. Earlier roaming and softness-drift versions are in git history (roam: `14cec60` on this branch). |

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
| 2026-09-28 | `small-ui-fixes` branch (off `main`): "What I do" section moved from a hardcoded array to a `skills` table, CRUD-able from `/admin/skills`. Each skill has an optional thumbnail (Cloudinary, own `skill-<id>` public_id per skill). Section layout changed from a 3-column grid to a single-column list of rows: image beside text on desktop, image above text on phones. Thumbnail slot background (`#222222`) is a shade lighter than the page so transparent PNG uploads still read as a tile. |
| 2026-06-29 | Display font split back out from body: every heading/display element that was originally Syne (recovered from git history, not guessed) now uses Clash Display via Fontshare's CDN link; Plus Jakarta Sans stays for body/UI text. `--font-clash` added to `:root` with a Jakarta/sans-serif fallback chain. |
| 2026-10-08 | Motion pass (`motion-polish`): CSS-only blur-fade reveal system, motion tokens, global reduced-motion guard, route fade, button press and focus states, navbar menu and contact form state animations. Section 8 rewritten; button snippets no longer use `transition-all` or hover grow. |

> **Note:** Sections 9–11 (Page Structure, Supabase Schema, Environment Variables) predate the Neon/Drizzle/Better Auth migration and Next.js runtime changes — they describe an older version of this codebase and weren't in scope for this pass. Worth a dedicated audit separately.
