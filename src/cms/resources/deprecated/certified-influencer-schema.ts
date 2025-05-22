import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { SwissCantonCodeSchema } from "../../../utils/cantons";
import { LanguageCodeSchema } from "../../../utils/languages";
import { DocumentIDSchema, TranslatableSchema } from "../../common";
import { CategoryDocumentSchema } from "./category-schema";
import { InfluencerDocumentSchema } from "./influencer-schema";

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
