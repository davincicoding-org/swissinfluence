import type { CollectionConfig } from "payload";

export const Logos: CollectionConfig = {
  slug: "logos",
  admin: {
    group: "Media",
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
    imageSizes: [
      {
        name: "thubmnail",
        width: 300,
        height: 300,
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    ],
  },
};
