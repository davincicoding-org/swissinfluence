import { z } from "zod";
import { DocumentIDSchema } from "../database/schema";
import { ImageMediaSchema } from "../fields/image/schema";
import { VideoMediaSchema } from "../fields/video/schema";
import { VectorMediaSchema } from "../fields/vector/schema";

/* Config */

const MediaTypeSchema = z.enum(["image", "video", "vector"]);

export const MediaElementConfigSchema = z.object({
  key: z.string(),
  type: MediaTypeSchema,
});

/* Content */

export const MediaScopeContentSchema = z.object({
  images: z.record(ImageMediaSchema).nullable(),
  videos: z.record(VideoMediaSchema).nullable(),
  vectors: z.record(VectorMediaSchema).nullable(),
});

export type MediaScopeContent = z.infer<typeof MediaScopeContentSchema>;

export const MediaContentSchema = z.record(MediaScopeContentSchema);

export type MediaContent = z.infer<typeof MediaContentSchema>;

/* Document */

export const MediaDocumentSchema = z.object({
  id: DocumentIDSchema,
  config: z.array(MediaElementConfigSchema),
  media: MediaScopeContentSchema,
});

export type MediaDocument = z.infer<typeof MediaDocumentSchema>;
