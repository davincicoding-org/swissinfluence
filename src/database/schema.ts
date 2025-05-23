import type { ImageAsset } from "@davincicoding/cms/image";
import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

import { LanguageCodeSchema } from "@/utils/languages";

import { CantonEnum, LanguageCodeEnum } from "./enums";

// MARK: JSON Schemas

const socialPlatformEnum = z.enum([
  "INSTAGRAM",
  "TIKTOK",
  "YOUTUBE",
  "LINKEDIN",
  "TWITTER",
  "TWITCH",
  "WEBSITE",
  "SPOTIFY",
  "APPLE_PODCASTS",
]);

const socialSchema = z.object({
  platform: socialPlatformEnum,
  url: z.url(),
});

type Social = z.infer<typeof socialSchema>;

type Translatable = Record<string, string>;

// MARK: CMS

export const globals = pgTable(
  "globals",
  (d) => ({
    id: d.serial().primaryKey(),
    name: d.text().notNull(),
    data: d.jsonb().notNull(),
  }),
  (t) => [uniqueIndex("globals_name_unique").on(t.name)],
);

export const images = pgTable("images", (d) => ({
  id: d.serial().primaryKey(),
  src: d.text().notNull(),
  height: d.smallint().notNull(),
  width: d.smallint().notNull(),
  blurDataURL: d.text().notNull(),
}));

export const videos = pgTable("videos", (d) => ({
  id: d.serial().primaryKey(),
  src: d.text().notNull(),
}));

// MARK: Locations

export const locations = pgTable("locations", (d) => ({
  id: d.serial().primaryKey(),
  title: d.text().notNull().unique(),
  city: d.text().notNull(),
  maps: d.text().notNull(),
}));

// MARK: Categories

export const categories = pgTable("categories", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
}));

export const categoryRelations = relations(categories, ({ one }) => ({}));

// MARK: Influencers

export const influencers = pgTable("influencers", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  name: d.text().notNull(),
  socials: d.jsonb().$type<Social>().array().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
}));

export const influencerCategories = pgTable("influencer_categories", (d) => ({
  id: d.serial().primaryKey(),
  influencer: d
    .integer()
    .references(() => influencers.id)
    .notNull(),
  category: d
    .integer()
    .references(() => categories.id)
    .notNull(),
}));

export const influencerCategoryRelations = relations(
  influencerCategories,
  ({ one }) => ({
    influencer: one(influencers, {
      fields: [influencerCategories.influencer],
      references: [influencers.id],
    }),
    category: one(categories, {
      fields: [influencerCategories.category],
      references: [categories.id],
    }),
  }),
);

export const influencerRelations = relations(influencers, ({ many }) => ({
  interests: many(influencerCategories),
}));

// MARK: Certified Influencers

export const residenceEnum = pgEnum(
  "residence",
  CantonEnum.options as [string, ...string[]],
);

export const languageEnum = pgEnum(
  "language",
  LanguageCodeEnum.options as [string, ...string[]],
);
export const certifiedInfluencers = pgTable("certified_influencers", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  influencer: d
    .integer()
    .references(() => influencers.id)
    .notNull()
    .unique(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
  birthdate: d.date().notNull(),
  residence: residenceEnum().notNull(),
  languages: languageEnum().array().notNull(),
  bio: d.jsonb().$type<Translatable>().notNull(),
  otherInterests: d.jsonb().$type<Translatable>(),
}));

export const certifiedInfluencerRelations = relations(
  certifiedInfluencers,
  ({ one }) => ({
    influencer: one(influencers, {
      fields: [certifiedInfluencers.influencer],
      references: [influencers.id],
    }),
  }),
);

// MARK: Experts

export const experts = pgTable("experts", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  name: d.text().notNull(),
  description: d.jsonb().$type<Translatable>().notNull(),
  socials: d.jsonb().$type<Social>().array().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
}));

export const expertRelations = relations(experts, ({ one }) => ({}));

// MARK: Brands

export const brands = pgTable("brands", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  name: d.text().notNull().unique(),
  website: d.text().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
}));

export const brandRelations = relations(brands, ({ one }) => ({}));

// MARK: Awards

