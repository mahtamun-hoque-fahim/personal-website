CREATE TABLE IF NOT EXISTS "credential_timeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" text NOT NULL,
	"period" text NOT NULL,
	"title" text NOT NULL,
	"org" text NOT NULL,
	"desc" text NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"type" text DEFAULT 'work' NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credential_clusters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"icon_id" text DEFAULT 'other' NOT NULL,
	"badge" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credential_certs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cluster_id" uuid NOT NULL,
	"name" text NOT NULL,
	"issuer" text NOT NULL,
	"date" text NOT NULL,
	"ects" real,
	"credential_id" text,
	"is_foundational" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credential_community" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"org" text NOT NULL,
	"period" text NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"ongoing" boolean DEFAULT false NOT NULL,
	"details" text[] DEFAULT '{}'::text[] NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credential_contributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"releases" text NOT NULL,
	"desc" text NOT NULL,
	"link" text NOT NULL,
	"link_label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "credential_certs" ADD CONSTRAINT "credential_certs_cluster_id_credential_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."credential_clusters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credential_timeline_sort_idx" ON "credential_timeline" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credential_clusters_sort_idx" ON "credential_clusters" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credential_certs_cluster_idx" ON "credential_certs" USING btree ("cluster_id","sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credential_community_sort_idx" ON "credential_community" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credential_contributions_sort_idx" ON "credential_contributions" USING btree ("sort_order");
