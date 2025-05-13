import { NextResponse } from "next/server";

import sharp, { type Metadata, type Sharp } from "sharp";
import { z } from "zod";

import {
  type IImageOptimisationOptions,
  ImageOptimisationOptionsSchema,
} from "./types";
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
  format: string;
}

export const optimizeImage = async (
  buffer: Buffer | ArrayBuffer,
  options: IImageOptimisationOptions,
): Promise<IOptimizedImage> => {
  const originalImage = sharp(buffer);

  const originalMetadata = await originalImage.metadata();

  if (originalMetadata.format === "svg") {
    return {
      buffer: Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer),
      metadata: originalMetadata,
      blurDataURL: await generateBlurDataURL(originalImage),
      format: "svg",
    };
  }

  const croppedImage = options.extract
    ? originalImage.extract(options.extract)
    : originalImage;
  const resizedImage = options.resize
    ? croppedImage.resize(await resolveResizeOption(buffer, options))
    : croppedImage;

  const optimizedImage = resizedImage.webp(resolveCompressionOption(options));

  return {
    buffer: await optimizedImage.toBuffer(),
    metadata: await optimizedImage.metadata(),
    blurDataURL: await generateBlurDataURL(optimizedImage),
    format: "webp",
  };
};

async function generateBlurDataURL(image: Sharp) {
  const placeholder = await image.resize(10).toBuffer();
  const base64 = placeholder.toString("base64");
  const blurDataURL = `data:image/png;base64,${base64}`;
  return blurDataURL;
}

export const createImageResponse = ({
  buffer,
  metadata,
  blurDataURL,
  format,
}: IOptimizedImage) =>
  new NextResponse(buffer, {
    headers: {
      "Content-Type": format === "svg" ? "image/svg+xml" : `image/${format}`,
      "x-image-width": metadata.width?.toString() ?? "",
      "x-image-height": metadata.height?.toString() ?? "",
      "x-blur-data-url": blurDataURL,
      "x-image-format": format,
    },
  });
