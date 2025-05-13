import {
  IconBrandApplePodcast,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandSpotify,
  IconBrandTiktok,
  IconBrandTwitch,
  IconBrandYoutube,
  type IconProps,
  IconWorld,
} from "@tabler/icons-react";

import type { SocialMediaPlatform } from "@/cms/common";

export interface ISocialMediaPlatformIconProps {
  platform: SocialMediaPlatform;
}

export function SocialMediaPlatformIcon({
  platform,
  ...iconProps
}: ISocialMediaPlatformIconProps & IconProps) {
  switch (platform) {
    case "INSTAGRAM":
      return <IconBrandInstagram {...iconProps} />;
    case "TIKTOK":
      return <IconBrandTiktok {...iconProps} />;
    case "LINKEDIN":
      return <IconBrandLinkedin {...iconProps} />;
    case "YOUTUBE":
      return <IconBrandYoutube {...iconProps} />;
    case "APPLE_PODCAST":
      return <IconBrandApplePodcast {...iconProps} />;
    case "SPOTIFY":
      return <IconBrandSpotify {...iconProps} />;
    case "TWITCH":
      return <IconBrandTwitch {...iconProps} />;
    case "WEBSITE":
      return <IconWorld {...iconProps} />;
  }
}
