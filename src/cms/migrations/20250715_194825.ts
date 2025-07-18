import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "influencers" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "experts" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "brands" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "locations" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "awards" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "award_shows" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "creator_challenges" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "social_media_campaigns" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "network_events" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "certified_influencers" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "agencies" ALTER COLUMN "legacy_id" DROP NOT NULL;
  ALTER TABLE "conventions" ALTER COLUMN "legacy_id" DROP NOT NULL;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "influencers" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "experts" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "brands" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "locations" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "awards" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "award_shows" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "creator_challenges" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "social_media_campaigns" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "network_events" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "certified_influencers" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "agencies" ALTER COLUMN "legacy_id" SET NOT NULL;
  ALTER TABLE "conventions" ALTER COLUMN "legacy_id" SET NOT NULL;`);
}
