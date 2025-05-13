import { getMedia } from "@/cms/lib/server";

import { LandingPage as View } from "@/ui/features/landing";
import { isPreview } from "@/cms/preview";

export default async function LandingPage() {
  const preview = await isPreview();
  const media = await getMedia(preview);

  return (
    <View
      heroVideo={media.landing.videos.hero}
      images={{
        award: media.award.images.hero,
        forum: media.forum.images.hero,
        network: media.network.images.hero,
        academy: media.academy.images.hero,
      }}
    />
  );
}
