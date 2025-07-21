import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "creator_challenges" ALTER COLUMN "date_from" SET NOT NULL;
  ALTER TABLE "social_media_campaigns" ALTER COLUMN "date_from" SET NOT NULL;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "creator_challenges" ALTER COLUMN "date_from" DROP NOT NULL;
  ALTER TABLE "social_media_campaigns" ALTER COLUMN "date_from" DROP NOT NULL;`);
}
