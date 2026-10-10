ALTER TABLE "about_content" ADD COLUMN "extra_heading" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "extra_paragraphs" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "extra_image_url" text;--> statement-breakpoint
ALTER TABLE "about_content" ADD COLUMN "story_image_url" text;