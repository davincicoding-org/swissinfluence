import { fetchMedia } from "@/server/media-library";
import { LandingPage as View } from "@/ui/features/landing";

export default async function LandingPage() {
  const media = await fetchMedia();

  return (
    <View
      heroVideo={media.landing.hero}
      images={{
        award: media.award.hero,
        convention: media.convention.hero,
        network: media.network.hero,
        academy: media.academy.hero,
      }}
    />
  );
}
