import { z } from "zod";

import { ImageMediaSchema } from "@/cms/lib/fields";

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
