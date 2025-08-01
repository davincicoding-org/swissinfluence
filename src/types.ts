import type { DefaultTypedEditorState as RichTextData } from "@payloadcms/richtext-lexical";
import type { StaticImageData } from "next/image";

import type * as payloadTypes from "./payload-types";

export interface NavigationConfig {
  homeLink: string;
  mainLogo: StaticImageData;
  mainLinks: Array<{
    label: string;
    href: string;
    logo?: StaticImageData;
    children?: Array<{
      label: string;
      href: string;
    }>;
  }>;
  subLinks: Array<{
    label: string;
    href: string;
  }>;
}

export interface Influencer
  extends Pick<payloadTypes.Influencer, "id" | "name" | "socials"> {
  image: payloadTypes.ProfilePicture;
}

export interface Brand
  extends Pick<payloadTypes.Brand, "id" | "name" | "website"> {
  logo: payloadTypes.Logo;
}

export interface Expert
  extends Pick<payloadTypes.Expert, "id" | "name" | "description" | "socials"> {
  image: payloadTypes.ProfilePicture;
}

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
  content: RichTextData;
  location: payloadTypes.Location;
}

export interface CategoryWithInfluencers {
  category: Pick<payloadTypes.Category, "id" | "name">;
  influencers: Array<Pick<CertifiedInfluencer, "id" | "name" | "avatar">>;
}

export interface CertifiedInfluencer
  extends Pick<
      payloadTypes.CertifiedInfluencer,
      "id" | "bio" | "birthdate" | "languages" | "residence" | "interests"
    >,
    Pick<Influencer, "name"> {
  socials: payloadTypes.Socials;
  avatar: payloadTypes.ProfilePicture;
  heroImage: payloadTypes.Photo;
  categories: Array<Pick<payloadTypes.Category, "id" | "name">>;
}

export interface Campaign {
  id: number;
  image: payloadTypes.Photo;
  organizer: Brand;
  location: payloadTypes.Location | null;
  dateFrom: string;
  dateTo: string | null;
  registrationUrl?: string | null;
  title: string;
  content: RichTextData;
}

// MARK: Award

export interface AwardShowImpressions {
  year: number;
  images: Array<payloadTypes.Photo>;
  videoUrl: string | null;
}

type AwardPhaseName =
  | "NOMINATION"
  | "NOMINATION_ENDED"
  | "VOTING"
  | "BETWEEN_VOTINGS"
  | "VOTING_ENDED"
  | "SHOW"
  | "WAITING_FOR_RANKING"
  | "FINISHED";
export interface AwardPhase {
  name: AwardPhaseName;
  nextPhaseStart: string | null;
}

export interface CurrentAward
  extends Omit<
    payloadTypes.Award,
    | "updatedAt"
    | "createdAt"
    | "jury"
    | "partners"
    | "categories"
    | "votingOpening"
    | "votingDeadline"
  > {
  jury: Array<Expert>;
  partners: Array<payloadTypes.Brand>;
  categories: Array<AwardCategory>;
  show: CurrentAwardShow | null;
  phases: Array<AwardPhase>;
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
  nominees: Array<Influencer>;
  voting: {
    opening: string | null;
    deadline: string | null;
  } | null;
}

export interface AwardRanking extends Pick<payloadTypes.Award, "year"> {
  categories: Array<AwardCategoryRanking>;
}

export interface AwardCategoryRanking {
  category: Pick<payloadTypes.Category, "id" | "name">;
  winnerImage: payloadTypes.ProfilePicture | null;
  nominees: Array<Influencer>;
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
