# fahim. — Personal Portfolio

Personal website of **Mahtamun Hoque Fahim** — Graphic Designer, Full-Stack Developer & UI/UX Designer from Bangladesh.

**Live site:** [your-domain.vercel.app]  
**Design portfolio:** [mahtamundesigns.vercel.app](https://mahtamundesigns.vercel.app)

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Fonts | Syne · Onest · JetBrains Mono |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, services, personality, writing teaser |
| `/about` | Deep story, timeline, values, tools |
| `/blog` | Blog listing from Supabase |
| `/blog/[slug]` | Blog post with Markdown rendering |
| `/contact` | Contact form → Supabase |
| `/admin` | Dashboard (password protected) |
| `/admin/posts` | Manage blog posts |
| `/admin/posts/new` | Write new post (Markdown editor) |
| `/admin/posts/[id]` | Edit existing post |
| `/admin/messages` | View contact form submissions |

---

## Setup (local development)

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/fahim-portfolio.git
cd fahim-portfolio
npm install
```

### 2. Set up Supabase tables

1. Go to [supabase.com](https://supabase.com) → your project → **SQL Editor**
2. Paste the contents of `supabase/schema.sql` and run it
3. This creates `blog_posts` and `contact_messages` tables with RLS policies

### 3. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ltyzobowjzwrwcacairz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ADMIN_PASSWORD=your_secure_password
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A — Vercel CLI (recommended)

```bash
npm i -g vercel
vercel login
vercel
```

When prompted, set environment variables or add them in the Vercel dashboard after deploy.

### Option B — GitHub + Vercel dashboard

1. Push this repo to GitHub:

```bash
git remote add origin https://github.com/YOUR_USERNAME/fahim-portfolio.git
git add .
git commit -m "initial commit"
git push -u origin main
```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your `fahim-portfolio` repo
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
5. Click **Deploy**

---

## Admin access

Visit `/admin` — you'll be redirected to `/admin/login`.  
Default password (set via `ADMIN_PASSWORD` env var): `fahim2024admin`

**Change this before deploying!** Set a strong password in your Vercel env vars.

### Writing a blog post

1. Go to `/admin/posts/new`
2. Write in Markdown — the editor shows a live preview
3. Set tags (comma-separated), excerpt, optional cover image URL
4. Toggle **Published** when ready
5. Hit **Create post** — it appears on `/blog` immediately

---

## Customising content

| What | Where |
|------|-------|
| Hero text, stats | `app/page.tsx` |
| Services | `app/page.tsx` → `services` array |
| About story | `app/about/page.tsx` |
| Timeline | `app/about/page.tsx` → `timeline` array |
| Tools grid | `app/about/page.tsx` |
| Contact links | `app/contact/page.tsx` |
| Accent color | `app/globals.css` → `--accent` variable |
| Fonts | `app/globals.css` + `tailwind.config.ts` |
| Nav links | `components/Navbar.tsx` → `navLinks` array |

---

## Supabase table reference

### `blog_posts`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto |
| title | text | Required |
| slug | text | Unique, auto-generated |
| excerpt | text | Blog listing preview |
| content | text | Markdown |
| cover_image | text | Optional URL |
| published | boolean | false = draft |
| tags | text[] | Array of tag strings |
| reading_time | int | Auto-calculated |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Updated on edit |

### `contact_messages`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto |
| name | text | From contact form |
| email | text | From contact form |
| subject | text | Selected category |
| message | text | Message body |
| read | boolean | Mark read in admin |
| created_at | timestamptz | Auto |

---

## License

Personal portfolio — all rights reserved.  
Design by Mahtamun Hoque Fahim.
