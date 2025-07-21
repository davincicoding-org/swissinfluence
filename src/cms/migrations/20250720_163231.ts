import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "voting_submissions_votes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"influencer_id" integer NOT NULL,
  	"category_id" integer NOT NULL
  );
  
  CREATE TABLE "voting_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"award_id" integer NOT NULL,
  	"confirmed" boolean DEFAULT false NOT NULL,
  	"hash" varchar NOT NULL,
  	"newsletter" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "access_admin" boolean;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "voting_submissions_id" integer;
  ALTER TABLE "voting_submissions_votes" ADD CONSTRAINT "voting_submissions_votes_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "voting_submissions_votes" ADD CONSTRAINT "voting_submissions_votes_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "voting_submissions_votes" ADD CONSTRAINT "voting_submissions_votes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."voting_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "voting_submissions" ADD CONSTRAINT "voting_submissions_award_id_awards_id_fk" FOREIGN KEY ("award_id") REFERENCES "public"."awards"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "voting_submissions_votes_order_idx" ON "voting_submissions_votes" USING btree ("_order");
  CREATE INDEX "voting_submissions_votes_parent_id_idx" ON "voting_submissions_votes" USING btree ("_parent_id");
  CREATE INDEX "voting_submissions_votes_influencer_idx" ON "voting_submissions_votes" USING btree ("influencer_id");
  CREATE INDEX "voting_submissions_votes_category_idx" ON "voting_submissions_votes" USING btree ("category_id");
  CREATE INDEX "voting_submissions_award_idx" ON "voting_submissions" USING btree ("award_id");
  CREATE INDEX "voting_submissions_updated_at_idx" ON "voting_submissions" USING btree ("updated_at");
  CREATE INDEX "voting_submissions_created_at_idx" ON "voting_submissions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_voting_submissions_fk" FOREIGN KEY ("voting_submissions_id") REFERENCES "public"."voting_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_voting_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("voting_submissions_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "voting_submissions_votes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "voting_submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "voting_submissions_votes" CASCADE;
  DROP TABLE "voting_submissions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_voting_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_voting_submissions_id_idx";
  ALTER TABLE "users" DROP COLUMN "access_admin";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "voting_submissions_id";`);
}
