"use client";

import Image from "next/image";
import { useLocale } from "next-intl";

import type { CreatorChallenge } from "@/types";
import { ExpandableCard } from "@/ui/components/ExpandableCard";
import { RichText } from "@/ui/components/RichText-dep";

export interface ICreatorChallengeTileProps {
  data: CreatorChallenge;
  past?: boolean;
  className?: string;
}

export function CreatorChallengeTile({
  data: { title, image, organizer, registration, content },
  past,
  className,
}: ICreatorChallengeTileProps) {
  const locale = useLocale();

  return (
    <ExpandableCard
      title={title[locale]}
      description={organizer.name}
      image={image}
      logo={
        <a href={organizer.website} target="_blank" rel="noopener">
          <Image
            alt="Logo"
            className="h-auto w-20"
            src={organizer.image.src}
            width={organizer.image.width}
            height={organizer.image.height}
            placeholder={organizer.image.blurDataURL ? "blur" : undefined}
            blurDataURL={organizer.image.blurDataURL}
          />
        </a>
      }
      content={
        <div className="flex flex-col gap-4">
          <RichText
            content={content[locale]}
            className="prose prose-p:m-1 prose-li:m-0"
          />
        </div>
      }
      cta={
        !past && registration
          ? {
              label: "Apply Now",
              url: registration,
            }
          : undefined
      }
      className={className}
    />
  );
}
