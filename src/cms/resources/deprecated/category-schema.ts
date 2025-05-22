import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { DocumentIDSchema, TranslatableSchema } from "../../common";

export const CategoryDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: TranslatableSchema,
  image: ImageMediaSchema,
});
export type ICategoryDocument = z.infer<typeof CategoryDocumentSchema>;
