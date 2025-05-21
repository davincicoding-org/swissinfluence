import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { DocumentIDSchema, TranslatableSchema } from "../../common";
import { CategoryDocumentSchema } from "../category/category-schema";
import { InfluencerDocumentSchema } from "../deprecated/influencer-schema";
import { SwissCantonCodeSchema } from "./cantons";
import { LanguageCodeSchema } from "./languages";

export const CertifiedInfluencerDocumentSchema = z.object({
  id: DocumentIDSchema,
  influencerID: InfluencerDocumentSchema.shape.id,
  image: ImageMediaSchema,
  categories: z.array(CategoryDocumentSchema.shape.id),
  residence: SwissCantonCodeSchema,
  about: TranslatableSchema,
  languages: z.array(LanguageCodeSchema),
  birthdate: z.string(),
  interests: TranslatableSchema,
});

export type ICertifiedIInfluencerDocument = z.infer<
  typeof CertifiedInfluencerDocumentSchema
>;
