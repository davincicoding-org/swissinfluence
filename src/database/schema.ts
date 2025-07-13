import type { ImageAsset } from "@davincicoding/cms/image";
import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import type { SocialMedia } from "./enums";
import { CantonEnum, LanguageCodeEnum } from "./enums";

// MARK: JSON Schemas

type Translatable = Record<string, string>;
// type Translatable = Record<SupportedLocale, string>;

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

export const images = pgTable(
  "images",
  (d) => ({
    id: d.serial().primaryKey(),
    name: d.text().notNull(),
    group: d.text(),
    src: d.text().notNull(),
    height: d.smallint().notNull(),
    width: d.smallint().notNull(),
    blurDataURL: d.text().notNull(),
    caption: d.jsonb().$type<Translatable>(),
  }),
  (t) => [
    index("images_group_idx").on(t.group),
    index("images_name_idx").on(t.name),
    unique("images_name_group_unique").on(t.name, t.group),
  ],
);

export const videos = pgTable(
  "videos",
  (d) => ({
    id: d.serial().primaryKey(),
    name: d.text().notNull(),
    group: d.text(),
    src: d.text().notNull(),
  }),
  (t) => [
    index("videos_group_idx").on(t.group),
    index("videos_name_idx").on(t.name),
    unique("videos_name_group_unique").on(t.name, t.group),
  ],
);

// MARK: Locations

export const locations = pgTable("locations", (d) => ({
  id: d.serial().primaryKey(),
  title: d.text().notNull().unique(),
  city: d.text().notNull(),
  maps: d.text().notNull(),
}));

// MARK: Categories

export const categories = pgTable("categories", (d) => ({
  // TODO remove this soon
  firebase_id: d.text(),
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
}));

// MARK: Influencers

export const influencers = pgTable("influencers", (d) => ({
  // TODO remove this soon
  firebase_id: d.text(),
  id: d.serial().primaryKey(),
  name: d.text().notNull(),
  socials: d.jsonb().$type<SocialMedia>().array().notNull(),
  image: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
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
  // TODO remove this soon
  firebase_id: d.text(),
  id: d.serial().primaryKey(),
  influencer: d
    .integer()
    .references(() => influencers.id)
    .notNull()
    .unique(),
  image: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
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
  // TODO remove this soon
  firebase_id: d.text(),
  id: d.serial().primaryKey(),
  name: d.text().notNull(),
  description: d.jsonb().$type<Translatable>().notNull(),
  socials: d.jsonb().$type<SocialMedia>().array().notNull(),
  image: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
}));

// MARK: Brands

export const brands = pgTable("brands", (d) => ({
  // TODO remove this soon
  firebase_id: d.text(),
  id: d.serial().primaryKey(),
  name: d.text().notNull().unique(),
  website: d.text().notNull(),
  image: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
}));

// MARK: Awards

export const awards = pgTable("awards", (d) => ({
  // TODO remove this soon
  firebase_id: d.text(),
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
  show: one(awardShows, {
    fields: [awards.id],
    references: [awardShows.award],
  }),
}));

// MARK: Award Partners

export const awardPartners = pgTable(
  "award_partners",
  (d) => ({
    id: d.serial().primaryKey(),
    award: d
      .integer()
      .references(() => awards.id)
      .notNull(),
    brand: d
      .integer()
      .references(() => brands.id)
      .notNull(),
  }),
  (t) => [index("idx_award_partner_award").on(t.award)],
);

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

// MARK: Award Jury Members

export const awardJuryMembers = pgTable(
  "award_jury_members",
  (d) => ({
    id: d.serial().primaryKey(),
    // ordinal: d.smallint().notNull(),
    award: d
      .integer()
      .references(() => awards.id)
      .notNull(),
    expert: d
      .integer()
      .references(() => experts.id)
      .notNull(),
  }),
  (t) => [index("idx_award_jury_member_award").on(t.award)],
);

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

