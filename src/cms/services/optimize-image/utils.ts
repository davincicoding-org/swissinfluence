import sharp, { type WebpOptions, type ResizeOptions } from "sharp";

import {
  type IImageOptimisationOptions,
  IMAGE_COMPRESSION_PRESETS,
} from "./types";

export const resolveCompressionOption = (
  options: IImageOptimisationOptions,
): WebpOptions => {
  const defaultOptions: WebpOptions = {
    effort: 6,
  };

  if (!options.compression) return defaultOptions;

  if (typeof options.compression === "string")
    return {
      ...IMAGE_COMPRESSION_PRESETS[options.compression],
      ...defaultOptions,
    };

  return {
    ...options.compression,
    ...defaultOptions,
  };
};

export const resolveResizeOption = async (
  buffer: Buffer | ArrayBuffer,
  options: IImageOptimisationOptions,
): Promise<ResizeOptions> => {
  if (!options.resize) return {};
  const { square, height, width, fit } = options.resize;

  if (square) {
    const metadata = await sharp(buffer).metadata();
    if (metadata.width === undefined) return {};
    if (metadata.height === undefined) return {};
    const size = Math.min(square, metadata.height, metadata.width);
    return { height: size, width: size, fit: "cover" };
  }

  if (height === undefined && width === undefined) return {};

  return { height, width, fit, withoutEnlargement: true };
};
