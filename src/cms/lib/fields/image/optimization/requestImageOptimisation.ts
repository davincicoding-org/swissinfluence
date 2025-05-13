import { type IImageOptimisationOptions } from "./types";

export const requestImageOptimisation = async (
  image: File | string,
  options: IImageOptimisationOptions = {}
) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("options", JSON.stringify(options));

  return fetch("api/cms/optimize-image", {
    method: "POST",
    body: formData,
  }).then(async (response) => {
    const width = Number(response.headers.get("x-image-width"));
    const height = Number(response.headers.get("x-image-height"));
    const blurDataURL = String(response.headers.get("x-blur-data-url"));
    const format = String(response.headers.get("x-image-format"));
    const blob = await response.blob();

    return {
      file: new File([blob], `optimized.${format}`, { type: blob.type }),
      width,
      height,
      blurDataURL,
    };
  });
};
