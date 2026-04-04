# DESIGN_GUIDE.md — fahim. Personal Website

> **Rule:** Update this file every time you change a color, token, component pattern, or layout convention.
> It is the single source of truth for the visual system.

---

## 1. Brand Identity

**Site name:** `fahim.`  
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
  --accent:     #00e676;   /* primary green — CTAs, active states, highlights */
  --accent-dim: #00b85a;   /* hover/pressed state for accent */
  --bg:         #0a0a0a;   /* page background */
  --surface:    #141414;   /* card / panel background */
  --border:     #1f1f1f;   /* default border color */
  --text:       #f0ede6;   /* primary text — warm white, not pure #fff */
  --muted:      #8a8a8a;   /* secondary / supporting text */
}
```

### Named Palette (reference)

| Token          | Hex       | Usage                                              |
|----------------|-----------|----------------------------------------------------|
| `--accent`     | `#00e676` | CTAs, active nav underline, icons, eyebrow labels  |
| `--accent-dim` | `#00b85a` | Accent hover / pressed states                      |
| `--bg`         | `#0a0a0a` | Body background                                    |
| `--surface`    | `#141414` | Cards, code blocks, admin panels                   |
| `--border`     | `#1f1f1f` | All borders, dividers, grid lines                  |
| `--text`       | `#f0ede6` | Primary readable text                              |
| `--muted`      | `#8a8a8a` | Secondary text, meta info, placeholders            |
| `#2a2a2a`      | —         | Ghost/faded numbers (post index, inactive states)  |
| `#0d0d0d`      | —         | Hover bg on list rows (slightly off `--bg`)        |
| `#c8c4bc`      | —         | Body copy inside `prose-dark` blog content         |

### ⚠️ Critical: Tailwind + CSS Variables

**Never use Tailwind color utilities for custom tokens.** Tailwind's JIT engine cannot resolve CSS variables at build time.

```tsx
// ❌ WRONG — JIT purges this, color won't apply
<p className="text-accent">Hello</p>

// ✅ CORRECT — inline style with CSS variable
<p style={{ color: 'var(--accent)' }}>Hello</p>

// ✅ ALSO CORRECT — hardcoded hex is fine for one-offs
<p className="text-[#00e676]">Hello</p>
```

The Tailwind color extensions (`accent`, `surface`, etc.) in `tailwind.config.ts` exist for documentation/reference only — they are **not reliable** for dynamic usage.

---

## 3. Typography

### Font Stack

| Role        | Font             | CSS Variable         | Tailwind Class   | Weights Used      |
|-------------|------------------|----------------------|------------------|-------------------|
| Display     | Syne             | `var(--font-syne)`   | `font-display`   | 700, 800          |
| Body        | Onest            | `var(--font-onest)`  | `font-body`      | 300, 400, 500, 600|
| Monospace   | JetBrains Mono   | `var(--font-jetbrains)` | `font-mono`   | 400, 500          |

Fonts are loaded via Google Fonts in `app/globals.css` and `app/layout.tsx` `<head>`.

### Usage Patterns

```tsx
// Display heading (hero, section titles)
<h1 style={{ fontFamily: "'Syne', sans-serif" }}>Design. Code. Create.</h1>

// Body copy
<p style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}>...</p>

// Labels, tags, code snippets, meta info
<span style={{ fontFamily: "'JetBrains Mono', monospace" }}>// comment</span>
```

### Type Scale

| Element            | Size                          | Font    | Weight |
|--------------------|-------------------------------|---------|--------|
| Hero heading       | `clamp(3.5rem, 10vw, 9rem)`   | Syne    | 700    |
| Page heading (H1)  | `clamp(2.5rem, 7vw, 6rem)`    | Syne    | 700    |
| Section heading    | `text-4xl` – `text-6xl`       | Syne    | 700    |
| Card heading       | `text-xl` – `text-2xl`        | Syne    | 600–700|
| Body text          | `text-base` – `text-lg`       | Onest   | 300–400|
| Small / meta       | `text-xs` – `text-sm`         | Onest / JetBrains | 400 |
| Eyebrow labels     | `text-xs`, tracking `0.2em+`  | JetBrains Mono | 400 |

### Eyebrow Label Pattern

Used before all major section headings:

