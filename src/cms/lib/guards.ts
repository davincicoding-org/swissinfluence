/* eslint-disable @typescript-eslint/no-unsafe-return -- ignore */

import { z } from "zod";

export const createGuard =
  (
    ResourceSchema: z.ZodObject<
      { id: z.ZodString } & Record<string, z.ZodType>
    >,
    options?: {
      preserveID?: boolean;
    },
  ) =>
  (data: unknown) => {
    const resolveObjectSchema = (
      ObjectSchema: z.ZodObject<z.ZodRawShape>,
    ): z.ZodObject<z.ZodRawShape> =>
      z.object(
        Object.entries(ObjectSchema.shape).reduce((acc, [prop, PropSchema]) => {
          if (PropSchema.isNullable())
            return {
              ...acc,
              [prop]: PropSchema.optional().transform((propData) =>
                propData !== undefined ? propData : null,
              ),
            };
          if (PropSchema instanceof z.ZodArray)
            return {
              ...acc,
              [prop]: PropSchema.optional().transform(
                (propData) => propData ?? [],
              ),
            };
          if (PropSchema instanceof z.ZodRecord)
            return {
              ...acc,
              [prop]: PropSchema.optional().transform(
                (propData) => propData ?? {},
              ),
            };
          if (PropSchema instanceof z.ZodObject) {
            const PropObjectSchema = resolveObjectSchema(
              PropSchema as z.ZodObject<z.ZodRawShape>,
            );
            return {
              ...acc,
              [prop]: PropObjectSchema.optional().transform(
                (propData) => propData ?? PropObjectSchema.parse({}),
              ),
            };
          }
          return {
            ...acc,
            [prop]: PropSchema,
          };
        }, {}),
      );

    const ResolvedResourceSchema = resolveObjectSchema(ResourceSchema);
    if (options?.preserveID) return ResolvedResourceSchema.parse(data);

    return ResolvedResourceSchema.omit({
      id: true,
    }).parse(data);
  };

export const editGuard =
  (
    ResourceSchema: z.ZodObject<
      { id: z.ZodString } & Record<string, z.ZodType>
    >,
  ) =>
  (data: Record<string, unknown>) => {
    const result = ResourceSchema.parse(data);

    return result;
  };
