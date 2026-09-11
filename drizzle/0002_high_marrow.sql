-- NOTE: drizzle-kit generate diffed against 0000_snapshot.json (migration
-- 0001_credentials_tables.sql has no matching meta/0001_snapshot.json, so
-- the credential_* tables and projects.status_badges/collaborators columns
-- it already covers showed up again as "new"). This file has been trimmed
-- by hand to only the genuinely new object -- everything else in this repo
-- already exists in production per PLANNER.md's migration history table.
-- meta/0002_snapshot.json is left as generated (the full, correct schema
-- state), so future `drizzle-kit generate` runs diff cleanly from here.
CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"title" text DEFAULT 'Mahtamun Hoque Fahim — Full-Stack Developer & AI Engineer' NOT NULL,
	"description" text DEFAULT 'Full-stack developer and AI engineer from Bangladesh. Building web apps, tools, and digital products.' NOT NULL,
	"job_title" text DEFAULT 'Full-Stack Developer & AI Engineer' NOT NULL,
	"keywords" text[] DEFAULT ARRAY['developer','AI engineer','full-stack developer','Bangladesh','Next.js','TypeScript','mahtamun','mahtamun hoque fahim']::text[] NOT NULL,
	"og_title" text DEFAULT 'Mahtamun Hoque Fahim — Full-Stack Developer & AI Engineer' NOT NULL,
	"og_description" text DEFAULT 'Full-stack developer and AI engineer from Bangladesh. Building web apps, tools, and digital products.' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
