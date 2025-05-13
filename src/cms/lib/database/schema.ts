/* Document */

import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- ignore
export type DocumentRef<T> = string;
export const DocumentIDSchema = z.string();
