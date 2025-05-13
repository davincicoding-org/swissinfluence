import { z } from "zod";
import { ConstantsContentSchema } from "./schema";

export const ConstantsFetcherSchema = z
  .function()
  .args()
  .returns(z.promise(ConstantsContentSchema));
export type ConstantsFetcher = z.infer<typeof ConstantsFetcherSchema>;
