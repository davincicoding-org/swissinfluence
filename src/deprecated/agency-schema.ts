import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { DocumentIDSchema, TranslatableSchema } from "./common";

export const AgencyDocumentSchema = z.object({
  id: DocumentIDSchema,
  logo: ImageMediaSchema,
  image: ImageMediaSchema,
  name: z.string(),
  about: TranslatableSchema,
  email: z.string().email(),
  website: z.string().url(),
});

export type IAgencyDocument = z.infer<typeof AgencyDocumentSchema>;
