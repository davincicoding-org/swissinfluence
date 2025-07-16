import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "awards_locales" (
  	"newcomer_scout_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "certification" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"influencer_image_id" integer NOT NULL,
  	"influencer_application_url" varchar NOT NULL,
  	"agency_image_id" integer NOT NULL,
  	"agency_application_url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "certification_locales" (
  	"influencer_title" varchar NOT NULL,
  	"influencer_headline" varchar NOT NULL,
  	"influencer_content" jsonb NOT NULL,
  	"influencer_application_cta" varchar NOT NULL,
  	"agency_title" varchar NOT NULL,
  	"agency_headline" varchar NOT NULL,
  	"agency_content" jsonb NOT NULL,
  	"agency_application_cta" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "awards" ADD COLUMN "newcomer_scout_image_id" integer;
  ALTER TABLE "network" ADD COLUMN "campaign_request_url" varchar NOT NULL;
  ALTER TABLE "network" ADD COLUMN "whatsapp_image_id" integer NOT NULL;
  ALTER TABLE "awards_locales" ADD CONSTRAINT "awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certification" ADD CONSTRAINT "certification_influencer_image_id_photos_id_fk" FOREIGN KEY ("influencer_image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certification" ADD CONSTRAINT "certification_agency_image_id_photos_id_fk" FOREIGN KEY ("agency_image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certification_locales" ADD CONSTRAINT "certification_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."certification"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "awards_locales_locale_parent_id_unique" ON "awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "certification_influencer_image_idx" ON "certification" USING btree ("influencer_image_id");
  CREATE INDEX "certification_agency_image_idx" ON "certification" USING btree ("agency_image_id");
  CREATE UNIQUE INDEX "certification_locales_locale_parent_id_unique" ON "certification_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "awards" ADD CONSTRAINT "awards_newcomer_scout_image_id_photos_id_fk" FOREIGN KEY ("newcomer_scout_image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "network" ADD CONSTRAINT "network_whatsapp_image_id_photos_id_fk" FOREIGN KEY ("whatsapp_image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "awards_newcomer_scout_image_idx" ON "awards" USING btree ("newcomer_scout_image_id");
  CREATE INDEX "network_whatsapp_image_idx" ON "network" USING btree ("whatsapp_image_id");
  ALTER TABLE "network" DROP COLUMN "influencer_application_url";
  ALTER TABLE "network" DROP COLUMN "agency_application_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "awards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "certification" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "certification_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "awards_locales" CASCADE;
  DROP TABLE "certification" CASCADE;
  DROP TABLE "certification_locales" CASCADE;
  ALTER TABLE "awards" DROP CONSTRAINT "awards_newcomer_scout_image_id_photos_id_fk";
  
  ALTER TABLE "network" DROP CONSTRAINT "network_whatsapp_image_id_photos_id_fk";
  
  DROP INDEX "awards_newcomer_scout_image_idx";
  DROP INDEX "network_whatsapp_image_idx";
  ALTER TABLE "network" ADD COLUMN "influencer_application_url" varchar NOT NULL;
  ALTER TABLE "network" ADD COLUMN "agency_application_url" varchar NOT NULL;
  ALTER TABLE "awards" DROP COLUMN "newcomer_scout_image_id";
  ALTER TABLE "network" DROP COLUMN "campaign_request_url";
  ALTER TABLE "network" DROP COLUMN "whatsapp_image_id";`)
}
