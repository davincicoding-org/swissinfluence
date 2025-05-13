import { z } from "zod";
import { MediaContentSchema } from "./schema";

export const MediaFetcherSchema = z
  .function()
  .args()
  .returns(z.promise(MediaContentSchema));
export type MediaFetcher = z.infer<typeof MediaFetcherSchema>;
