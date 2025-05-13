import { z } from "zod";
import { DocumentIDSchema } from "../database/schema";

/* Config */

const ConstantTypeSchema = z.enum(["string", "number", "boolean"]);

export const ConstantConfigSchema = z.object({
  key: z.string(),
  type: ConstantTypeSchema,
});

/* Content */

export const ConstantsScopeSchema = z.record(
  z.union([z.string(), z.number(), z.boolean(), z.number()]),
);

export type ConstantsScope = z.infer<typeof ConstantsScopeSchema>;

export const ConstantsContentSchema = z.record(ConstantsScopeSchema);

export type ConstantsContent = z.infer<typeof ConstantsContentSchema>;

/* Document */

export const ConstantsDocumentSchema = z.object({
  id: DocumentIDSchema,
  config: z.array(ConstantConfigSchema),
  constants: ConstantsScopeSchema,
});

export type ConstantsDocument = z.infer<typeof ConstantsDocumentSchema>;
