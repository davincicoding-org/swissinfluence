import { fetchMediaLibrary } from "@/server/media-library";
import { LandingPage as View } from "@/ui/features/landing";

export default async function LandingPage() {
  const media = await fetchMediaLibrary();
  return (
    <View
      heroVideo={media.LANDING.HERO}
      images={{
        award: media.AWARD.HERO,
        convention: media.CONVENTION.HERO,
        network: media.NETWORK.HERO,
        academy: media.ACADEMY.HERO,
      }}
    />
  );
}
