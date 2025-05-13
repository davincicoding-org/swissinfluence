import { z } from "zod";

export const VectorMediaSchema = z.object({
  content: z.string(),
});
export type VectorMedia = z.infer<typeof VectorMediaSchema>;
