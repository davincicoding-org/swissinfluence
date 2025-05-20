import type {
  MediaLibraryAssets,
  MediaLibrarySchema,
} from "@davincicoding/cms/media";

export const MEDIA_LIBRARY = {
  landing: {
    hero: "video",
  },
  award: {
    hero: "image",
    "newcomer-scout": "image",
  },
  network: {
    hero: "image",
    agencies: "image",
    influencers: "image",
    events: "image",
    campaigns: "image",
    whatsapp: "image",
    "influencer-certification": "image",
    "agency-certification": "image",
  },
  convention: {
    hero: "image",
  },
  academy: {
    hero: "image",
  },
} satisfies MediaLibrarySchema;

export type MediaLibrary = MediaLibraryAssets<typeof MEDIA_LIBRARY>;
