"use client";

import Image from "next/image";

import type { CreatorChallenge } from "@/types";
import { ExpandableCard } from "@/ui/components/ExpandableCard";
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
            alt="Logo"
            className="h-auto w-20"
            src={organizerLogo.url ?? ""}
            width={organizerLogo.width ?? 0}
            height={organizerLogo.height ?? 0}
            // placeholder={organizerLogo.blurDataURL ? "blur" : undefined}
            // blurDataURL={organizerLogo.blurDataURL}
          />
        </a>
      }
      content={
        <div className="flex flex-col gap-4">
          <RichText
            data={data.content}
            className="prose prose-p:m-1 prose-li:m-0"
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
