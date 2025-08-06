"use client";

import { create as createMotion } from "motion/react-m";
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
  disableImageZoom?: boolean;
  socials?: Socials;
  ref?: React.Ref<HTMLDivElement | null>;
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
  onSocialClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function PersonaCard({
  name,
  header,
  description,
  image,
  revealed = isMobile,
  imageSizes,
  disableImageZoom,
  socials = [],
  maxSocials,
  classNames,
  className,
  ref,
  onSocialClick,
  ...attrs
}: PersonaCardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <PersonaCardContainer
      className={cn(className, classNames?.root)}
      ref={ref}
      {...attrs}
    >
      <Image
        resource={image}
        alt={name}
        className={cn("block size-full", classNames?.image)}
        imgClassName={cn("transition-transform duration-700", {
          "group-hover:scale-110": !disableImageZoom,
        })}
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
                "mb-[1.5cqw] text-[6cqw] leading-tight font-medium tracking-widest empty:hidden",
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
                    "text-[8cqw] leading-[1.15] tracking-widest text-pretty text-white",
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
          {socials && socials.length > 0 && (
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
  ref,
  ...attrs
}: React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement | null>;
  }
>) {
  return (
    <div
      className={cn(
        "group @container relative aspect-square overflow-hidden rounded-box bg-base-100 shadow-sm",
        className,
      )}
      ref={ref}
      {...attrs}
    >
      {children}
    </div>
  );
}

export const MotionPersonaCard = createMotion(PersonaCard);
