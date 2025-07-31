import type { HTMLAttributes, MouseEvent, PropsWithChildren } from "react";
import { isMobile } from "react-device-detect";

import type { ProfilePicture, Socials } from "@/payload-types";
import type { SlotClassNames } from "@/ui/utils";
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
  maxSocials?: number;
  className?: string;
  classNames?: SlotClassNames<
    | "content"
    | "image"
    | "header"
    | "name"
    | "description"
    | "socials"
    | "socialItem"
    | "socialIcon"
  >;
  onSocialClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function PersonaCard({
  name,
  header,
  description,
  image,
  revealed = isMobile,
  imageSizes,
  socials = [],
  maxSocials,
  classNames,
  className,
  onSocialClick,
  ...attrs
}: PersonaCardProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <PersonaCardContainer
      className={cn(className, classNames?.root)}
      {...attrs}
    >
      <Image
        resource={image}
        alt={name}
        className={cn("block size-full", classNames?.image)}
        imgClassName="transition-transform duration-700 group-hover:scale-110"
        sizes={imageSizes}
      />

      <div
        className={cn(
          "absolute inset-0 flex items-end justify-between gap-2 bg-linear-to-t from-black/80 via-black/20 to-transparent text-white transition-opacity duration-300 select-none group-hover:opacity-100",
          revealed ? "opacity-100" : "opacity-0",
          classNames?.content,
        )}
      >
        <div className="absolute inset-x-0 bottom-0 flex w-full min-w-0 items-end justify-between p-[6cqw]">
          <div className="min-w-0">
            <p
              className={cn(
                "mb-[1.5cqw] text-[6cqw] leading-tight font-medium tracking-widest",
                classNames?.header,
              )}
            >
              {header}
            </p>
            <div className="-mx-[6cqw] pr-[6cqw]">
              <TextOverflowReveal
                text={name}
                disabled={!revealed}
                classNames={{
                  text: cn(
                    "pl-[6cqw]",
                    "text-[7cqw] leading-[1.15] font-medium tracking-widest text-pretty text-white",
                    classNames?.name,
                  ),
                }}
              />
            </div>
            <p
              className={cn(
                "mt-[1.5cqw] text-[5cqw] leading-snug font-light text-pretty opacity-80 empty:hidden",
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
              maxItems={maxSocials}
              onItemClick={onSocialClick}
              classNames={{
                root: cn("-mr-[2cqw] -mb-[2cqw]", classNames?.socials),
                dropdown: "backdrop-blur-sm",
                item: cn("size-[15cqw]", classNames?.socialItem),
                icon: classNames?.socialIcon,
              }}
            />
          )}
        </div>
      </div>
    </PersonaCardContainer>
  );
}

export function PersonaCardContainer({
  children,
  className,
  ...attrs
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        "group @container relative aspect-square overflow-hidden rounded-box bg-base-100 shadow-sm",
        className,
      )}
      {...attrs}
    >
      {children}
    </div>
  );
}
