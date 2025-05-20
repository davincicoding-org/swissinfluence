import { z } from "zod";
import { LocaleEnum, TextTranslatorSchema } from "./i18n/config";
import { MediaFetcherSchema } from "./media/config";
// FIXME
import { db, bucket } from "@/database/firebase";
import { type MediaContent, MediaDocumentSchema } from "./media/schema";

const TempFileUploader = z
  .function()
  .args(z.instanceof(File))
  .returns(
    z.promise(
      z.object({
        publicUrl: z.string(),
        delete: z.function().returns(z.promise(z.void())),
      }),
    ),
  );

const ConfigSchema = z.object({
  fetchMedia: MediaFetcherSchema,
  uploadTempFile: TempFileUploader,
  locales: z.array(LocaleEnum).nonempty(),
  defaultLocale: LocaleEnum,
  translateText: TextTranslatorSchema.optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export let currentConfig: Config = {
  fetchMedia: () =>
    db
      .collection("media")
      .get()
      .then(({ docs }) =>
        docs.reduce<MediaContent>(
          (acc, doc) => ({
            ...acc,
            [doc.id]: MediaDocumentSchema.parse(doc.data()).media,
          }),
          {},
        ),
      ),
  uploadTempFile: async (file) => {
    const name = `${Date.now()}.${file.name.split(".").reverse()[0]}`;

    const tempFile = bucket.file(`tmp/${name}`);

    const buffer = Buffer.from(await file.arrayBuffer());
    await tempFile.save(buffer);
    await tempFile.makePublic();

    return {
      publicUrl: tempFile.publicUrl(),
      delete: async () => {
        await tempFile.delete();
      },
    };
  },
  locales: LocaleEnum.options,
  defaultLocale: "en",
  translateText: () => Promise.resolve("en"),
};

export const configureCMS = (config: Config): Config => {
  currentConfig = config;
  return config;
};

export const getConfig = (): Config => {
  return ConfigSchema.parse(currentConfig);
};
