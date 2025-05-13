import { z } from "zod";

import { ImageMediaSchema } from "@/cms/lib/fields";

import { DocumentIDSchema, TranslatableSchema } from "../../common";

export const AgencyDocumentSchema = z.object({
  id: DocumentIDSchema,
  logo: ImageMediaSchema,
  image: ImageMediaSchema,
  name: z.string(),
  about: TranslatableSchema,
  email: z.string().email(),
  website: z.string().url(),
});

export type IAgencyDocument = z.infer<typeof AgencyDocumentSchema>;
