import type { Metadata } from "sharp";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod/v4";

import type { IImageOptimisationOptions } from "./types";
import { ImageOptimisationOptionsSchema } from "./types";
import { resolveCompressionOption, resolveResizeOption } from "./utils";

export const processFormData = async (formData: FormData) => {
  const { data, success } = await z
    .object({
      image: z.union([
        z.instanceof(File).transform((file) => file.arrayBuffer()),
        z
          .string()
          .transform((src) => fetch(src).then((res) => res.arrayBuffer())),
      ]),
      options: ImageOptimisationOptionsSchema,
    })
    .safeParseAsync({
      image: formData.get("image"),
      options: ((): unknown => {
        const payload = formData.get("options");
        if (typeof payload !== "string") return {};
        return JSON.parse(payload);
      })(),
    });

  if (!success) return null;

  return data;
};

export interface IOptimizedImage {
  buffer: Buffer;
  blurDataURL: string;
  metadata: Metadata;
}

export const optimizeImage = async (
  buffer: Buffer | ArrayBuffer,
  options: IImageOptimisationOptions,
): Promise<IOptimizedImage> => {
  const originalImage = sharp(buffer);
  const croppedImage = options.extract
    ? originalImage.extract(options.extract)
    : originalImage;
  const resizedImage = options.resize
    ? croppedImage.resize(await resolveResizeOption(buffer, options))
    : croppedImage;

  const optimizedBuffer = await resizedImage
    .webp(resolveCompressionOption(options))
    .toBuffer();

  const metadata = await sharp(optimizedBuffer).metadata();

  const placeholder = await sharp(optimizedBuffer).resize(10).toBuffer();
  const base64 = placeholder.toString("base64");
  const blurDataURL = `data:image/png;base64,${base64}`;

  return {
    buffer: optimizedBuffer,
    blurDataURL,
    metadata,
  };
};

export const createImageResponse = ({
  buffer,
  metadata,
  blurDataURL,
}: IOptimizedImage) =>
  new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "x-image-width": metadata.width?.toString() ?? "",
      "x-blur-data-url": blurDataURL,
      "x-image-height": metadata.height?.toString() ?? "",
    },
  });
