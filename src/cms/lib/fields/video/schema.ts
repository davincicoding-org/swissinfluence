import { z } from "zod";

export const VideoSourceSchema = z.object({
  src: z.string(),
  rawFile: z.instanceof(File).optional(),
  type: z.string().optional(),
});
export type VideoSource = z.infer<typeof VideoSourceSchema>;

export const VideoMediaSchema = z.object({
  src: z.string(),
  rawFile: z.instanceof(File).optional(),
});
export type VideoMedia = z.infer<typeof VideoMediaSchema>;
