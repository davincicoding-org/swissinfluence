import { ImageMediaSchema } from "@davincicoding/cms/image";
import { z } from "zod/v4";

import { BrandDocumentSchema } from "../../../deprecated/brands-schema";
import { CategoryDocumentSchema } from "../../../deprecated/category-schema";
import {
  DocumentIDSchema,
  TranslatableSchema,
} from "../../../deprecated/common";
import { ExpertDocumentSchema } from "../../../deprecated/expert-schema";
import { InfluencerDocumentSchema } from "../../../deprecated/influencer-schema";

export const AwardCategoryRankingSchema = z.object({
  winnerImage: ImageMediaSchema.nullable(),
  ranking: z.array(InfluencerDocumentSchema.shape.id),
});

export const AwardDocumentSchema = z.object({
  id: DocumentIDSchema,
  year: z.number(),
  categories: z.array(
    z.object({
      category: CategoryDocumentSchema.shape.id,
      sponsor: BrandDocumentSchema.shape.id.nullable(),
      nominees: z.array(InfluencerDocumentSchema.shape.id),
    }),
  ),
  partners: z.array(BrandDocumentSchema.shape.id),
  jury: z.array(ExpertDocumentSchema.shape.id),
  nomination: z
    .object({
      deadline: z.string(),
      url: z.string().url(),
    })
    .nullable(),
  newcomerScout: z
    .object({
      deadline: z.string(),
      url: z.string().url(),
    })
    .nullable(),
  voting: z
    .object({
      deadline: z.string(),
    })
    .nullable(),
  show: z
    .object({
      date: z.string().nullable(),
      ticketSale: z.object({
        url: z.string().url().nullable(),
        open: z.boolean(),
      }),
      location: z.object({
        name: z.string(),
        city: z.string(),
        mapsURL: z.string().url(),
      }),
      schedule: z.array(
        z.object({
          title: TranslatableSchema,
          start: z.preprocess((value) => {
            if (typeof value === "string") return value;
            if (value instanceof Date)
              return `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`;
            return null;
          }, z.string().nullable()),
          end: z.preprocess((value) => {
            if (typeof value === "string") return value;
            if (value instanceof Date)
              return `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`;
            return null;
          }, z.string().nullable()),
          description: TranslatableSchema,
        }),
      ),
    })
    .nullable(),
  ranking: z
    .record(CategoryDocumentSchema.shape.id, AwardCategoryRankingSchema)
    .nullable(),
  impressions: z
    .object({
      afterMovie: z.string().url(),
      images: z.array(ImageMediaSchema),
    })
    .nullable(),
});

export type IAwardDocument = z.infer<typeof AwardDocumentSchema>;
