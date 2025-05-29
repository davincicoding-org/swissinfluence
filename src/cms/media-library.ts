import type { MediaLibraryConfig } from "@davincicoding/cms/media-library";

export const MEDIA_LIBRARY = {
  LANDING: {
    HERO: "video",
  },
  AWARD: {
    HERO: "image",
    NEWCOMER_SCOUT: "image",
  },
  NETWORK: {
    HERO: "image",
    AGENCIES: "image",
    INFLUENCERS: "image",
    EVENTS: "image",
    CAMPAIGNS: "image",
    WHATSAPP: "image",
    INFLUENCER_CERTIFICATION: "image",
    AGENCY_CERTIFICATION: "image",
  },
  CONVENTION: {
    HERO: "image",
  },
  ACADEMY: {
    HERO: "image",
  },
} satisfies MediaLibraryConfig;
