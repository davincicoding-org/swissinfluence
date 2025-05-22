import type { ImageAsset } from "@davincicoding/cms/image";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

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

// MARK: Locations

export const locations = pgTable("locations", (d) => ({
  id: d.serial().primaryKey(),
  title: d.text().notNull(),
  city: d.text().notNull(),
  mapsUrl: d.text().notNull(),
}));

// MARK: Categories

export const categories = pgTable("categories", (d) => ({
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
}));

export const categoryRelations = relations(categories, ({ one }) => ({}));

// MARK: Influencers

export const influencers = pgTable("influencers", (d) => ({
  id: d.serial().primaryKey(),
  name: d.text().notNull(),
  socials: d.jsonb().$type<Social>().array().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
}));

export const influencerRelations = relations(influencers, ({ one }) => ({}));

// MARK: Certified Influencers

export const residenceEnum = pgEnum("residence", [
  "AG",
  "AR",
  "AI",
  "BS",
  "BL",
  "BE",
  "FR",
  "GE",
  "GL",
  "GR",
  "JU",
  "LU",
  "NE",
  "NW",
  "OW",
  "SG",
  "SH",
  "SO",
  "SZ",
  "TG",
  "TI",
  "UR",
  "VD",
  "VS",
  "ZG",
  "ZH",
]);

export const languageEnum = pgEnum("language", ["DE", "EN", "FR", "IT", "RM"]);
export const certifiedInfluencers = pgTable("certified_influencers", (d) => ({
  id: d.serial().primaryKey(),
  influencerId: d
    .serial()
    .references(() => influencers.id)
    .notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
  birthdate: d.date().notNull(),
  residence: residenceEnum().notNull(),
  languages: languageEnum().array().notNull(),
  bio: d.jsonb().$type<Translatable>().notNull(),
  otherInterests: d.jsonb().$type<Translatable>(),

  // interests -> many to many with categories
}));

export const certifiedInfluencerRelations = relations(
  certifiedInfluencers,
  ({ one }) => ({
    influencer: one(influencers, {
      fields: [certifiedInfluencers.influencerId],
      references: [influencers.id],
    }),
  }),
);

// MARK: Experts

export const experts = pgTable("experts", (d) => ({
  id: d.serial().primaryKey(),
  name: d.text().notNull(),
  description: d.jsonb().$type<Translatable>().notNull(),
  socials: d.jsonb().$type<Social>().array().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
}));

export const expertRelations = relations(experts, ({ one }) => ({}));

// MARK: Brands

export const brands = pgTable("brands", (d) => ({
  id: d.serial().primaryKey(),
  name: d.text().notNull(),
  url: d.text().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
}));

export const brandRelations = relations(brands, ({ one }) => ({}));

// MARK: Awards

export const awards = pgTable("awards", (d) => ({
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
  categoryId: d
    .serial()
    .references(() => categories.id)
    .notNull(),
  awardId: d
    .serial()
    .references(() => awards.id)
    .notNull(),
  sponsorId: d
    .serial()
    .references(() => brands.id)
    .notNull(),
}));

