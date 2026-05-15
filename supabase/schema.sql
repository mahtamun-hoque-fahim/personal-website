-- ============================================================
-- Fahim Portfolio — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Blog posts ──────────────────────────────────────────────
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  excerpt       text not null default '',
  content       text not null default '',
  cover_image   text,
  published     boolean not null default false,
  tags          text[] not null default '{}',
  reading_time  integer not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast slug lookups
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_published_idx on public.blog_posts (published, created_at desc);

-- ── Contact messages ────────────────────────────────────────
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null default '',
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_read_idx on public.contact_messages (read, created_at desc);

-- ── Projects ────────────────────────────────────────────────
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  tagline       text not null,
  description   text not null,
  tags          text[] not null default '{}',
  type          text not null,
  live_url      text,
  repo_url      text not null,
  featured      boolean not null default false,
  featured_order integer,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists projects_featured_idx on public.projects (featured, featured_order);

-- ── Row Level Security ───────────────────────────────────────
-- Blog posts: public can read published posts; anon key can do everything
-- (For a personal site with simple admin cookie auth, we allow anon full access.
--  If you want tighter security, add Supabase Auth later.)

alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.projects enable row level security;

-- Allow anyone to read published posts
create policy "Public can read published posts"
  on public.blog_posts
  for select
  using (published = true);

-- Allow anon key full access (admin uses same client)
create policy "Anon full access blog_posts"
  on public.blog_posts
  for all
  using (true)
  with check (true);

-- Allow anyone to insert contact messages (contact form)
create policy "Anyone can submit contact message"
  on public.contact_messages
  for insert
  with check (true);

-- Allow anon key to read/update messages (admin)
create policy "Anon full access contact_messages"
  on public.contact_messages
  for all
  using (true)
  with check (true);

-- Allow anyone to read projects
create policy "Public can read projects"
  on public.projects
  for select
  using (true);

-- Allow anon key full access to projects (admin)
create policy "Anon full access projects"
  on public.projects
  for all
  using (true)
  with check (true);

-- ── Sample seed data (optional) ─────────────────────────────
insert into public.blog_posts (title, slug, excerpt, content, published, tags, reading_time)
values (
  'Why I stopped separating design from code',
  'why-i-stopped-separating-design-from-code',
  'The moment I realised the handoff is the problem — not the people doing it.',
  E'## The handoff is broken\n\nEvery designer who has ever handed a Figma file to a developer knows the feeling.\nYou open the built version and something is... off. The spacing is wrong. The hover state is missing. The font weight is slightly different.\n\nAnd the developer didn''t do anything wrong. They just couldn''t *feel* what you meant.\n\n## What I did about it\n\nI learned to code.\n\nNot because code is better than design, but because the gap between them was costing me. When I can go from Figma to Next.js myself, the thing that ships is the thing I intended.\n\nThere''s no translation layer. No game of telephone.\n\n## What I lost (and gained)\n\nI lost the comfort of a single discipline. You can''t be precious about "that''s the developer''s problem" when you are the developer.\n\nBut I gained something better: **ownership of the full experience**.\n\nEvery micro-interaction, every transition timing, every hover state — I decide. And I build it exactly right.\n\n## The honest advice\n\nYou don''t have to do both. But if you''re a designer who keeps being frustrated by implementation, learn enough code to have the conversation in both languages.\n\nAnd if you''re a developer frustrated by designs that ignore technical constraints — learn enough design to push back with visuals, not words.\n\nThe best work I''ve seen comes from people who speak both.',
  true,
  ARRAY['design', 'process', 'code'],
  4
);

