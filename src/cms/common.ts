import { z } from "zod";

/* Document */

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- ignore
export type DocumentRef<T> = string;
export const DocumentIDSchema = z.string();

/* Text Content */

// FIXME this is a Partial so I created a workaround
// export const TranslatableSchema = z.record(Locale, z.string());
export const TranslatableSchema = z.object({
  de: z.string(),
  en: z.string(),
  fr: z.string(),
  it: z.string(),
});

export type Translatable = z.infer<typeof TranslatableSchema>;

/* Video */

export const VideoDataSchema = z.object({
  src: z.string(),
});
export type VideoData = z.infer<typeof VideoDataSchema>;

/* Social Media */

export const SocialMediaPlatformSchema = z.enum([
  "INSTAGRAM",
  "TIKTOK",
  "LINKEDIN",
  "YOUTUBE",
  "APPLE_PODCAST",
  "SPOTIFY",
  "TWITCH",
  "WEBSITE",
  "WHATSAPP",
]);
export type SocialMediaPlatform = z.infer<typeof SocialMediaPlatformSchema>;

export const SOCIAL_MEDIA_PLATFORM_OPTIONS = SocialMediaPlatformSchema.options;

export const SocialMediaSchema = z.object({
  platform: SocialMediaPlatformSchema,
  url: z.string().url(),
});
export type SocialMedia = z.infer<typeof SocialMediaSchema>;

/* Utils */

export type NullableSchema<T extends z.ZodTypeAny> =
  T extends z.ZodObject<infer Shape>
    ? z.ZodObject<{ [K in keyof Shape]: NullableSchema<Shape[K]> }>
    : z.ZodNullable<z.ZodOptional<T>>;

export const Nullable = <T extends z.ZodTypeAny>(
  Schema: T,
): NullableSchema<T> => {
  if (!(Schema instanceof z.ZodObject))
    // @ts-expect-error poorly typed
    return (
      Schema.nullable()
        .optional()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ignore
        .transform((data) => (data !== undefined ? data : null))
    );

  const shape = Schema.shape as Record<string, z.ZodType>;
  // @ts-expect-error poorly typed
  return z.object(
    Object.entries(shape).reduce<Record<string, z.ZodType>>(
      (acc, [prop, PropSchema]) => ({
        ...acc,
        [prop]: Nullable(PropSchema),
      }),
      {},
    ),
  );
};
