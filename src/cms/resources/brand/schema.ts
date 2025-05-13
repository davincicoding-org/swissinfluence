import { z } from "zod";

import { ImageMediaSchema } from "@/cms/lib/fields";

import { DocumentIDSchema } from "../../common";

export const BrandDocumentSchema = z.object({
  id: DocumentIDSchema,
  name: z.string(),
  image: ImageMediaSchema,
  website: z.string(),
});

export type IBrandDocument = z.infer<typeof BrandDocumentSchema>;
