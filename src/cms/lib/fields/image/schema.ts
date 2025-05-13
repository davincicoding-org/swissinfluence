import { z } from "zod";

export const ImageMediaSchema = z
  .object({
    src: z.string(),
    blurDataURL: z.string().optional(),
    // type: z.enum(["webp", "svg"]).optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    rawFile: z
      .union([z.instanceof(File), z.object({}).transform(() => undefined)])
      .optional(),
  })
  .passthrough();
export type ImageMedia = z.infer<typeof ImageMediaSchema>;
