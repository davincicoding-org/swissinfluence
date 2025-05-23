import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { DocumentIDSchema, TranslatableSchema } from "./common";

/**
 * @deprecated
 */
export const CategoryDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: TranslatableSchema,
  image: ImageMediaSchema,
});

/**
 * @deprecated
 */
export type ICategoryDocument = z.infer<typeof CategoryDocumentSchema>;
