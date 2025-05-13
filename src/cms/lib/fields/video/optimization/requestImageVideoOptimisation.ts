import { z } from "zod";
import type { VideoSource } from "../schema";

export const requestImageVideoOptimisation = async (video: File | string) => {
  const formData = new FormData();
  formData.append("file", video);

  const response = await fetch("/api/cms/optimize-video", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Video optimization failed");
  }

  const outputs = z
    .array(
      z.object({
        src: z.string(),
        type: z.string(),
        name: z.string(),
      }),
    )
    .parse(await response.json());

  return Promise.all(
    outputs.map<Promise<VideoSource>>(async ({ src, type, name }) => ({
      rawFile: new File([await fetch(src).then((res) => res.blob())], name, {
        type,
      }),
      src,
      type,
    })),
  );
};
