import type { HTMLAttributes, MouseEvent } from "react";
import { isMobile } from "react-device-detect";

import type { ProfilePicture, Socials } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { cn } from "@/ui/utils";

import { SocialsLinks } from "./SocialLinks";
import { TextOverflowReveal } from "./TextOverflowReveal";

export interface PersonaCardProps {
  name: string;
  header?: string;
  description?: string;
  revealed?: boolean;
  image: ProfilePicture;
  imageSizes?: string;
  socials?: NonNullable<Socials>;
  className?: string;
  classNames?: {
    root?: string;
    content?: string;
    image?: string;
    header?: string;
    name?: string;
    description?: string;
    socials?: string;
    socialItem?: string;
    socialIcon?: string;
  };
  onSocialClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

// TODO start text scroll when revealed

export function PersonaCard({
  name,
  header,
  description,
  image,
  revealed,
  imageSizes,
  socials = [],
  classNames,
  className,
  onSocialClick,
  ...attrs
}: PersonaCardProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group @container/persona-card relative overflow-hidden rounded-box bg-base-100 shadow-sm",
        className,
        classNames?.root,
      )}
      {...attrs}
    >
      <Image
        resource={image}
        alt={name}
        className={cn("block aspect-square", classNames?.image)}
        imgClassName="transition-transform duration-500 group-hover:scale-110"
        sizes={imageSizes}
      />

      <div
        className={cn(
          "select-noneto-transparent te xt-white absolute inset-0 flex items-end justify-between gap-2 bg-linear-to-t from-black/80 via-black/20 transition-opacity duration-300 group-hover:opacity-100",
          isMobile || revealed ? "opacity-100" : "opacity-0",
          classNames?.content,
        )}
      >
        <div className="absolute inset-x-0 bottom-0 flex w-full min-w-0 items-end justify-between p-[6cqw]">
          <div className="min-w-0">
            <p className="text-[6cqw] leading-tight font-medium tracking-widest text-white">
              {header}
            </p>
            <TextOverflowReveal
              text={name}
              classNames={{
                root: "-mx-[6cqw]",
                text: cn(
                  "pl-[6cqw] text-[7cqw] leading-normal font-medium tracking-widest text-white",
                  classNames?.name,
                ),
              }}
            />
            <p
              className={cn(
                "text-[5cqw] leading-snug font-light text-pretty text-base-300 empty:hidden",
                classNames?.description,
              )}
            >
              {description}
            </p>
          </div>
          {socials.length > 0 && (
            <SocialsLinks
              items={socials}
              direction="column"
              maxItems={1}
              onItemClick={onSocialClick}
              classNames={{
                root: cn(
                  "-mr-[2cqw] -mb-[2cqw] text-white",
                  classNames?.socials,
                ),
                item: cn("size-[15cqw]", classNames?.socialItem),
                icon: classNames?.socialIcon,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
