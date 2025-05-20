import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { DocumentIDSchema } from "../../common";

export const BrandDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: z.string(),
  image: ImageMediaSchema,
  website: z.string(),
});

export type IBrandDocument = z.infer<typeof BrandDocumentSchema>;