export const awards = pgTable("awards", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  year: d.smallint().notNull(),
  nominationDeadline: d.date(),
  nominationUrl: d.text(),
  newcomerScoutDeadline: d.date(),
  newcomerScoutUrl: d.text(),
  votingDeadline: d.date(),
}));

export const awardRelations = relations(awards, ({ many, one }) => ({
  partners: many(awardPartners),
  jury: many(awardJuryMembers),
  categories: many(awardCategories),
  nominees: many(awardNominees),
  show: one(awardShows, {
    fields: [awards.id],
    references: [awardShows.id],
  }),
  categoryRankings: many(awardCategoryRankings),
}));

// MARK: Award Categories

export const awardCategories = pgTable("award_categories", (d) => ({
  id: d.serial().primaryKey(),
  category: d
    .integer()
    .references(() => categories.id)
    .notNull(),
  award: d
    .integer()
    .references(() => awards.id)
    .notNull(),
  sponsor: d
    .integer()
    .references(() => brands.id)
    .notNull(),
}));

export const awardCategoryRelations = relations(awardCategories, ({ one }) => ({
  award: one(awards, {
    fields: [awardCategories.award],
    references: [awards.id],
  }),
  sponsor: one(brands, {
    fields: [awardCategories.sponsor],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [awardCategories.category],
    references: [categories.id],
  }),
}));

// MARK: Award Jury Members

export const awardJuryMembers = pgTable("award_jury_members", (d) => ({
  id: d.serial().primaryKey(),
  ordinal: d.smallint().notNull(),
  award: d
    .integer()
    .references(() => awards.id)
    .notNull(),
  expert: d
    .integer()
    .references(() => experts.id)
    .notNull(),
}));

export const awardJuryMemberRelations = relations(
  awardJuryMembers,
  ({ one }) => ({
    award: one(awards, {
      fields: [awardJuryMembers.award],
      references: [awards.id],
    }),
    expert: one(experts, {
      fields: [awardJuryMembers.expert],
      references: [experts.id],
    }),
  }),
);

// MARK: Award Nominees

export const awardNominees = pgTable("award_nominees", (d) => ({
  id: d.serial().primaryKey(),
  award: d
    .integer()
    .references(() => awards.id)
    .notNull(),
  category: d
    .integer()
    .references(() => categories.id)
    .notNull(),
  influencer: d
    .integer()
    .references(() => influencers.id)
    .notNull(),
}));

export const awardNomineeRelations = relations(awardNominees, ({ one }) => ({
  award: one(awards, {
    fields: [awardNominees.award],
    references: [awards.id],
  }),
  category: one(categories, {
    fields: [awardNominees.category],
    references: [categories.id],
  }),
  influencer: one(influencers, {
    fields: [awardNominees.influencer],
    references: [influencers.id],
  }),
}));

// MARK: Award Partners

export const awardPartners = pgTable("award_partners", (d) => ({
  id: d.serial().primaryKey(),
  ordinal: d.smallint().notNull(),
  award: d
    .integer()
    .references(() => awards.id)
    .notNull(),
  brand: d
    .integer()
    .references(() => brands.id)
    .notNull(),
}));

export const awardPartnerRelations = relations(awardPartners, ({ one }) => ({
  award: one(awards, {
    fields: [awardPartners.award],
    references: [awards.id],
  }),
  brand: one(brands, {
    fields: [awardPartners.brand],
    references: [brands.id],
  }),
}));

// MARK: Award Shows

export const awardShows = pgTable("award_shows", (d) => ({
  id: d.serial().primaryKey(),
  date: d.date().notNull(),
  award: d
    .integer()
    .references(() => awards.id)
    .notNull(),
  location: d
    .integer()
    .references(() => locations.id)
    .notNull(),
  tickets: d.text(),
  video: d.text(),
  // impressions -> one-to-many with images
  // schedule
}));

export const awardShowRelations = relations(awardShows, ({ one }) => ({
  award: one(awards, {
    fields: [awardShows.award],
    references: [awards.id],
  }),
  location: one(locations, {
    fields: [awardShows.location],
    references: [locations.id],
  }),
}));

// MARK: Award Category Rankings

