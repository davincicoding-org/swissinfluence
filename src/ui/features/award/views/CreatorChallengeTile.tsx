"use client";

import type { CreatorChallenge } from "@/types";
import { ExpandableCard } from "@/ui/components/ExpandableCard";
import { Image } from "@/ui/components/Image";
import { RichText } from "@/ui/components/RichText";
import { ensureResolved } from "@/utils/payload";

export interface ICreatorChallengeTileProps {
  data: CreatorChallenge;
  past?: boolean;
  className?: string;
}

export function CreatorChallengeTile({
  data,
  past,
  className,
}: ICreatorChallengeTileProps) {
  const image = ensureResolved(data.image)!;
  const organizerLogo = ensureResolved(data.organizer.logo)!;

  return (
    <ExpandableCard
      title={data.title}
      description={data.organizer.name}
      image={image}
      logo={
        <a href={data.organizer.website} target="_blank" rel="noopener">
          <Image
            resource={organizerLogo}
            alt="Logo"
            className="h-auto w-20"
            sizes="(max-width: 768px) 160px, 256px"
          />
        </a>
      }
      content={
        <div className="flex flex-col gap-4">
          <RichText
            data={data.content}
          />
        </div>
      }
      cta={
        !past && data.registrationUrl
          ? {
              label: "Apply Now",
              url: data.registrationUrl,
            }
          : undefined
      }
      className={className}
    />
  );
}
