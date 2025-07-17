import type { CollectionConfig } from "payload";

import { trackCollectionChange } from "../track-changes";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "id",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "photos",
    },
    {
      name: "content",
      type: "richText",
      localized: true,
    },
  ],
  hooks: {
    afterChange: [trackCollectionChange()],
  },
};
