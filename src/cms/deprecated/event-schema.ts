import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { DocumentIDSchema, TranslatableSchema } from "../common";

export const EventDocumentSchema = z.object({
  id: DocumentIDSchema,
  title: TranslatableSchema,
  description: TranslatableSchema,
  image: ImageMediaSchema,
  logo: ImageMediaSchema,
  date: z.object({
    from: z.string().nullable(),
    until: z.string(),
  }),
  location: z.object({
    name: z.string(),
    city: z.string(),
    mapsURL: z.string().url(),
  }),
  ticketSale: z.object({
    url: z.string().url(),
    open: z.boolean(),
  }),
});

export type IEventDocument = z.infer<typeof EventDocumentSchema>;
