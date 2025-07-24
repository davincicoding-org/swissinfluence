import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "awards_locales" RENAME COLUMN "newcomer_scout_about" TO "newcomer_scout_info";`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "awards_locales" ADD COLUMN "newcomer_scout_about" jsonb;
  ALTER TABLE "awards_locales" DROP COLUMN "newcomer_scout_info";`);
}
