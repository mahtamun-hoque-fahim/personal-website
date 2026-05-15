# PLANNER.md — fahim. Personal Website

> Living technical document. Updated whenever `update repo` is triggered.
> Last updated: May 15, 2026

---

## Overview

| Field | Value |
|---|---|
| Project | fahim. — Personal Website |
| Purpose | Full-stack personal portfolio showcasing design work, blog posts, and project portfolio with dynamic admin management |
| Target User | Design/dev clients, recruiters, personal network |
| Key Value | Fully managed portfolio (blog + projects) without CMS; Edge Runtime compatible for fast global delivery |
| Status | 🔄 In Progress |
| Repo | `https://github.com/mahtamun-hoque-fahim/personal-website` |
| Live (Vercel) | `https://mahtamunhoquefahim.vercel.app` |
| Live (CF Pages) | `https://mahtamunhoquefahim.pages.dev` |

---

## Architecture

**Stack:**
- Framework: Next.js 14 App Router (TypeScript)
- Styling: Tailwind CSS + CSS custom properties
- Database: Neon (PostgreSQL) via direct SQL queries
- Auth: Better Auth (email/password + forgot password via bcryptjs)
- Fonts: Syne (headings), Onest (body), JetBrains Mono (code/labels)
- Deployment: Vercel (primary) + Cloudflare Pages (secondary)
- Runtime: Edge Runtime on all pages (`export const runtime = 'edge'`)

**Folder Structure:**
```
/
├── app/
│   ├── page.tsx                 # Home — hero, services, featured projects
│   ├── about/page.tsx           # Timeline, values, tools
│   ├── blog/
│   │   ├── page.tsx             # Blog listing
│   │   └── [slug]/page.tsx      # Single post (custom Markdown renderer)
│   ├── contact/page.tsx         # Contact page + form
│   ├── projects/page.tsx        # All projects showcase
│   ├── admin/
│   │   ├── page.tsx             # Dashboard
│   │   ├── login/page.tsx       # Sign up / Sign in
│   │   ├── forgot-password/page.tsx   # Request password reset
│   │   ├── reset-password/page.tsx    # Reset via email token
│   │   ├── actions.ts           # Server Actions (logout, project updates)
│   │   ├── posts/               # Blog CRUD
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── PostEditor.tsx
│   │   ├── projects/page.tsx    # Project management
│   │   │   └── ProjectsManager.tsx
│   │   └── messages/            # Contact form submissions
│   ├── api/auth/[...all]/route.ts  # Better Auth API routes
│   ├── layout.tsx               # Root layout
│   └── globals.css              # CSS variables, base styles
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ContactForm.tsx          # Client-side contact submission
│   └── ProjectCard.tsx          # Reusable project display component
├── lib/
│   ├── db.ts                    # Neon serverless driver
│   ├── neon.ts                  # Database query functions (blog, messages, projects)
│   ├── auth-utils.ts            # Session/auth helpers
│   ├── auth.ts                  # Better Auth configuration
│   ├── markdown.ts              # Custom Markdown renderer (zero deps)
│   └── utils.ts                 # cn(), formatDate(), etc.
├── supabase/
│   └── schema.sql               # PostgreSQL schema (blog_posts, contact_messages, projects)
├── MIGRATION.md                 # Setup guide: Supabase → Neon + Better Auth
├── PLANNER.md
├── DESIGN_GUIDE.md
└── README.md
```

---

## User Flows

### Flow 1: Visitor Browses Portfolio
1. Visitor lands on `/` (home)
2. Scrolls through hero, services, featured projects
3. Clicks "View all" → `/projects` (all 10 projects)
4. Clicks project → opens live URL or repo
5. Visits `/blog` → reads posts
6. Visits `/about` → learns timeline, values, tools
7. Visits `/contact` → submits message → stored in DB

### Flow 2: Admin Signs In
1. Admin visits `/admin` → redirected to `/admin/login`
2. Signs up with email + password OR signs in with existing account
3. Successful auth → redirected to `/admin` dashboard
4. Sessions managed by Better Auth cookies (HTTP-only)

### Flow 3: Admin Manages Projects
1. Admin goes to `/admin/projects`
2. Sees all 10 projects in a list
3. Toggles featured status (checkbox)
4. Reorders featured projects (up/down arrows)
5. Changes saved to Neon → homepage featured projects update immediately

### Flow 4: Admin Writes Blog Post
1. Admin goes to `/admin/posts/new`
2. Enters title, slug, excerpt, cover image URL, content (Markdown)
3. Live Markdown preview on right
4. Sets tags (comma-separated), reading time
5. Toggles Published
6. Clicks Create → stored in DB, appears on `/blog`
7. Can edit via `/admin/posts/[id]`

