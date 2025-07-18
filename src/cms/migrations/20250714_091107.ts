import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'de', 'fr', 'it');
  CREATE TYPE "public"."social_platforms" AS ENUM('INSTAGRAM', 'TIKTOK', 'LINKEDIN', 'YOUTUBE', 'APPLE_PODCAST', 'SPOTIFY', 'TWITCH', 'WEBSITE', 'WHATSAPP');
  CREATE TYPE "public"."enum_certified_influencers_languages" AS ENUM('aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh');
  CREATE TYPE "public"."enum_certified_influencers_residence" AS ENUM('AG', 'AR', 'AI', 'BS', 'BL', 'BE', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"access_users" boolean,
  	"access_content" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "photos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"prefix" varchar DEFAULT 'photos',
  	"blurhash" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "logos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar DEFAULT 'logos',
  	"blurhash" varchar,
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
  
  CREATE TABLE "profile_pictures" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar DEFAULT 'profile-pictures',
  	"blurhash" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "influencers_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "social_platforms" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "influencers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "experts_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "social_platforms" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "experts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "experts_locales" (
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"logo_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"website" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "locations_locales" (
  	"city" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "awards_categories_nominees" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"influencer_id" integer NOT NULL
  );
  
  CREATE TABLE "awards_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category_id" integer NOT NULL,
  	"sponsor_id" integer,
  	"winner_image_id" integer
  );
  
  CREATE TABLE "awards_jury" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"expert_id" integer NOT NULL
  );
  
  CREATE TABLE "awards_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL
  );
  
  CREATE TABLE "awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"year" numeric NOT NULL,
  	"newcomer_scout_deadline" timestamp(3) with time zone,
  	"newcomer_scout_url" varchar,
  	"nomination_deadline" timestamp(3) with time zone,
  	"nomination_url" varchar,
  	"voting_deadline" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "award_shows_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"from" timestamp(3) with time zone,
  	"to" timestamp(3) with time zone,
  	"room" varchar
  );
  
  CREATE TABLE "award_shows_schedule_locales" (
  	"description" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "award_shows" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"award_id" integer NOT NULL,
  	"date" timestamp(3) with time zone,
  	"location_id" integer NOT NULL,
  	"registration_url" varchar,
  	"video_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "award_shows_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"photos_id" integer
  );
  
  CREATE TABLE "creator_challenges" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"image_id" integer NOT NULL,
  	"organizer_id" integer NOT NULL,
  	"location_id" integer,
  	"date_from" timestamp(3) with time zone,
  	"date_to" timestamp(3) with time zone,
  	"registration_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "creator_challenges_locales" (
  	"title" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "social_media_campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"image_id" integer NOT NULL,
  	"organizer_id" integer NOT NULL,
  	"location_id" integer,
  	"date_from" timestamp(3) with time zone,
  	"date_to" timestamp(3) with time zone,
  	"registration_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "social_media_campaigns_locales" (
  	"title" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "network_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"logo_id" integer NOT NULL,
  	"image_id" integer NOT NULL,
  	"location_id" integer NOT NULL,
  	"date_from" timestamp(3) with time zone,
  	"date_to" timestamp(3) with time zone,
  	"registration_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "network_events_locales" (
  	"title" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "certified_influencers_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_certified_influencers_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "certified_influencers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"image_id" integer NOT NULL,
  	"birthdate" timestamp(3) with time zone NOT NULL,
  	"residence" "enum_certified_influencers_residence" NOT NULL,
  	"influencer_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "certified_influencers_locales" (
  	"bio" varchar NOT NULL,
  	"interests" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "certified_influencers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "agencies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"logo_id" integer NOT NULL,
  	"image_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"website" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "agencies_locales" (
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "conventions_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"from" timestamp(3) with time zone,
  	"to" timestamp(3) with time zone,
  	"room" varchar
  );
  
  CREATE TABLE "conventions_schedule_locales" (
  	"description" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "conventions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_id" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"location_id" integer NOT NULL,
  	"registration_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "conventions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer
  );
  
  CREATE TABLE "polyglot_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"locale" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"photos_id" integer,
  	"logos_id" integer,
  	"profile_pictures_id" integer,
  	"categories_id" integer,
  	"influencers_id" integer,
  	"experts_id" integer,
  	"brands_id" integer,
  	"locations_id" integer,
  	"awards_id" integer,
  	"award_shows_id" integer,
  	"creator_challenges_id" integer,
  	"social_media_campaigns_id" integer,
  	"network_events_id" integer,
  	"certified_influencers_id" integer,
  	"agencies_id" integer,
  	"conventions_id" integer,
  	"polyglot_messages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "company_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "social_platforms" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "company" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"whatsapp_url" varchar NOT NULL,
  	"contact_url" varchar NOT NULL,
  	"newsletter_url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "network" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"influencer_application_url" varchar NOT NULL,
  	"agency_application_url" varchar NOT NULL,
  	"cooperation_application_url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_photos_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "influencers_socials" ADD CONSTRAINT "influencers_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."influencers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "influencers" ADD CONSTRAINT "influencers_image_id_profile_pictures_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."profile_pictures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experts_socials" ADD CONSTRAINT "experts_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experts" ADD CONSTRAINT "experts_image_id_profile_pictures_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."profile_pictures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experts_locales" ADD CONSTRAINT "experts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_logos_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."logos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_locales" ADD CONSTRAINT "locations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards_categories_nominees" ADD CONSTRAINT "awards_categories_nominees_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_categories_nominees" ADD CONSTRAINT "awards_categories_nominees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards_categories" ADD CONSTRAINT "awards_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_categories" ADD CONSTRAINT "awards_categories_sponsor_id_brands_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_categories" ADD CONSTRAINT "awards_categories_winner_image_id_profile_pictures_id_fk" FOREIGN KEY ("winner_image_id") REFERENCES "public"."profile_pictures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_categories" ADD CONSTRAINT "awards_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards_jury" ADD CONSTRAINT "awards_jury_expert_id_experts_id_fk" FOREIGN KEY ("expert_id") REFERENCES "public"."experts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_jury" ADD CONSTRAINT "awards_jury_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards_partners" ADD CONSTRAINT "awards_partners_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_partners" ADD CONSTRAINT "awards_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "award_shows_schedule" ADD CONSTRAINT "award_shows_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."award_shows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "award_shows_schedule_locales" ADD CONSTRAINT "award_shows_schedule_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."award_shows_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "award_shows" ADD CONSTRAINT "award_shows_award_id_awards_id_fk" FOREIGN KEY ("award_id") REFERENCES "public"."awards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "award_shows" ADD CONSTRAINT "award_shows_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "award_shows_rels" ADD CONSTRAINT "award_shows_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."award_shows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "award_shows_rels" ADD CONSTRAINT "award_shows_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "creator_challenges" ADD CONSTRAINT "creator_challenges_image_id_photos_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "creator_challenges" ADD CONSTRAINT "creator_challenges_organizer_id_brands_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "creator_challenges" ADD CONSTRAINT "creator_challenges_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "creator_challenges_locales" ADD CONSTRAINT "creator_challenges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."creator_challenges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_media_campaigns" ADD CONSTRAINT "social_media_campaigns_image_id_photos_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_media_campaigns" ADD CONSTRAINT "social_media_campaigns_organizer_id_brands_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_media_campaigns" ADD CONSTRAINT "social_media_campaigns_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_media_campaigns_locales" ADD CONSTRAINT "social_media_campaigns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_media_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "network_events" ADD CONSTRAINT "network_events_logo_id_logos_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."logos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "network_events" ADD CONSTRAINT "network_events_image_id_photos_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "network_events" ADD CONSTRAINT "network_events_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "network_events_locales" ADD CONSTRAINT "network_events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."network_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certified_influencers_languages" ADD CONSTRAINT "certified_influencers_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."certified_influencers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certified_influencers" ADD CONSTRAINT "certified_influencers_image_id_photos_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certified_influencers" ADD CONSTRAINT "certified_influencers_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certified_influencers_locales" ADD CONSTRAINT "certified_influencers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."certified_influencers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certified_influencers_rels" ADD CONSTRAINT "certified_influencers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."certified_influencers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certified_influencers_rels" ADD CONSTRAINT "certified_influencers_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agencies" ADD CONSTRAINT "agencies_logo_id_logos_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."logos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agencies" ADD CONSTRAINT "agencies_image_id_photos_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agencies_locales" ADD CONSTRAINT "agencies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conventions_schedule" ADD CONSTRAINT "conventions_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conventions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conventions_schedule_locales" ADD CONSTRAINT "conventions_schedule_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conventions_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conventions" ADD CONSTRAINT "conventions_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conventions_rels" ADD CONSTRAINT "conventions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."conventions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conventions_rels" ADD CONSTRAINT "conventions_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_profile_pictures_fk" FOREIGN KEY ("profile_pictures_id") REFERENCES "public"."profile_pictures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_influencers_fk" FOREIGN KEY ("influencers_id") REFERENCES "public"."influencers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experts_fk" FOREIGN KEY ("experts_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_award_shows_fk" FOREIGN KEY ("award_shows_id") REFERENCES "public"."award_shows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_creator_challenges_fk" FOREIGN KEY ("creator_challenges_id") REFERENCES "public"."creator_challenges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_media_campaigns_fk" FOREIGN KEY ("social_media_campaigns_id") REFERENCES "public"."social_media_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_network_events_fk" FOREIGN KEY ("network_events_id") REFERENCES "public"."network_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certified_influencers_fk" FOREIGN KEY ("certified_influencers_id") REFERENCES "public"."certified_influencers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_agencies_fk" FOREIGN KEY ("agencies_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conventions_fk" FOREIGN KEY ("conventions_id") REFERENCES "public"."conventions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_polyglot_messages_fk" FOREIGN KEY ("polyglot_messages_id") REFERENCES "public"."polyglot_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_socials" ADD CONSTRAINT "company_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "photos_updated_at_idx" ON "photos" USING btree ("updated_at");
  CREATE INDEX "photos_created_at_idx" ON "photos" USING btree ("created_at");
  CREATE UNIQUE INDEX "photos_filename_idx" ON "photos" USING btree ("filename");
  CREATE INDEX "photos_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "photos" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "photos_sizes_og_sizes_og_filename_idx" ON "photos" USING btree ("sizes_og_filename");
  CREATE INDEX "logos_updated_at_idx" ON "logos" USING btree ("updated_at");
  CREATE INDEX "logos_created_at_idx" ON "logos" USING btree ("created_at");
  CREATE UNIQUE INDEX "logos_filename_idx" ON "logos" USING btree ("filename");
  CREATE INDEX "profile_pictures_updated_at_idx" ON "profile_pictures" USING btree ("updated_at");
  CREATE INDEX "profile_pictures_created_at_idx" ON "profile_pictures" USING btree ("created_at");
  CREATE UNIQUE INDEX "profile_pictures_filename_idx" ON "profile_pictures" USING btree ("filename");
  CREATE INDEX "profile_pictures_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "profile_pictures" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "influencers_socials_order_idx" ON "influencers_socials" USING btree ("_order");
  CREATE INDEX "influencers_socials_parent_id_idx" ON "influencers_socials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "influencers_name_idx" ON "influencers" USING btree ("name");
  CREATE INDEX "influencers_image_idx" ON "influencers" USING btree ("image_id");
  CREATE INDEX "influencers_updated_at_idx" ON "influencers" USING btree ("updated_at");
  CREATE INDEX "influencers_created_at_idx" ON "influencers" USING btree ("created_at");
  CREATE INDEX "experts_socials_order_idx" ON "experts_socials" USING btree ("_order");
  CREATE INDEX "experts_socials_parent_id_idx" ON "experts_socials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "experts_name_idx" ON "experts" USING btree ("name");
  CREATE INDEX "experts_image_idx" ON "experts" USING btree ("image_id");
  CREATE INDEX "experts_updated_at_idx" ON "experts" USING btree ("updated_at");
  CREATE INDEX "experts_created_at_idx" ON "experts" USING btree ("created_at");
  CREATE UNIQUE INDEX "experts_locales_locale_parent_id_unique" ON "experts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE UNIQUE INDEX "brands_name_idx" ON "brands" USING btree ("name");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE UNIQUE INDEX "locations_name_idx" ON "locations" USING btree ("name");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE UNIQUE INDEX "locations_locales_locale_parent_id_unique" ON "locations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "awards_categories_nominees_order_idx" ON "awards_categories_nominees" USING btree ("_order");
  CREATE INDEX "awards_categories_nominees_parent_id_idx" ON "awards_categories_nominees" USING btree ("_parent_id");
  CREATE INDEX "awards_categories_nominees_influencer_idx" ON "awards_categories_nominees" USING btree ("influencer_id");
  CREATE INDEX "awards_categories_order_idx" ON "awards_categories" USING btree ("_order");
  CREATE INDEX "awards_categories_parent_id_idx" ON "awards_categories" USING btree ("_parent_id");
  CREATE INDEX "awards_categories_category_idx" ON "awards_categories" USING btree ("category_id");
  CREATE INDEX "awards_categories_sponsor_idx" ON "awards_categories" USING btree ("sponsor_id");
  CREATE INDEX "awards_categories_winner_image_idx" ON "awards_categories" USING btree ("winner_image_id");
  CREATE INDEX "awards_jury_order_idx" ON "awards_jury" USING btree ("_order");
  CREATE INDEX "awards_jury_parent_id_idx" ON "awards_jury" USING btree ("_parent_id");
  CREATE INDEX "awards_jury_expert_idx" ON "awards_jury" USING btree ("expert_id");
  CREATE INDEX "awards_partners_order_idx" ON "awards_partners" USING btree ("_order");
  CREATE INDEX "awards_partners_parent_id_idx" ON "awards_partners" USING btree ("_parent_id");
  CREATE INDEX "awards_partners_brand_idx" ON "awards_partners" USING btree ("brand_id");
  CREATE INDEX "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "awards" USING btree ("created_at");
  CREATE INDEX "award_shows_schedule_order_idx" ON "award_shows_schedule" USING btree ("_order");
  CREATE INDEX "award_shows_schedule_parent_id_idx" ON "award_shows_schedule" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "award_shows_schedule_locales_locale_parent_id_unique" ON "award_shows_schedule_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "award_shows_award_idx" ON "award_shows" USING btree ("award_id");
  CREATE INDEX "award_shows_location_idx" ON "award_shows" USING btree ("location_id");
  CREATE INDEX "award_shows_updated_at_idx" ON "award_shows" USING btree ("updated_at");
  CREATE INDEX "award_shows_created_at_idx" ON "award_shows" USING btree ("created_at");
  CREATE INDEX "award_shows_rels_order_idx" ON "award_shows_rels" USING btree ("order");
  CREATE INDEX "award_shows_rels_parent_idx" ON "award_shows_rels" USING btree ("parent_id");
  CREATE INDEX "award_shows_rels_path_idx" ON "award_shows_rels" USING btree ("path");
  CREATE INDEX "award_shows_rels_photos_id_idx" ON "award_shows_rels" USING btree ("photos_id");
  CREATE INDEX "creator_challenges_image_idx" ON "creator_challenges" USING btree ("image_id");
  CREATE INDEX "creator_challenges_organizer_idx" ON "creator_challenges" USING btree ("organizer_id");
  CREATE INDEX "creator_challenges_location_idx" ON "creator_challenges" USING btree ("location_id");
  CREATE INDEX "creator_challenges_updated_at_idx" ON "creator_challenges" USING btree ("updated_at");
  CREATE INDEX "creator_challenges_created_at_idx" ON "creator_challenges" USING btree ("created_at");
  CREATE UNIQUE INDEX "creator_challenges_locales_locale_parent_id_unique" ON "creator_challenges_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "social_media_campaigns_image_idx" ON "social_media_campaigns" USING btree ("image_id");
  CREATE INDEX "social_media_campaigns_organizer_idx" ON "social_media_campaigns" USING btree ("organizer_id");
  CREATE INDEX "social_media_campaigns_location_idx" ON "social_media_campaigns" USING btree ("location_id");
  CREATE INDEX "social_media_campaigns_updated_at_idx" ON "social_media_campaigns" USING btree ("updated_at");
  CREATE INDEX "social_media_campaigns_created_at_idx" ON "social_media_campaigns" USING btree ("created_at");
  CREATE UNIQUE INDEX "social_media_campaigns_locales_locale_parent_id_unique" ON "social_media_campaigns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "network_events_logo_idx" ON "network_events" USING btree ("logo_id");
  CREATE INDEX "network_events_image_idx" ON "network_events" USING btree ("image_id");
  CREATE INDEX "network_events_location_idx" ON "network_events" USING btree ("location_id");
  CREATE INDEX "network_events_updated_at_idx" ON "network_events" USING btree ("updated_at");
  CREATE INDEX "network_events_created_at_idx" ON "network_events" USING btree ("created_at");
  CREATE UNIQUE INDEX "network_events_locales_locale_parent_id_unique" ON "network_events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "certified_influencers_languages_order_idx" ON "certified_influencers_languages" USING btree ("order");
  CREATE INDEX "certified_influencers_languages_parent_idx" ON "certified_influencers_languages" USING btree ("parent_id");
  CREATE INDEX "certified_influencers_image_idx" ON "certified_influencers" USING btree ("image_id");
  CREATE INDEX "certified_influencers_influencer_idx" ON "certified_influencers" USING btree ("influencer_id");
  CREATE INDEX "certified_influencers_updated_at_idx" ON "certified_influencers" USING btree ("updated_at");
  CREATE INDEX "certified_influencers_created_at_idx" ON "certified_influencers" USING btree ("created_at");
  CREATE UNIQUE INDEX "certified_influencers_locales_locale_parent_id_unique" ON "certified_influencers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "certified_influencers_rels_order_idx" ON "certified_influencers_rels" USING btree ("order");
  CREATE INDEX "certified_influencers_rels_parent_idx" ON "certified_influencers_rels" USING btree ("parent_id");
  CREATE INDEX "certified_influencers_rels_path_idx" ON "certified_influencers_rels" USING btree ("path");
  CREATE INDEX "certified_influencers_rels_categories_id_idx" ON "certified_influencers_rels" USING btree ("categories_id");
  CREATE INDEX "agencies_logo_idx" ON "agencies" USING btree ("logo_id");
  CREATE INDEX "agencies_image_idx" ON "agencies" USING btree ("image_id");
  CREATE INDEX "agencies_updated_at_idx" ON "agencies" USING btree ("updated_at");
  CREATE INDEX "agencies_created_at_idx" ON "agencies" USING btree ("created_at");
  CREATE UNIQUE INDEX "agencies_locales_locale_parent_id_unique" ON "agencies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "conventions_schedule_order_idx" ON "conventions_schedule" USING btree ("_order");
  CREATE INDEX "conventions_schedule_parent_id_idx" ON "conventions_schedule" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "conventions_schedule_locales_locale_parent_id_unique" ON "conventions_schedule_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "conventions_location_idx" ON "conventions" USING btree ("location_id");
  CREATE INDEX "conventions_updated_at_idx" ON "conventions" USING btree ("updated_at");
  CREATE INDEX "conventions_created_at_idx" ON "conventions" USING btree ("created_at");
  CREATE INDEX "conventions_rels_order_idx" ON "conventions_rels" USING btree ("order");
  CREATE INDEX "conventions_rels_parent_idx" ON "conventions_rels" USING btree ("parent_id");
  CREATE INDEX "conventions_rels_path_idx" ON "conventions_rels" USING btree ("path");
  CREATE INDEX "conventions_rels_brands_id_idx" ON "conventions_rels" USING btree ("brands_id");
  CREATE INDEX "polyglot_messages_updated_at_idx" ON "polyglot_messages" USING btree ("updated_at");
  CREATE INDEX "polyglot_messages_created_at_idx" ON "polyglot_messages" USING btree ("created_at");
  CREATE INDEX "locale_idx" ON "polyglot_messages" USING btree ("locale");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("photos_id");
  CREATE INDEX "payload_locked_documents_rels_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("logos_id");
  CREATE INDEX "payload_locked_documents_rels_profile_pictures_id_idx" ON "payload_locked_documents_rels" USING btree ("profile_pictures_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_influencers_id_idx" ON "payload_locked_documents_rels" USING btree ("influencers_id");
  CREATE INDEX "payload_locked_documents_rels_experts_id_idx" ON "payload_locked_documents_rels" USING btree ("experts_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("awards_id");
  CREATE INDEX "payload_locked_documents_rels_award_shows_id_idx" ON "payload_locked_documents_rels" USING btree ("award_shows_id");
  CREATE INDEX "payload_locked_documents_rels_creator_challenges_id_idx" ON "payload_locked_documents_rels" USING btree ("creator_challenges_id");
  CREATE INDEX "payload_locked_documents_rels_social_media_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("social_media_campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_network_events_id_idx" ON "payload_locked_documents_rels" USING btree ("network_events_id");
  CREATE INDEX "payload_locked_documents_rels_certified_influencers_id_idx" ON "payload_locked_documents_rels" USING btree ("certified_influencers_id");
  CREATE INDEX "payload_locked_documents_rels_agencies_id_idx" ON "payload_locked_documents_rels" USING btree ("agencies_id");
  CREATE INDEX "payload_locked_documents_rels_conventions_id_idx" ON "payload_locked_documents_rels" USING btree ("conventions_id");
  CREATE INDEX "payload_locked_documents_rels_polyglot_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("polyglot_messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "company_socials_order_idx" ON "company_socials" USING btree ("_order");
  CREATE INDEX "company_socials_parent_id_idx" ON "company_socials" USING btree ("_parent_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "photos" CASCADE;
  DROP TABLE "logos" CASCADE;
  DROP TABLE "profile_pictures" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "influencers_socials" CASCADE;
  DROP TABLE "influencers" CASCADE;
  DROP TABLE "experts_socials" CASCADE;
  DROP TABLE "experts" CASCADE;
  DROP TABLE "experts_locales" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "locations_locales" CASCADE;
  DROP TABLE "awards_categories_nominees" CASCADE;
  DROP TABLE "awards_categories" CASCADE;
  DROP TABLE "awards_jury" CASCADE;
  DROP TABLE "awards_partners" CASCADE;
  DROP TABLE "awards" CASCADE;
  DROP TABLE "award_shows_schedule" CASCADE;
  DROP TABLE "award_shows_schedule_locales" CASCADE;
  DROP TABLE "award_shows" CASCADE;
  DROP TABLE "award_shows_rels" CASCADE;
  DROP TABLE "creator_challenges" CASCADE;
  DROP TABLE "creator_challenges_locales" CASCADE;
  DROP TABLE "social_media_campaigns" CASCADE;
  DROP TABLE "social_media_campaigns_locales" CASCADE;
  DROP TABLE "network_events" CASCADE;
  DROP TABLE "network_events_locales" CASCADE;
  DROP TABLE "certified_influencers_languages" CASCADE;
  DROP TABLE "certified_influencers" CASCADE;
  DROP TABLE "certified_influencers_locales" CASCADE;
  DROP TABLE "certified_influencers_rels" CASCADE;
  DROP TABLE "agencies" CASCADE;
  DROP TABLE "agencies_locales" CASCADE;
  DROP TABLE "conventions_schedule" CASCADE;
  DROP TABLE "conventions_schedule_locales" CASCADE;
  DROP TABLE "conventions" CASCADE;
  DROP TABLE "conventions_rels" CASCADE;
  DROP TABLE "polyglot_messages" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "company_socials" CASCADE;
  DROP TABLE "company" CASCADE;
  DROP TABLE "network" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."social_platforms";
  DROP TYPE "public"."enum_certified_influencers_languages";
  DROP TYPE "public"."enum_certified_influencers_residence";`);
}
