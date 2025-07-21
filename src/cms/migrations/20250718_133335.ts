import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_locales" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_photos_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_locales" DROP CONSTRAINT "pages_locales_meta_image_id_photos_id_fk";
  
  DROP INDEX "pages_meta_meta_image_idx";
  ALTER TABLE "pages_locales" DROP COLUMN "meta_title";
  ALTER TABLE "pages_locales" DROP COLUMN "meta_description";
  ALTER TABLE "pages_locales" DROP COLUMN "meta_image_id";`);
}
