import "@/cms/lib/server";
import type constants from "./constants.json";
import type media from "./media.json";

type Media = typeof media;
type Constants = typeof constants;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AppMediaContent extends Media {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AppConstantsContent extends Constants {}
}