### Flow 5: Admin Resets Forgotten Password
1. Admin visits `/admin/login` → clicks "Forgot password?"
2. Enters email → API sends reset link email
3. Clicks link in email (opens `/admin/reset-password?token=...`)
4. Enters new password → stored in DB, redirects to login
5. Signs in with new password

---

## DB Schema

> PostgreSQL via Neon. Auto-created by Better Auth for users/sessions.

```sql
-- Users & Sessions (auto-created by Better Auth)
-- users: id, email, name, emailVerified, image, createdAt, updatedAt
-- sessions: id, expiresAt, token, ipAddress, userAgent, userId, createdAt, updatedAt
-- verifications: id, identifier, value, expiresAt, createdAt, updatedAt

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  type TEXT NOT NULL,                    -- "Web App", "Tool", "Browser Extension", etc.
  live_url TEXT,
  repo_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  featured_order INTEGER,                -- Null if not featured; 1-4 for featured
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**10 Projects (hardcoded for now):**
1. Bindu — featured order 1
2. Fontina — featured order 2
3. Sentri — featured order 3
4. Neura — featured order 4
5. LearnDE (in progress)
6. Formify
7. Notably
8. Memoriza
9. Raisy
10. Claudia

---

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/sign-up` | Public | Create account (email/password) |
| POST | `/api/auth/sign-in/email` | Public | Sign in (email/password) |
| POST | `/api/auth/forgot-password` | Public | Request password reset email |
| POST | `/api/auth/reset-password` | Public | Reset password via token |
| GET / POST | `/api/auth/[...all]` | — | Better Auth handler (routes auto-managed) |

**Server Actions (in `app/admin/actions.ts`):**

| Action | Auth | Description |
|---|---|---|
| `logoutAction()` | Protected | Sign out → redirect to `/api/auth/signout` |
| `updateProjectFeatured(id, featured)` | Protected | Toggle featured status |
| `reorderProjects(orders)` | Protected | Reorder featured projects |

---

## Env Vars

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection | `postgresql://user:pass@host/db` |
| `BETTER_AUTH_SECRET` | ✅ | Better Auth session secret | `generate-with-openssl-rand-base64-32` |
| `BETTER_AUTH_URL` | ✅ | Auth callback URL | `http://localhost:3000` or production URL |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public app URL | `http://localhost:3000` or `https://domain.com` |
| `RESEND_API_KEY` | ✅ | Resend email API key | `re_...` |
| `RESEND_FROM_EMAIL` | ✅ | Email sender (verified domain) | `noreply@yourdomain.com` |

> Full setup → see MIGRATION.md and README.md

---

## Phases & Timeline

| Phase | Name | Status | Key Tasks |
|---|---|---|---|
| 1 | Foundation | ✅ | Repo init, design system, home/about/contact pages |
| 2 | Blog System | ✅ | Blog listing, single post, admin editor, Markdown renderer |
| 3 | Projects Showcase | ✅ | Projects listing, featured projects, dynamic management |
| 4 | Auth Migration | ✅ | Supabase → Neon + Better Auth (email/password + forgot password) |
| 5 | Deployment & Polish | 🔄 | Vercel deployment, Cloudflare Pages setup, SEO, performance |

---

## Next Steps

1. **Set up Resend** — Create account, get API key, verify sender domain
2. **Deploy to Vercel** — Add Neon + Better Auth + Resend env vars to Vercel dashboard
3. **Test email flows locally** — Verify sign up, sign in, forgot password work with Resend
4. **Monitor auth usage** — Track sessions, password resets in production
5. **Add email verification** — Optional: require email verification on signup (already set up, just needs toggling)
6. **Consider future features** — OAuth providers, 2FA, profile editing, etc.

---

## Decisions & Notes

- **Auth**: Switched from Supabase to Better Auth for simpler self-hosted auth + easier customization
- **Google OAuth removed**: Simplified to email/password + forgot password only
- **Email service**: Resend handles transactional emails (password reset, verification)
- **Password hashing**: bcryptjs (10 salt rounds) via Better Auth
- **Edge Runtime**: All pages run on Edge via `export const runtime = 'edge'` for Cloudflare compatibility
- **Custom Markdown**: Zero-dependency renderer (no remark/marked) for Edge Runtime support
- **Database queries**: Direct SQL via Neon serverless driver (no ORM, lighter than Drizzle for this scale)
- **Featured projects**: Order managed in DB; dashboard UI has drag/reorder
