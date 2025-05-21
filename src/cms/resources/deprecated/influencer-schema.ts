import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { DocumentIDSchema, SocialMediaSchema } from "../../common";

export const InfluencerDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: z.string(),
  image: ImageMediaSchema,
  socials: z.array(SocialMediaSchema),
});

export type IInfluencerDocument = z.infer<typeof InfluencerDocumentSchema>;
