CREATE TABLE "about_content" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"headline_top" text DEFAULT 'Designer who codes.' NOT NULL,
	"headline_accent" text DEFAULT 'Developer who designs.' NOT NULL,
	"intro" text DEFAULT 'I''m Mahtamun Hoque Fahim. I grew up in Bangladesh with an internet connection and an obsession with how things look and work. That combination became a career.' NOT NULL,
	"story_heading" text DEFAULT 'The honest story' NOT NULL,
	"story_paragraphs" text[] DEFAULT ARRAY['I didn''t study design in a formal school. I learned by obsessively reverse-engineering things I loved: breaking down why a logo felt trustworthy, why a website felt fast, why some interfaces made you feel calm.','I started building websites because I couldn''t communicate what I wanted to developers. I started designing seriously because I couldn''t stand ugly interfaces. Both accidents became strengths.','Being from Bangladesh sharpened me. I couldn''t rely on proximity to opportunity, so I had to be undeniably good. That''s still the standard I hold myself to.','I care about work that ships, that works, that people actually use. Beautiful for its own sake doesn''t interest me. Beautiful and functional? That''s the whole game.']::text[] NOT NULL,
	"cta_heading" text DEFAULT 'Want to work together?' NOT NULL,
	"cta_text" text DEFAULT 'I''m selective about what I take on, which means I care about what you''re building.' NOT NULL,
	"cta_primary_label" text DEFAULT 'Get in touch' NOT NULL,
	"cta_secondary_label" text DEFAULT 'See portfolio' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
