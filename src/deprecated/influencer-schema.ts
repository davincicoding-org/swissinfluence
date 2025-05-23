import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { SocialMediaSchema } from "@/database/enums";

import { DocumentIDSchema } from "./common";

/**
 * @deprecated
 */
export const InfluencerDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: z.string(),
  image: ImageMediaSchema,
  socials: z.array(SocialMediaSchema),
});

/**
 * @deprecated
 */
export type IInfluencerDocument = z.infer<typeof InfluencerDocumentSchema>;
