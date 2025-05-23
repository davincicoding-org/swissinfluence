import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { SocialMediaSchema } from "@/database/enums";

import { DocumentIDSchema, TranslatableSchema } from "./common";

/**
 * @deprecated
 */
export const ExpertDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: z.string(),
  image: ImageMediaSchema,
  description: TranslatableSchema,
  socials: z.array(SocialMediaSchema),
});

/**
 * @deprecated
 */
export type IExpertDocument = z.infer<typeof ExpertDocumentSchema>;
