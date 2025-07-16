import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "award_shows_schedule_locales" ADD COLUMN "title" varchar DEFAULT 'Title' NOT NULL;
  ALTER TABLE "conventions_schedule_locales" ADD COLUMN "title" varchar DEFAULT 'Title' NOT NULL;
  ALTER TABLE "award_shows_schedule" DROP COLUMN "title";
  ALTER TABLE "conventions_schedule" DROP COLUMN "title";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "award_shows_schedule" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "conventions_schedule" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "award_shows_schedule_locales" DROP COLUMN "title";
  ALTER TABLE "conventions_schedule_locales" DROP COLUMN "title";`)
}