export const awardCategoryRankings = pgTable(
  "award_category_rankings",
  (d) => ({
    id: d.serial().primaryKey(),
    award: d
      .integer()
      .references(() => awards.id)
      .notNull(),
    category: d
      .integer()
      .references(() => categories.id)
      .notNull(),
    winner: d.jsonb().$type<ImageAsset>(),
    // nominees -> many-to-many with influencers
  }),
);

export const awardCategoryRankingRelations = relations(
  awardCategoryRankings,
  ({ one }) => ({
    award: one(awards, {
      fields: [awardCategoryRankings.award],
      references: [awards.id],
    }),
    category: one(categories, {
      fields: [awardCategoryRankings.category],
      references: [categories.id],
    }),
  }),
);
// MARK: Creator Challenges

export const creatorChallenges = pgTable("creator_challenges", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  content: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
  organizer: d
    .integer()
    .references(() => brands.id)
    .notNull(),
  location: d.integer().references(() => locations.id),
  start: d.date(),
  end: d.date(),
  registration: d.text(),
}));

export const creatorChallengeRelations = relations(
  creatorChallenges,
  ({ one }) => ({
    organization: one(brands, {
      fields: [creatorChallenges.organizer],
      references: [brands.id],
    }),
  }),
);

// Network Events

export const networkEvents = pgTable("network_events", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  content: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
  location: d
    .integer()
    .references(() => locations.id)
    .notNull(),
  start: d.date(),
  end: d.date(),
  tickets: d.text(),
}));

export const networkEventRelations = relations(networkEvents, ({ one }) => ({
  location: one(locations, {
    fields: [networkEvents.location],
    references: [locations.id],
  }),
}));

// MARK: Social Media Campaigns

export const socialMediaCampaigns = pgTable("social_media_campaigns", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  content: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
  organizer: d
    .integer()
    .references(() => brands.id)
    .notNull(),
  location: d.integer().references(() => locations.id),
  start: d.date(),
  end: d.date(),
  registration: d.text(),
}));

export const socialMediaCampaignRelations = relations(
  socialMediaCampaigns,
  ({ one }) => ({
    organization: one(brands, {
      fields: [socialMediaCampaigns.organizer],
      references: [brands.id],
    }),
    location: one(locations, {
      fields: [socialMediaCampaigns.location],
      references: [locations.id],
    }),
  }),
);

// MARK: Agencies

export const agencies = pgTable("agencies", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  name: d.text().notNull(),
  description: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
  logo: d.jsonb().$type<ImageAsset>().notNull(),
  website: d.text().notNull(),
  email: d.text().notNull(),
}));

export const agencyRelations = relations(agencies, ({ one }) => ({}));

// MARK: Conventions

export type ConventionSchedule = {
  title: Translatable;
  room: string | null;
  start: Date;
  end: Date;
  description: Translatable;
}[];

export const conventions = pgTable("conventions", (d) => ({
  firebase_id: d.text().notNull(),
  id: d.serial().primaryKey(),
  title: d.text().notNull(),
  date: d.date().notNull(),
  location: d
    .integer()
    .references(() => locations.id)
    .notNull(),
  tickets: d.text(),
  schedule: d.jsonb().$type<ConventionSchedule>(),
}));

export const conventionRelations = relations(conventions, ({ many, one }) => ({
  partners: many(conventionPartners),
  location: one(locations, {
    fields: [conventions.location],
    references: [locations.id],
  }),
}));

// MARK: Convention Partners

export const conventionPartners = pgTable(
  "convention_partners",
  (d) => ({
    id: d.serial().primaryKey(),
    convention: d
      .integer()
      .references(() => conventions.id)
      .notNull(),
    brand: d
      .integer()
      .references(() => brands.id)
      .notNull(),
  }),
  (t) => [index("idx_convention_partner").on(t.convention)],
);

export const conventionPartnerRelations = relations(
  conventionPartners,
  ({ one }) => ({
    convention: one(conventions, {
      fields: [conventionPartners.convention],
      references: [conventions.id],
    }),
    brand: one(brands, {
      fields: [conventionPartners.brand],
      references: [brands.id],
    }),
  }),
);
