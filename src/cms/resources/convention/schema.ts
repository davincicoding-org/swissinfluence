import { z } from "zod/v4";

import { DocumentIDSchema, TranslatableSchema } from "../../common";
import { BrandDocumentSchema } from "../deprecated/brands-schema";
import { ExpertDocumentSchema } from "../deprecated/expert-schema";

export const ConventionDocumentSchema = z.object({
  id: DocumentIDSchema,
  title: z.string(),
  date: z.string(),
  location: z.object({
    name: z.string(),
    city: z.string(),
    mapsURL: z.string().url(),
  }),
  partners: z.array(BrandDocumentSchema.shape.id).default([]),
  ticketSale: z.object({
    url: z.string().url().nullable(),
    open: z.boolean(),
  }),
  schedule: z
    .array(
      z.object({
        title: TranslatableSchema,
        room: z.string().nullable(),
        start: z.preprocess((value) => {
          if (typeof value === "string") return value;
          if (value instanceof Date)
            return `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`;
          return null;
        }, z.string()),
        end: z.preprocess((value) => {
          if (typeof value === "string") return value;
          if (value instanceof Date)
            return `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`;
          return null;
        }, z.string()),
        description: TranslatableSchema,
      }),
    )
    .default([]),
  speakers: z.array(ExpertDocumentSchema.shape.id).default([]),
});

export type IConventionDocument = z.infer<typeof ConventionDocumentSchema>;
