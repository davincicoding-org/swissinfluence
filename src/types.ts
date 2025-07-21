import type { RichTextProps } from "@/ui/components/RichText";

import type * as payloadTypes from "./payload-types";

export interface LatestConvention
  extends Pick<
    payloadTypes.Convention,
    "date" | "registrationUrl" | "schedule"
  > {
  partners: Array<payloadTypes.Brand>;
  location: payloadTypes.Location;
}

export interface Event {
  id: string | number;
  logo: payloadTypes.Logo | null;
  image: payloadTypes.Photo;
  registrationUrl?: string | null;
  title: string;
  date: string;
  content: RichTextProps["data"];
  location: payloadTypes.Location;
}

export interface CategoryWithInfluencers {
  category: Pick<payloadTypes.Category, "id" | "name">;
  influencers: Array<Pick<CertifiedInfluencer, "id" | "name" | "image">>;
}

export interface CertifiedInfluencer
  extends Omit<
      payloadTypes.CertifiedInfluencer,
      "createdAt" | "updatedAt" | "influencer" | "categories"
    >,
    Pick<payloadTypes.Influencer, "name"> {
  socials: payloadTypes.Socials;
  categories: Array<Pick<payloadTypes.Category, "id" | "name">>;
}

export interface Campaign {
  id: number;
  image: payloadTypes.Photo;
  organizer: payloadTypes.Brand;
  location: payloadTypes.Location | null;
  dateFrom: string;
  dateTo: string | null;
  registrationUrl?: string | null;
  title: string;
  content: RichTextProps["data"];
}

// MARK: Award

export interface AwardShowImpressions {
  year: number;
  images: Array<payloadTypes.Photo>;
  videoUrl: string;
}

export interface CurrentAward
  extends Omit<
    payloadTypes.Award,
    "updatedAt" | "createdAt" | "jury" | "partners" | "categories"
  > {
  jury: Array<payloadTypes.Expert>;
  partners: Array<payloadTypes.Brand>;
  categories: Array<AwardCategory>;
  show: CurrentAwardShow | null;
}

export interface CurrentAwardShow
  extends Omit<
    payloadTypes.AwardShow,
    "award" | "updatedAt" | "createdAt" | "location"
  > {
  location: payloadTypes.Location;
  images: Array<payloadTypes.Photo>;
}

export interface AwardCategory {
  ranked: boolean;
  category: payloadTypes.Category;
  sponsor: payloadTypes.Brand | null;
  winnerImage: payloadTypes.ProfilePicture | null;
  nominees: Array<payloadTypes.Influencer>;
}

export interface AwardRanking extends Pick<payloadTypes.Award, "year"> {
  categories: Array<AwardCategoryRanking>;
}

export interface AwardCategoryRanking {
  category: Pick<payloadTypes.Category, "id" | "name">;
  winnerImage: payloadTypes.ProfilePicture | null;
  nominees: Array<payloadTypes.Influencer>;
}

export interface InfluencerVote {
  influencer: payloadTypes.Influencer["id"];
  category: payloadTypes.Category["id"];
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export interface VotingValues extends ContactInfo {
  award: payloadTypes.Award["id"];
  votes: Array<InfluencerVote>;
  newsletter: boolean;
}

export interface ValidatedVote {
  email: string;
  confirmed: boolean;
  influencer: string;
  category: string;
  date: string;
  unique: boolean;
}

export interface InfluencerVotingSummary {
  influencer: string;
  category: string;
  totalVotes: number;
  confirmedVotes: number;
  unconfirmedVotes: number;
}
