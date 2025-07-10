import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      // required: true,
    },
  ],
  upload: {
    focalPoint: true,
    formatOptions: {
      format: "webp",
      options: {
        preset: "photo",
        smartSubsample: true,
      },
    },
    resizeOptions: {
      width: 2048,
      withoutEnlargement: true,
    },
  },
};
