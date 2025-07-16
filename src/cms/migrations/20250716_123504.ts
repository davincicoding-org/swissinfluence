import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "network_events" RENAME COLUMN "date_from" TO "date";
  ALTER TABLE "network_events" DROP COLUMN "date_to";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "network_events" ADD COLUMN "date_from" timestamp(3) with time zone;
  ALTER TABLE "network_events" ADD COLUMN "date_to" timestamp(3) with time zone;
  ALTER TABLE "network_events" DROP COLUMN "date";`)
}
