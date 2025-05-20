import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import {
  DocumentIDSchema,
  SocialMediaSchema,
  TranslatableSchema,
} from "../../common";

export const ExpertDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: z.string(),
  image: ImageMediaSchema,
  description: TranslatableSchema,
  socials: z.array(SocialMediaSchema),
});

export type IExpertDocument = z.infer<typeof ExpertDocumentSchema>;
