import { z } from "zod";
import { MessagesContentSchema } from "./schema";

export const MessagesFetcherSchema = z
  .function()
  .args()
  .returns(z.promise(MessagesContentSchema));
export type MessagesFetcher = z.infer<typeof MessagesFetcherSchema>;