// MARK: Award Categories

export const awardCategories = pgTable(
  "award_categories",
  (d) => ({
    id: d.serial().primaryKey(),
    category: d
      .integer()
      .references(() => categories.id)
      .notNull(),
    award: d
      .integer()
      .references(() => awards.id)
      .notNull(),
    sponsor: d.integer().references(() => brands.id),
    winner: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>(),
  }),
  (t) => [index("idx_award_category_award").on(t.award)],
);

export const awardCategoryRelations = relations(
  awardCategories,
  ({ one, many }) => ({
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
    nominees: many(awardNominees),
  }),
);

// MARK: Award Nominees

export const awardNominees = pgTable(
  "award_nominees",
  (d) => ({
    id: d.serial().primaryKey(),
    awardCategory: d
      .integer()
      .references(() => awardCategories.id)
      .notNull(),
    influencer: d
      .integer()
      .references(() => influencers.id)
      .notNull(),
    ranking: d.smallint(),
  }),
  (t) => [index("idx_award_nominee_category").on(t.awardCategory)],
);

export const awardNomineeRelations = relations(awardNominees, ({ one }) => ({
  awardCategory: one(awardCategories, {
    fields: [awardNominees.awardCategory],
    references: [awardCategories.id],
  }),
  influencer: one(influencers, {
    fields: [awardNominees.influencer],
    references: [influencers.id],
  }),
}));

// MARK: Award Shows

export type AwardShowSchedule = {
  title: Translatable;
  start: Date | null;
  end: Date | null;
  description: Translatable;
}[];

export const awardShows = pgTable("award_shows", (d) => ({
  id: d.serial().primaryKey(),
  award: d
    .integer()
    .references(() => awards.id)
    .notNull()
    .unique(),
  location: d
    .integer()
    .references(() => locations.id)
    .notNull(),
  date: d.date(),
  content: d.jsonb().$type<Translatable>(),
  tickets: d.text(),
  schedule: d.jsonb().$type<AwardShowSchedule>().default([]).notNull(),
  video: d.text(),
  impressions: d.jsonb().$type<Omit<ImageAsset, "id" | "name">[]>(),
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

// MARK: Creator Challenges

export const creatorChallenges = pgTable("creator_challenges", (d) => ({
  // TODO remove this soon
  firebase_id: d.text(),
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  content: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
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
    organizer: one(brands, {
      fields: [creatorChallenges.organizer],
      references: [brands.id],
    }),
    location: one(locations, {
      fields: [creatorChallenges.location],
      references: [locations.id],
    }),
  }),
);

// MARK: Network Events

export const networkEvents = pgTable("network_events", (d) => ({
  // TODO remove this soon
  firebase_id: d.text(),
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  description: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
  logo: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
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
  // TODO remove this soon
  firebase_id: d.text(),
  id: d.serial().primaryKey(),
  title: d.jsonb().$type<Translatable>().notNull(),
  content: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
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
    organizer: one(brands, {
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
  // TODO remove this soon
  firebase_id: d.text(),
  id: d.serial().primaryKey(),
  name: d.text().notNull(),
  description: d.jsonb().$type<Translatable>().notNull(),
  image: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
  logo: d.jsonb().$type<Omit<ImageAsset, "id" | "name">>().notNull(),
  website: d.text().notNull(),
  email: d.text().notNull(),
}));

// MARK: Conventions

export type ConventionSchedule = {
  title: Translatable;
  room: string | null;
  start: Date;
  end: Date;
  description: Translatable;
}[];

export const conventions = pgTable("conventions", (d) => ({
  // TODO remove this soon
  firebase_id: d.text(),
  id: d.serial().primaryKey(),
  title: d.text().notNull(),
  date: d.date().notNull(),
  location: d
    .integer()
    .references(() => locations.id)
    .notNull(),
  tickets: d.text(),
  schedule: d.jsonb().$type<ConventionSchedule>().default([]).notNull(),
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
