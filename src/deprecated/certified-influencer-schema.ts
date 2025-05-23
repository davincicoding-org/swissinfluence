import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { CantonEnum } from "@/database/enums";

import { LanguageCodeSchema } from "../utils/languages";
import { CategoryDocumentSchema } from "./category-schema";
import { DocumentIDSchema, TranslatableSchema } from "./common";
import { InfluencerDocumentSchema } from "./influencer-schema";

export const CertifiedInfluencerDocumentSchema = z.object({
  id: DocumentIDSchema,
  influencerID: InfluencerDocumentSchema.shape.id,
  image: ImageMediaSchema,
  categories: z.array(CategoryDocumentSchema.shape.id),
  residence: CantonEnum,
  about: TranslatableSchema,
  languages: z.array(LanguageCodeSchema),
  birthdate: z.string(),
  interests: TranslatableSchema,
});

export type ICertifiedIInfluencerDocument = z.infer<
  typeof CertifiedInfluencerDocumentSchema
>;