```tsx
<p
  className="text-[#00e676] text-xs tracking-[0.2em] uppercase mb-6"
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
| Border gaps       | `gap-px bg-[#1f1f1f]` (CSS grid trick for 1px dividers between cards) |

### Grid System

- **3-column service grid:** `grid-cols-1 md:grid-cols-3 gap-px bg-[#1f1f1f]` with `bg-[#0a0a0a]` children — creates seamless 1px separators
- **2-column content split:** `grid-cols-1 md:grid-cols-2 gap-16`
- **Blog list:** `space-y-0` with `border-b border-[#1f1f1f]` per row

---

## 5. Component Patterns

### Buttons

```tsx
// Primary CTA — filled accent, rounded-full
<button
  className="px-7 py-3 bg-[#00e676] text-black text-sm font-semibold rounded-full
             hover:bg-[#00b85a] transition-all duration-200 hover:scale-105 active:scale-95"
  style={{ fontFamily: "'Onest', sans-serif" }}
>
  Let's talk
</button>

// Secondary — ghost border, rounded-full
<button
  className="px-7 py-3 border border-[#1f1f1f] text-[#f0ede6] text-sm rounded-full
             hover:border-[#8a8a8a] transition-all duration-200"
  style={{ fontFamily: "'Onest', sans-serif" }}
>
  About me
</button>

// Admin / small action — border, rounded-lg
<button
  className="text-xs px-3 py-1.5 border border-[#1f1f1f] rounded-lg text-[#8a8a8a]
             hover:text-[#00e676] hover:border-[#00e676] transition-colors"
  style={{ fontFamily: "'Onest', sans-serif" }}
>
  Edit
</button>
```

### Cards / Surface Panels

```tsx
<div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 md:p-8">
  ...
</div>
```

Hover state on interactive cards: `hover:bg-[#0d0d0d]` or `hover:border-[#2a2a2a]`.

### Status Badges

```tsx
// Published / active
<span className="text-xs px-2 py-0.5 bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 rounded-full"
  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
  Published
</span>

// Draft / inactive
<span className="text-xs px-2 py-0.5 bg-[#2a2a2a] text-[#8a8a8a] border border-[#1f1f1f] rounded-full"
  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
  Draft
</span>
```

### Availability Pulse

```tsx
<div className="flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
  <span className="text-[#00e676] text-xs tracking-[0.25em] uppercase"
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
    background: 'radial-gradient(ellipse at center bottom, rgba(0,230,118,0.07) 0%, transparent 70%)',
  }}
/>
```

### Code Aesthetic Block

Terminal-style card used in the homepage personality section:

```tsx
<div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-8"
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
<div className="overflow-hidden border-y border-[#1f1f1f] py-4 bg-[#0d0d0d]">
  <div className="flex gap-12 animate-marquee whitespace-nowrap">
    {ticker.map((skill, i) => (
      <span key={i} className="text-sm tracking-widest uppercase shrink-0"
        style={{ color: i % 3 === 0 ? '#00e676' : '#8a8a8a' }}>
        {skill}
        <span className="ml-12 text-[#1f1f1f]">◆</span>
      </span>
    ))}
  </div>
</div>
```

The `animate-marquee` keyframe runs `translateX(0% → -50%)` over 30s. Array must be doubled (`[...skills, ...skills]`) for seamless looping.

### Navbar

- Fixed, `z-50`, transparent by default
- On scroll (`window.scrollY > 40`): `bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#1f1f1f]`
- Logo: `fahim` + `.` in `#00e676`
- Active link: `text-[#00e676]` + `1px` underline via absolute `<span>`
- Hidden on `/admin/*` routes
- Mobile: full-screen overlay with staggered `animationDelay`

### Footer

- `border-t border-[#1f1f1f] mt-24 py-12 px-6`
- Three columns: logo + tagline | nav links | copyright year
- Year is dynamically rendered: `new Date().getFullYear()`

---

## 6. Global CSS Utilities

Defined in `app/globals.css` under `@layer utilities`:

| Class            | Effect                                               |
|------------------|------------------------------------------------------|
| `.text-balance`  | `text-wrap: balance` — even heading line lengths     |
| `.mask-fade-right` | Gradient mask fading content to the right          |
| `.border-glow`   | `box-shadow: 0 0 0 1px var(--accent), 0 0 20px rgba(0,230,118,0.1)` |

### Special Effects

- **Noise texture:** `body::before` — SVG fractalNoise, `opacity: 0.4`, `pointer-events: none`, `z-index: 9999`
- **Scrollbar:** 4px wide, accent-colored thumb, bg-colored track
- **Selection:** `background: var(--accent)`, `color: #000`

---

## 7. Blog — `prose-dark` Styles

Blog post content is rendered from Markdown via a custom `renderMarkdown()` function (`lib/markdown.ts`) — **no external library**. Styles live in `app/globals.css` under `.prose-dark`.

| Element      | Style                                                        |
|--------------|--------------------------------------------------------------|
| Headings     | Syne, 700, `var(--text)`, margins: `2rem` top / `0.75rem` bottom |
| Body `<p>`   | Onest, `#c8c4bc`, `1.25rem` bottom margin                   |
| `<a>`        | `var(--accent)`, underline, 3px offset                       |
| Inline `<code>` | `var(--surface)` bg, `var(--border)` border, accent text, JetBrains Mono |
| `<pre>`      | `var(--surface)` bg, 8px radius, scrollable overflow        |
| `<blockquote>` | 3px left border accent, italic, muted color               |
| `<img>`      | Full width, 8px radius, `var(--border)` border, `1.5rem` vertical margin |
| `<hr>`       | `var(--border)` top border                                   |

---

## 8. Animations

All defined in `tailwind.config.ts`:

| Name            | Keyframe                             | Duration   | Usage                    |
|-----------------|--------------------------------------|------------|--------------------------|
| `animate-fade-up`  | opacity 0→1, translateY 24px→0    | 0.6s ease  | Page entrance elements   |
| `animate-fade-in`  | opacity 0→1                       | 0.4s ease  | Subtle content reveals   |
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
