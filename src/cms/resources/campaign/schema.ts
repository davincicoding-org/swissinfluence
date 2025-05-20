import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { DocumentIDSchema, TranslatableSchema } from "../../common";
import { BrandDocumentSchema } from "../brand/schema";

export const CampaignDocumentSchema = z.object({
  id: DocumentIDSchema,
  organizer: BrandDocumentSchema.shape.id,
  title: TranslatableSchema,
  description: TranslatableSchema,
  image: ImageMediaSchema,
  date: z
    .object({
      from: z.string().nullable(),
      until: z.string(),
    })
    .nullable(),
  location: z
    .object({
      name: z.string(),
      city: z.string(),
      mapsURL: z.string().url(),
    })
    .nullable(),
  registrationURL: z.string().url().nullable(),
});

export type ICampaignDocument = z.infer<typeof CampaignDocumentSchema>;
