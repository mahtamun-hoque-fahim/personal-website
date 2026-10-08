ALTER TABLE "about_content" ADD COLUMN "home_heading" text DEFAULT 'Design can''t be separated from engineering.' NOT NULL;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "home_paragraph_one" text DEFAULT 'Most designers hand off to developers. Most developers leave security for last. I do it all, because I don''t rest till I build the best.' NOT NULL;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "home_paragraph_two" text DEFAULT 'I am obsessively curious about the space between pixels. I write code the way I design, with intention. I love what I do, and coffee? More.' NOT NULL;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "home_link_label" text DEFAULT 'Full story' NOT NULL;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "home_card_role" text DEFAULT 'Polymath' NOT NULL;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "home_card_description" text[] DEFAULT ARRAY['Design','Develop','Secure']::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "home_card_stack" text[] DEFAULT ARRAY['Next.js','Figma','Postgres']::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "home_card_availability" text[] DEFAULT ARRAY['Remote','Hybrid','Onsite']::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "home_card_obsessions" text[] DEFAULT ARRAY['Sky','Grass','coffee']::text[] NOT NULL;