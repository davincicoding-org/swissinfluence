"use client";

import type { PaperProps } from "@mantine/core";
import type { HTMLAttributes, MouseEvent } from "react";
import { ActionIcon, Paper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import type { ProfilePicture, Socials } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { cn } from "@/ui/utils";

import { SocialMediaPlatformIcon } from "./SocialMediaPlatformIcon";
import { TextOverflowReveal } from "./TextOverflowReveal";

export interface PersonaCardProps {
  name: string;
  description?: string;
  revealed?: boolean;
  image: ProfilePicture;
  imageSizes?: string;
  socials?: NonNullable<Socials>;
  compact?: boolean;
  classNames?: {
    name?: string;
    description?: string;
  };
  onSocialClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

// TODO start text scroll when revealed

export function PersonaCard({
  name,
  description,
  image,
  revealed,
  imageSizes,
  socials = [],
  classNames,
  className,
  compact,
  onSocialClick,
  ...paperProps
}: PersonaCardProps &
  Omit<PaperProps, "classNames"> &
  HTMLAttributes<HTMLDivElement>) {
  const isTouchDevice = useMediaQuery("(hover: none)");

  return (
    <Paper
      shadow="xs"
      withBorder
      radius="lg"
      className={cn("group relative overflow-hidden", className)}
      {...paperProps}
    >
      <Image
        resource={image}
        alt={name}
        className="block aspect-square"
        imgClassName="transition-transform duration-500 group-hover:scale-110"
        sizes={imageSizes}
      />

      <div
        className={cn(
          "absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pb-4 pr-3 text-white transition-opacity duration-300 group-hover:opacity-100",
          isTouchDevice || revealed ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="user-select-none absolute inset-x-0 bottom-0 flex w-full min-w-0 items-end justify-between gap-1 pb-3 pr-2">
          <div className="min-w-0 shrink">
            <TextOverflowReveal
              text={name}
              classNames={{
                text: cn(
                  "select-none pl-4 text-lg font-medium tracking-widest text-white",
                  classNames?.name,
                ),
              }}
            />
            <div
              className={cn("flex", {
                "flex-col gap-1": !compact,
                "-mt-2 items-end justify-between": compact,
              })}
            >
              <p
                className={cn(
                  "select-none text-pretty px-4 font-light leading-snug text-neutral-300 empty:hidden",
                  classNames?.description,
                )}
              >
                {description}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 empty:hidden">
            {socials.map((social) => (
              <ActionIcon
                key={social.platform}
                component="a"
                href={social.url}
                aria-label={social.platform}
                target="_blank"
                variant="subtle"
                color="white"
                radius="md"
                size="lg"
                className="transition-colors hover:text-mocha-500"
                onClick={onSocialClick}
              >
                <SocialMediaPlatformIcon
                  platform={social.platform}
                  size={32}
                  stroke={1.25}
                />
              </ActionIcon>
            ))}
          </div>
        </div>
      </div>
    </Paper>
  );
}
