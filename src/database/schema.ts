import { relations } from "drizzle-orm";
import { pgTable, uuid, pgEnum, text, smallint } from "drizzle-orm/pg-core";

// MARK: Images

const imageType = pgEnum("image_type", ["webp", "svg", "png", "jpg"]);
export const images = pgTable("images", {
  id: uuid().defaultRandom().primaryKey(),
  src: text().notNull(),
  width: smallint().notNull(),
  height: smallint().notNull(),
  blurDataURL: text().notNull(),
  type: imageType("type").notNull(),
});

// MARK: Social

const socialPlatform = pgEnum("social_platform", [
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

const socials = pgTable("socials", {
  id: uuid().defaultRandom().primaryKey(),
  platform: socialPlatform("platform").notNull(),
  url: text().notNull(),
});

// MARK: Influencers

export const influencers = pgTable("influencers", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  imageId: uuid().references(() => images.id),
});

export const influencerRelations = relations(influencers, ({ one, many }) => ({
  image: one(images, {
    fields: [influencers.imageId],
    references: [images.id],
  }),
  socials: many(socials),
}));
