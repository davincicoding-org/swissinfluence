import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" DROP COLUMN "legacy_id";
  ALTER TABLE "influencers" DROP COLUMN "legacy_id";
  ALTER TABLE "experts" DROP COLUMN "legacy_id";
  ALTER TABLE "brands" DROP COLUMN "legacy_id";
  ALTER TABLE "locations" DROP COLUMN "legacy_id";
  ALTER TABLE "awards" DROP COLUMN "legacy_id";
  ALTER TABLE "award_shows" DROP COLUMN "legacy_id";
  ALTER TABLE "creator_challenges" DROP COLUMN "legacy_id";
  ALTER TABLE "social_media_campaigns" DROP COLUMN "legacy_id";
  ALTER TABLE "network_events" DROP COLUMN "legacy_id";
  ALTER TABLE "certified_influencers" DROP COLUMN "legacy_id";
  ALTER TABLE "agencies" DROP COLUMN "legacy_id";
  ALTER TABLE "conventions" DROP COLUMN "legacy_id";`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "influencers" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "experts" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "brands" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "locations" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "awards" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "award_shows" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "creator_challenges" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "social_media_campaigns" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "network_events" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "certified_influencers" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "agencies" ADD COLUMN "legacy_id" numeric;
  ALTER TABLE "conventions" ADD COLUMN "legacy_id" numeric;`);
}
