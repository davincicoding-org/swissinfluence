import type * as db from "@/database/schema";

import type { SocialMedia } from "./database/enums";
import type {
  Award,
  AwardShow,
  Brand,
  Category,
  Convention,
  Expert,
  Influencer,
  Location,
  Photo,
  ProfilePicture,
} from "./payload-types";

export interface LatestConvention
  extends Pick<Convention, "date" | "registrationUrl" | "schedule"> {
  partners: Array<Brand>;
  location: Location;
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

export interface AwardShowImpressions {
  year: number;
  images: Array<Photo>;
  videoUrl: string;
}

export interface CurrentAward
  extends Omit<
    Award,
    "updatedAt" | "createdAt" | "jury" | "partners" | "categories"
  > {
  jury: Array<Expert>;
  partners: Array<Brand>;
  categories: Array<AwardCategory>;
  show: CurrentAwardShow | null;
}

export interface CurrentAwardShow
  extends Omit<AwardShow, "award" | "updatedAt" | "createdAt" | "location"> {
  location: Location;
  images: Array<Photo>;
}

export interface AwardCategory {
  ranked: boolean;
  category: Category;
  sponsor: Brand | null;
  winnerImage: ProfilePicture | null;
  nominees: Array<Influencer>;
}

export interface AwardRanking extends Pick<Award, "year"> {
  categories: Array<AwardCategoryRanking>;
}

export interface AwardCategoryRanking {
  category: Pick<Category, "id" | "name">;
  winnerImage: ProfilePicture | null;
  nominees: Array<Influencer>;
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
