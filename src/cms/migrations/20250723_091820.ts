import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_awards_categories_voting_type" AS ENUM('DEFAULT', 'CUSTOM', 'DISABLED');
  ALTER TABLE "awards_categories" RENAME COLUMN "voting_opening" TO "voting_opening_override";
  ALTER TABLE "awards_categories" RENAME COLUMN "voting_deadline" TO "voting_deadline_override";
  ALTER TABLE "awards_categories" ADD COLUMN "voting_type" "enum_awards_categories_voting_type" DEFAULT 'DEFAULT' NOT NULL;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "awards_categories" ADD COLUMN "voting_opening" timestamp(3) with time zone;
  ALTER TABLE "awards_categories" ADD COLUMN "voting_deadline" timestamp(3) with time zone;
  ALTER TABLE "awards_categories" DROP COLUMN "voting_type";
  ALTER TABLE "awards_categories" DROP COLUMN "voting_opening_override";
  ALTER TABLE "awards_categories" DROP COLUMN "voting_deadline_override";
  DROP TYPE "public"."enum_awards_categories_voting_type";`);
}
