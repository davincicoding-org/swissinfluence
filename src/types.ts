import type { ImageAsset } from "@davincicoding/cms/image";

import type * as db from "@/database/schema";

import type { SocialMedia } from "./database/enums";

export type Brand = typeof db.brands.$inferSelect;
export type Category = typeof db.categories.$inferSelect;

export type Expert = typeof db.experts.$inferSelect;

export type Influencer = typeof db.influencers.$inferSelect;

export interface Convention
  extends Pick<
    typeof db.conventions.$inferSelect,
    "date" | "tickets" | "schedule"
  > {
  partners: Array<typeof db.brands.$inferSelect>;
  location: Omit<typeof db.locations.$inferSelect, "id">;
}

export interface NetworkEvent
  extends Pick<
    typeof db.networkEvents.$inferSelect,
    | "id"
    | "title"
    | "description"
    | "image"
    | "logo"
    | "start"
    | "end"
    | "tickets"
  > {
  location: Omit<typeof db.locations.$inferSelect, "id">;
}

export type Agency = typeof db.agencies.$inferSelect;

export interface CategoryWithInfluencers {
  category: Pick<typeof db.categories.$inferSelect, "id" | "title">;
  influencers: Array<Pick<CertifiedInfluencer, "id" | "name" | "image">>;
}

export interface CertifiedInfluencer
  extends Pick<
      typeof db.certifiedInfluencers.$inferSelect,
      | "id"
      | "bio"
      | "image"
      | "birthdate"
      | "residence"
      | "languages"
      | "otherInterests"
    >,
    Pick<typeof db.influencers.$inferSelect, "name"> {
  socials: Array<SocialMedia>;
  interests: Array<Pick<typeof db.categories.$inferSelect, "id" | "title">>;
}

export interface SocialMediaCampaign
  extends Pick<
    typeof db.socialMediaCampaigns.$inferSelect,
    "id" | "title" | "content" | "image" | "start" | "end" | "registration"
  > {
  organizer: Pick<
    typeof db.brands.$inferSelect,
    "id" | "name" | "image" | "website"
  >;
}

// MARK: Award

export interface AwardShowImpressions
  extends Pick<typeof db.awards.$inferSelect, "year"> {
  impressions: Array<ImageAsset>;
  video: string;
}

export interface Award
  extends Pick<
    typeof db.awards.$inferSelect,
    | "year"
    | "nominationDeadline"
    | "nominationUrl"
    | "newcomerScoutDeadline"
    | "newcomerScoutUrl"
    | "votingDeadline"
  > {
  jury: Array<Expert>;
  partners: Array<typeof db.brands.$inferSelect>;
  categories: Array<AwardCategory>;
  show: AwardShow | null;
  // ranked?: boolean;
}

export interface AwardCategory {
  category: Category;
  sponsor: Brand | null;
  winner: ImageAsset | null;
  nominees: Array<AwardNominee>;
}

export interface AwardNominee {
  influencer: Influencer;
  ranking: number | null;
}

export interface AwardShow
  extends Pick<
    typeof db.awardShows.$inferSelect,
    "date" | "schedule" | "tickets" | "impressions" | "video"
  > {
  location: Omit<typeof db.locations.$inferSelect, "id">;
}

export interface AwardRanking
  extends Pick<typeof db.awards.$inferSelect, "year"> {
  categories: Array<AwardCategoryRanking>;
}

export interface AwardCategoryRanking {
  category: Pick<typeof db.categories.$inferSelect, "id" | "title">;
  winner: ImageAsset | null;
  nominees: Array<AwardNominee>;
}

export interface CreatorChallenge
  extends Pick<
    typeof db.creatorChallenges.$inferSelect,
    "id" | "title" | "content" | "image" | "start" | "end" | "registration"
  > {
  organizer: Pick<
    typeof db.brands.$inferSelect,
    "id" | "name" | "image" | "website"
  >;
}
