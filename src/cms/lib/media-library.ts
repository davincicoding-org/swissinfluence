import { z } from "zod/v4";

export type MediaLibraryConfig = Record<
  string,
  Record<string, "image" | "video">
>;

export const imageAssetSchema = z.object({
  src: z.string(),
  height: z.number(),
  width: z.number(),
  blurDataURL: z.string(),
  caption: z.record(z.string(), z.string()).nullable().optional(),
});

export type ImageAsset = z.infer<typeof imageAssetSchema>;

export const videoAssetSchema = z.object({
  src: z.string(),
});

export type VideoAsset = z.infer<typeof videoAssetSchema>;

const buildMediaLibrarySchema = (config: MediaLibraryConfig) => {
  const shape: Record<string, z.ZodType> = {};
  for (const [group, assets] of Object.entries(config)) {
    const groupShape: Record<string, z.ZodType> = {};
    for (const [asset, type] of Object.entries(assets)) {
      switch (type) {
        case "image":
          groupShape[asset] = imageAssetSchema;
          break;
        case "video":
          groupShape[asset] = videoAssetSchema;
          break;
      }
    }
    shape[group] = z.object(groupShape);
  }
  return z.object(shape);
};

type ResolvedMediaLibrary<T extends MediaLibraryConfig> = {
  [Group in keyof T]: {
    [Name in keyof T[Group]]: T[Group][Name] extends "image"
      ? ImageAsset
      : T[Group][Name] extends "video"
        ? ImageAsset
        : never;
  };
};

export const createMediaLibararyFetcher = <T extends MediaLibraryConfig>({
  config,
  fetchImageAsset,
  fetchVideoAsset,
}: {
  config: T;
  fetchImageAsset: (
    group: string,
    name: string,
  ) => Promise<ImageAsset | null | undefined>;
  fetchVideoAsset: (
    group: string,
    name: string,
  ) => Promise<VideoAsset | null | undefined>;
}) => {
  const schema = buildMediaLibrarySchema(config);

  return async (): Promise<ResolvedMediaLibrary<T>> => {
    const result: Record<string, Record<string, unknown>> = {};
    for (const [group, assets] of Object.entries(config)) {
      result[group] = {};
      for (const [name, type] of Object.entries(assets)) {
        switch (type) {
          case "image":
            result[group][name] = await fetchImageAsset(group, name);
            break;
          case "video":
            result[group][name] = await fetchVideoAsset(group, name);
            break;
        }
      }
    }
    return schema.parse(result) as ResolvedMediaLibrary<T>;
  };
};
