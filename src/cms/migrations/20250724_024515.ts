import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_awards_newcomer_scout_timeline_date_type" AS ENUM('DAY', 'PERIOD', 'MONTH');
  CREATE TABLE "awards_newcomer_scout_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date_type" "enum_awards_newcomer_scout_timeline_date_type" DEFAULT 'DAY' NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"date_end" timestamp(3) with time zone
  );
  
  CREATE TABLE "awards_newcomer_scout_timeline_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "awards_locales" RENAME COLUMN "newcomer_scout_content" TO "newcomer_scout_about";
  ALTER TABLE "awards_locales" ADD COLUMN "newcomer_scout_title" varchar;
  ALTER TABLE "awards_locales" ADD COLUMN "newcomer_scout_perks" jsonb;
  ALTER TABLE "awards_newcomer_scout_timeline" ADD CONSTRAINT "awards_newcomer_scout_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards_newcomer_scout_timeline_locales" ADD CONSTRAINT "awards_newcomer_scout_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards_newcomer_scout_timeline"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "awards_newcomer_scout_timeline_order_idx" ON "awards_newcomer_scout_timeline" USING btree ("_order");
  CREATE INDEX "awards_newcomer_scout_timeline_parent_id_idx" ON "awards_newcomer_scout_timeline" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "awards_newcomer_scout_timeline_locales_locale_parent_id_unique" ON "awards_newcomer_scout_timeline_locales" USING btree ("_locale","_parent_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "awards_newcomer_scout_timeline" CASCADE;
  DROP TABLE "awards_newcomer_scout_timeline_locales" CASCADE;
  ALTER TABLE "awards_locales" ADD COLUMN "newcomer_scout_content" jsonb;
  ALTER TABLE "awards_locales" DROP COLUMN "newcomer_scout_title";
  ALTER TABLE "awards_locales" DROP COLUMN "newcomer_scout_about";
  ALTER TABLE "awards_locales" DROP COLUMN "newcomer_scout_perks";
  DROP TYPE "public"."enum_awards_newcomer_scout_timeline_date_type";`);
}
