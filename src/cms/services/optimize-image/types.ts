import { z } from "zod";

export const ImageCompressionPresetSchema = z.enum([
  "logo",
  "photography",
  "profile-picture",
]);

export const ImageCompressionOptionsSchema = z.object({
  lossless: z.boolean().optional(),
  nearLossless: z.boolean().optional(),
  quality: z.number().optional(),
  smartSubsample: z.boolean().optional(),
});

export type IImageCompressionOptions = z.infer<
  typeof ImageCompressionOptionsSchema
>;

export const ImageExtractOptionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  left: z.number(),
  top: z.number(),
});
export type IImageExtractOptions = z.infer<typeof ImageExtractOptionsSchema>;

export const ImageResizeOptionsSchema = z.object({
  width: z.number().optional(),
  height: z.number().optional(),
  square: z.number().optional(),
  fit: z.enum(["cover", "inside"]).optional(),
});

export type IImageResizeOptions = z.infer<typeof ImageResizeOptionsSchema>;

export const ImageOptimisationOptionsSchema = z.object({
  compression: z
    .union([ImageCompressionOptionsSchema, ImageCompressionPresetSchema])
    .optional(),
  extract: ImageExtractOptionsSchema.optional(),
  resize: ImageResizeOptionsSchema.optional(),
});

export type IImageOptimisationOptions = z.infer<
  typeof ImageOptimisationOptionsSchema
>;

export const IMAGE_COMPRESSION_PRESETS: Record<
  z.infer<typeof ImageCompressionPresetSchema>,
  IImageCompressionOptions
> = {
  logo: { lossless: true, smartSubsample: true },
  photography: { quality: 100, nearLossless: true },
  "profile-picture": { quality: 100 },
};
