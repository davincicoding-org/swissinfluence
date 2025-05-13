import { z } from "zod";

import { ImageMediaSchema } from "@/cms/lib/fields";

import { DocumentIDSchema, TranslatableSchema } from "../../common";

export const CategoryDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: TranslatableSchema,
  image: ImageMediaSchema.nullable(),
});
export type ICategoryDocument = z.infer<typeof CategoryDocumentSchema>;
