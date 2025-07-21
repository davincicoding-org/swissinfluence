import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "voting_submissions" ADD COLUMN "first_name" varchar NOT NULL;
  ALTER TABLE "voting_submissions" ADD COLUMN "last_name" varchar NOT NULL;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "voting_submissions" DROP COLUMN "first_name";
  ALTER TABLE "voting_submissions" DROP COLUMN "last_name";`);
}
