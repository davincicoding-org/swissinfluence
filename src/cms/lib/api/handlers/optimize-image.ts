import { type NextRequest, NextResponse } from "next/server";
import {
  createImageResponse,
  optimizeImage,
  processFormData,
} from "../../fields/image/optimization/optimizeImage";

export const handleOptimizeImage = async (request: NextRequest) => {
  const data = await processFormData(await request.formData());
  if (!data) return NextResponse.error();

  const optimizedImage = await optimizeImage(data.image, data.options);

  return createImageResponse(optimizedImage);
};
