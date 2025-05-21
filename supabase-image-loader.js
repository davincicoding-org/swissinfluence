import { env } from "@/env";

/**
 * @param {{ src: string, width: number, quality: number }} params
 * @returns {string}
 */
export default function supabaseLoader({ src, width, quality }) {
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/${src}?width=${width}&quality=${quality || 75}`;
}
