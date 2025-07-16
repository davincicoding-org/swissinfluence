import type { CollectionConfig } from "payload";

export const Logos: CollectionConfig = {
  slug: "logos",
  admin: {
    group: "Media",
    hidden: true,
  },
  access: {
    read: () => true,
  },
  fields: [],
  upload: {
    focalPoint: false,
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    formatOptions: {
      format: "webp",
      options: {
        preset: "icon",
        effort: 6,
        lossless: false,
        nearLossless: true,
      },
    },
    resizeOptions: {
      width: 512,
      height: 512,
      fit: "outside",
      withoutEnlargement: true,
    },
  },
};