-- Seed projects data
insert into public.projects (name, tagline, description, tags, type, live_url, repo_url, featured, featured_order)
values
  ('Bindu', 'Anonymous messaging platform.', 'Share a link, receive messages from anyone. No account needed to send. Real-time WebSocket updates, anonymous/named voting, rate limiting via Upstash Redis, and optional email notifications via Resend.', ARRAY['Next.js 16', 'NextAuth v5', 'Neon', 'Drizzle', 'Redis'], 'Web App', 'https://bindu.pages.dev', 'https://github.com/mahtamun-hoque-fahim/bindu', true, 1),
  ('Fontina', 'Font converter. Drop, convert, use.', 'Drop any font file → get web-ready WOFF2 instantly. Server-side conversion using fonttools (Python), beautiful drag-drop UI, batch conversion support, and instant download.', ARRAY['Next.js 16', 'Tailwind CSS', 'Python', 'fonttools'], 'Web Tool', 'https://fontina-convert.vercel.app', 'https://github.com/mahtamun-hoque-fahim/fontina', true, 2),
  ('LearnDE', 'Interactive Differential Equations learning.', 'Platform for university CSE students to learn differential equations interactively. Student dashboards, staff grading tools, admin controls, email notifications, and rich math rendering.', ARRAY['Next.js 16', 'Better Auth', 'Neon', 'Drizzle', 'Resend'], 'Learning Platform', 'https://learn-differential-equation.vercel.app', 'https://github.com/mahtamun-hoque-fahim/learnDE', false, null),
  ('Formify', 'Build forms without code.', 'Drag-and-drop form builder with zero coding. Real-time previews, conditional logic, integrations, and form analytics. Share forms via unique links.', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS'], 'Web App', 'https://oneformify.vercel.app', 'https://github.com/mahtamun-hoque-fahim/formify', false, null),
  ('Notably', 'Notes app with version history.', 'Git Quest XP – collaborative note-taking with version control. Track changes, restore previous versions, collaborate in real-time.', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS'], 'Productivity App', null, 'https://github.com/mahtamun-hoque-fahim/notably', false, null),
  ('Memoriza', 'Spaced repetition. Memory mastery.', 'Flashcard app powered by spaced repetition algorithm. Create decks, track progress, and master anything through scientifically-proven learning methods.', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS'], 'Learning App', 'https://memorizaa.vercel.app', 'https://github.com/mahtamun-hoque-fahim/memoriza', false, null),
  ('Sentri', 'Zero-knowledge password manager.', 'AES-256-GCM encryption client-side only. Master Password + Secret Key two-factor key derivation with PBKDF2 (600k iterations). The server never sees your plaintext — not even me.', ARRAY['Next.js 14', 'Clerk', 'Neon', 'Crypto'], 'Security App', 'https://sentri-here.vercel.app', 'https://github.com/mahtamun-hoque-fahim/sentri', true, 3),
  ('Neura', 'Minimal whiteboard. Zero dependencies.', 'A beautiful drawing canvas in a single HTML file. Pen, highlighter, shapes, arrows, text, undo/redo, PNG export, touch support. No build step, no npm install.', ARRAY['HTML', 'Canvas API', 'Zero deps'], 'Tool', 'https://neura-ashy.vercel.app', 'https://github.com/mahtamun-hoque-fahim/neura', true, 4),
  ('Raisy', 'Raise your hand.', 'Real-time polls with zero sign-up. Share a link, watch votes roll in live via WebSocket. Supports anonymous/named voting, deadlines, drag-reorder, CSV/JSON export, and QR code sharing.', ARRAY['Next.js 14', 'Ably', 'Neon', 'Drizzle'], 'Web App', 'https://raisy-polling.vercel.app', 'https://github.com/mahtamun-hoque-fahim/Raisy', false, null),
  ('Claudia', 'Export Claude chats as beautiful PDFs.', 'Chrome extension that exports Claude.ai conversations with dark/light themes, LaTeX via KaTeX, syntax highlighting via Prism.js, and selective message export.', ARRAY['Chrome Extension', 'KaTeX', 'Prism.js'], 'Browser Extension', null, 'https://github.com/mahtamun-hoque-fahim/claudia', false, null)
on conflict (name) do nothing;
