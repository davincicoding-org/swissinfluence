import IMAGES from "@/backup/images.json";
import VIDEOS from "@/backup/videos.json";
import { LandingPage as View } from "@/ui/features/landing";

export default async function LandingPage() {
  return (
    <View
      heroVideo={
        VIDEOS.find((item) => item.name === "HERO" && item.group === "LANDING")!
      }
      images={{
        award: IMAGES.find(
          (item) => item.name === "HERO" && item.group === "AWARD",
        )!,
        convention: IMAGES.find(
          (item) => item.name === "HERO" && item.group === "CONVENTION",
        )!,
        network: IMAGES.find(
          (item) => item.name === "HERO" && item.group === "NETWORK",
        )!,
        academy: IMAGES.find(
          (item) => item.name === "HERO" && item.group === "ACADEMY",
        )!,
      }}
    />
  );
}
