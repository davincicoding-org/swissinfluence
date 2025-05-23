import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { BrandDocumentSchema } from "./brands-schema";
import { DocumentIDSchema, TranslatableSchema } from "./common";

export const CreatorChallengeDocumentSchema = z.object({
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

export type ICreatorChallengeDocument = z.infer<
  typeof CreatorChallengeDocumentSchema
>;
