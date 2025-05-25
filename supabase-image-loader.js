import { env } from "@/env";

/**
 * Image loader function for Supabase storage
 * @param {Object} params - The image parameters
 * @param {string} params.src - The source path or URL of the image
 * @param {number} params.width - The desired width of the image
 * @param {number} [params.quality=75] - The quality of the image (1-100)
 * @returns {string} The transformed image URL
 */
export default function supabaseLoader({ src, width, quality }) {
  if (src.startsWith("http")) return src;
  if (src.startsWith("$")) return src.replace(/^\$/, "");

  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/${src}?width=${width}&resize=contain&quality=${quality || 75}`;
}
