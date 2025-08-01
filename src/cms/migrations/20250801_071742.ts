import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "i18n_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"locale" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'translations',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  DROP INDEX "locale_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "i18n_messages_id" integer;
  CREATE INDEX "i18n_messages_updated_at_idx" ON "i18n_messages" USING btree ("updated_at");
  CREATE INDEX "i18n_messages_created_at_idx" ON "i18n_messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "i18n_messages_filename_idx" ON "i18n_messages" USING btree ("filename");
  CREATE INDEX "locale_idx" ON "i18n_messages" USING btree ("locale");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_i18n_messages_fk" FOREIGN KEY ("i18n_messages_id") REFERENCES "public"."i18n_messages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "locale_1_idx" ON "polyglot_messages" USING btree ("locale");
  CREATE INDEX "payload_locked_documents_rels_i18n_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("i18n_messages_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "i18n_messages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "i18n_messages" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_i18n_messages_fk";
  
  DROP INDEX "locale_1_idx";
  DROP INDEX "payload_locked_documents_rels_i18n_messages_id_idx";
  CREATE INDEX "locale_idx" ON "polyglot_messages" USING btree ("locale");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "i18n_messages_id";`);
}
