import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { DocumentIDSchema } from "./common";

/**
 * @deprecated
 */
export const BrandDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: z.string(),
  image: ImageMediaSchema,
  website: z.string(),
});

/**
 * @deprecated
 */
export type IBrandDocument = z.infer<typeof BrandDocumentSchema>;
