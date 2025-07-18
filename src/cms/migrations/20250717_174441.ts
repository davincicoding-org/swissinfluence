import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "publish_queue" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_type" varchar NOT NULL,
  	"entity_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "publish_queue_id" integer;
  CREATE INDEX "publish_queue_updated_at_idx" ON "publish_queue" USING btree ("updated_at");
  CREATE INDEX "publish_queue_created_at_idx" ON "publish_queue" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publish_queue_fk" FOREIGN KEY ("publish_queue_id") REFERENCES "public"."publish_queue"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_publish_queue_id_idx" ON "payload_locked_documents_rels" USING btree ("publish_queue_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "publish_queue" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "publish_queue" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_publish_queue_fk";
  
  DROP INDEX "payload_locked_documents_rels_publish_queue_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "publish_queue_id";`);
}
