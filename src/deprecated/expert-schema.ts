import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { SocialMediaSchema } from "../cms/common/socials";
import { DocumentIDSchema, TranslatableSchema } from "./common";

export const ExpertDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: z.string(),
  image: ImageMediaSchema,
  description: TranslatableSchema,
  socials: z.array(SocialMediaSchema),
});

export type IExpertDocument = z.infer<typeof ExpertDocumentSchema>;
