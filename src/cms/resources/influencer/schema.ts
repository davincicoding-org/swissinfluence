import { z } from "zod";

import { ImageMediaSchema } from "@/cms/lib/fields";

import { DocumentIDSchema, SocialMediaSchema } from "../../common";

export const InfluencerDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: z.string(),
  image: ImageMediaSchema,
  socials: z.array(SocialMediaSchema),
});

export type IInfluencerDocument = z.infer<typeof InfluencerDocumentSchema>;
