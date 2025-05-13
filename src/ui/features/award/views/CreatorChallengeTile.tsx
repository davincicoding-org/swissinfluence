"use client";

import Image from "next/image";

import { useLocale } from "next-intl";

import { ExpandableCard } from "@/ui/components/ExpandableCard";
import { RichText } from "@/ui/components/RichText";
import { type SupportedLocale } from "@/i18n/config";

import { type ICreatorChallenge } from "../data";

export interface ICreatorChallengeTileProps {
  data: ICreatorChallenge;
  past?: boolean;
  className?: string;
}

export function CreatorChallengeTile({
  data: { title, image, organizer, registrationURL, description },
  past,
  className,
}: ICreatorChallengeTileProps) {
  const locale = useLocale() as SupportedLocale;

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
            content={description[locale]}
            className="prose prose-p:m-1 prose-li:m-0"
          />
        </div>
      }
      cta={
        !past && registrationURL
          ? {
              label: "Apply Now",
              url: registrationURL,
            }
          : undefined
      }
      className={className}
    />
  );
}
