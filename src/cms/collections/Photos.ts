import type { CollectionConfig } from "payload";

import { trackCollectionChange } from "../track-changes";

// TODO image resizing is skipped when focal point is used
export const Photos: CollectionConfig = {
  slug: "photos",
  access: {
    read: () => true,
  },
  admin: {
    group: "Media",
    hidden: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      // required: true,
    },
  ],
  upload: {
    adminThumbnail: "thumbnail",
    focalPoint: true,
    mimeTypes: ["image/png", "image/jpeg", "image/webp"],
    formatOptions: {
      format: "webp",
      options: {
        preset: "photo",
        smartSubsample: true,
      },
    },
    resizeOptions: {
      width: 4096,
      withoutEnlargement: true,
    },
    imageSizes: [
      { name: "thumbnail", width: 300, height: 300, fit: "outside" },
      {
        name: "og",
        width: 1200,
        height: 630,
      },
    ],
  },
  hooks: {
    afterChange: [trackCollectionChange(["update"])],
  },
};
