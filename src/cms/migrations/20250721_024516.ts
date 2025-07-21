import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "award_shows_locales" (
  	"description" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "conventions_locales" (
  	"description" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "award_shows" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "award_shows_locales" ADD CONSTRAINT "award_shows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."award_shows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conventions_locales" ADD CONSTRAINT "conventions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conventions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "award_shows_locales_locale_parent_id_unique" ON "award_shows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "conventions_locales_locale_parent_id_unique" ON "conventions_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "conventions" DROP COLUMN "title";`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "award_shows_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "conventions_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "award_shows_locales" CASCADE;
  DROP TABLE "conventions_locales" CASCADE;
  ALTER TABLE "award_shows" ALTER COLUMN "date" DROP NOT NULL;
  ALTER TABLE "conventions" ADD COLUMN "title" varchar NOT NULL;`);
}