export const awardCategoryRelations = relations(awardCategories, ({ one }) => ({
  award: one(awards, {
    fields: [awardCategories.awardId],
    references: [awards.id],
  }),
  sponsor: one(brands, {
    fields: [awardCategories.sponsorId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [awardCategories.categoryId],
    references: [categories.id],
  }),
}));

// MARK: Award Jury Members

export const awardJuryMembers = pgTable("award_jury_members", (d) => ({
  id: d.serial().primaryKey(),
  ordinal: d.smallint().notNull(),
  awardId: d
    .serial()
    .references(() => awards.id)
    .notNull(),
  expertId: d
    .serial()
    .references(() => experts.id)
    .notNull(),
}));

export const awardJuryMemberRelations = relations(
  awardJuryMembers,
  ({ one }) => ({
    award: one(awards, {
      fields: [awardJuryMembers.awardId],
      references: [awards.id],
    }),
    expert: one(experts, {
      fields: [awardJuryMembers.expertId],
      references: [experts.id],
    }),
  }),
);

// MARK: Award Nominees

export const awardNominees = pgTable("award_nominees", (d) => ({
  id: d.serial().primaryKey(),
  awardId: d
    .serial()
    .references(() => awards.id)
    .notNull(),
  categoryId: d
    .serial()
    .references(() => categories.id)
    .notNull(),
  influencerId: d
    .serial()
    .references(() => influencers.id)
    .notNull(),
}));

export const awardNomineeRelations = relations(awardNominees, ({ one }) => ({
  award: one(awards, {
    fields: [awardNominees.awardId],
    references: [awards.id],
  }),
  category: one(categories, {
    fields: [awardNominees.categoryId],
    references: [categories.id],
  }),
  influencer: one(influencers, {
    fields: [awardNominees.influencerId],
    references: [influencers.id],
  }),
}));

// MARK: Award Partners

export const awardPartners = pgTable("award_partners", (d) => ({
  id: d.serial().primaryKey(),
  ordinal: d.smallint().notNull(),
  awardId: d
    .serial()
    .references(() => awards.id)
    .notNull(),
  brandId: d
    .serial()
    .references(() => brands.id)
    .notNull(),
}));

export const awardPartnerRelations = relations(awardPartners, ({ one }) => ({
  award: one(awards, {
    fields: [awardPartners.awardId],
    references: [awards.id],
  }),
  brand: one(brands, {
    fields: [awardPartners.brandId],
    references: [brands.id],
  }),
}));

// MARK: Award Shows

export const awardShows = pgTable("award_shows", (d) => ({
  id: d.serial().primaryKey(),
  date: d.date().notNull(),
  awardId: d
    .serial()
    .references(() => awards.id)
    .notNull(),
  locationId: d
    .serial()
    .references(() => locations.id)
    .notNull(),
  ticketUrl: d.text(),
  afterMovieUrl: d.text(),
  // impressions -> one-to-many with images
  // schedule
}));

export const awardShowRelations = relations(awardShows, ({ one }) => ({
  award: one(awards, {
    fields: [awardShows.awardId],
    references: [awards.id],
  }),
  location: one(locations, {
    fields: [awardShows.locationId],
    references: [locations.id],
  }),
}));

// MARK: Award Category Rankings

export const awardCategoryRankings = pgTable(
  "award_category_rankings",
  (d) => ({
    id: d.serial().primaryKey(),
    awardId: d
      .serial()
      .references(() => awards.id)
      .notNull(),
    categoryId: d
      .serial()
      .references(() => categories.id)
      .notNull(),
    winnerImage: d.jsonb().$type<ImageAsset>(),
    // nominees -> many-to-many with influencers
  }),
);

export const awardCategoryRankingRelations = relations(
  awardCategoryRankings,
  ({ one }) => ({
    award: one(awards, {
      fields: [awardCategoryRankings.awardId],
      references: [awards.id],
    }),
    category: one(categories, {
      fields: [awardCategoryRankings.categoryId],
      references: [categories.id],
    }),
  }),
);
// MARK: Creator Challenges

export const creatorChallenges = pgTable("creator_challenges", (d) => ({
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  content: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
  organizerId: d
    .serial()
    .references(() => brands.id)
    .notNull(),
  locationId: d.serial().references(() => locations.id),
  start_date: d.date(),
  end_date: d.date(),
  registrationUrl: d.text(),
}));

export const creatorChallengeRelations = relations(
  creatorChallenges,
  ({ one }) => ({
    organization: one(brands, {
      fields: [creatorChallenges.organizerId],
      references: [brands.id],
    }),
  }),
);

// Network Events

export const networkEvents = pgTable("network_events", (d) => ({
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  content: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
  locationId: d
    .serial()
    .references(() => locations.id)
    .notNull(),
  date_from: d.date(),
  date_until: d.date(),
  tickets_url: d.text(),
}));

export const networkEventRelations = relations(networkEvents, ({ one }) => ({
  location: one(locations, {
    fields: [networkEvents.locationId],
    references: [locations.id],
  }),
}));

// MARK: Social Media Campaigns

export const socialMediaCampaigns = pgTable("social_media_campaigns", (d) => ({
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  content: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
  organizerId: d
    .serial()
    .references(() => brands.id)
    .notNull(),
  locationId: d.serial().references(() => locations.id),
  date_from: d.date(),
  date_until: d.date(),
  registrationUrl: d.text(),
}));

export const socialMediaCampaignRelations = relations(
  socialMediaCampaigns,
  ({ one }) => ({
    organization: one(brands, {
      fields: [socialMediaCampaigns.organizerId],
      references: [brands.id],
    }),
  }),
);

// MARK: Agencies

export const agencies = pgTable("agencies", (d) => ({
  id: d.serial().primaryKey(),
  name: d.text().notNull(),
  description: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<ImageAsset>().notNull(),
  logo: d.jsonb().$type<ImageAsset>().notNull(),
  websiteUrl: d.text().notNull(),
  email: d.text().notNull(),
}));

export const agencyRelations = relations(agencies, ({ one }) => ({}));

// MARK: Conventions

export const conventions = pgTable("conventions", (d) => ({
  id: d.serial().primaryKey(),
  title: d.text().notNull(),
  date: d.date().notNull(),
  locationId: d
    .serial()
    .references(() => locations.id)
    .notNull(),
  // schedule
}));

export const conventionRelations = relations(conventions, ({ many, one }) => ({
  partners: many(conventionPartners),
  location: one(locations, {
    fields: [conventions.locationId],
    references: [locations.id],
  }),
}));

// MARK: Convention Partners

export const conventionPartners = pgTable("convention_partners", (d) => ({
  id: d.serial().primaryKey(),
  conventionId: d
    .serial()
    .references(() => conventions.id)
    .notNull(),
  brandId: d
    .serial()
    .references(() => brands.id)
    .notNull(),
}));

export const conventionPartnerRelations = relations(
  conventionPartners,
  ({ one }) => ({
    convention: one(conventions, {
      fields: [conventionPartners.conventionId],
      references: [conventions.id],
    }),
    brand: one(brands, {
      fields: [conventionPartners.brandId],
      references: [brands.id],
    }),
  }),
);
