import type { CollectionConfig } from "payload";

import { trackCollectionChange } from "../track-changes";

export const ProfilePictures: CollectionConfig = {
  slug: "profile-pictures",
  admin: {
    group: "Media",
    hidden: true,
  },
  access: {
    read: () => true,
  },
  fields: [],
  upload: {
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/png", "image/jpeg", "image/webp"],
    formatOptions: {
      format: "webp",
      options: {
        preset: "photo",
        smartSubsample: true,
      },
    },
    resizeOptions: {
      width: 800,
      height: 800,
      position: "centre",
      fit: "outside",
      withoutEnlargement: true,
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
        height: 300,
        fit: "inside",
        position: "centre",
      },
    ],
  },
  hooks: {
    afterChange: [trackCollectionChange(["update"])],
  },
};
