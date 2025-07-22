import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "awards_categories" ADD COLUMN "voting_opening" timestamp(3) with time zone;
  ALTER TABLE "awards_categories" ADD COLUMN "voting_deadline" timestamp(3) with time zone;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "awards_categories" DROP COLUMN "voting_opening";
  ALTER TABLE "awards_categories" DROP COLUMN "voting_deadline";`);
}
