"use client";

import Image from "next/image";

import { ActionIcon, Flex, Paper, type PaperProps } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { type ImageMedia } from "@/cms/lib/fields";
import { cn } from "@/ui/utils";

import { type SocialMedia } from "@/cms/common";

import { SocialMediaPlatformIcon } from "./SocialMediaPlatformIcon";
import { TextOverflowReveal } from "./TextOverflowReveal";

export interface IPersonaCardProps {
  name: string;
  description?: string;
  revealed?: boolean;
  image: ImageMedia;
  socials?: Array<SocialMedia>;
  compact?: boolean;
  classNames?: {
    name?: string;
    description?: string;
  };
}

export function PersonaCard({
  name,
  description,
  image,
  revealed,
  socials = [],
  classNames,
  className,
  compact,
  ...paperProps
}: IPersonaCardProps & Omit<PaperProps, "classNames">) {
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
        src={image.src}
        width={image.width}
        height={image.height}
        placeholder={image.blurDataURL ? "blur" : undefined}
        blurDataURL={image.blurDataURL}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div
        className={cn(
          "absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pr-3 pb-4 text-white transition-opacity duration-300 group-hover:opacity-100",
          (isTouchDevice ?? revealed) ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute inset-x-0 bottom-0 pr-3 pb-4">
          <TextOverflowReveal
            text={name}
            classNames={{
              root: "mb-1",
              text: cn(
                "text-lg pl-4 font-medium tracking-widest text-white",
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
                "px-4 leading-snug font-light text-pretty text-neutral-300 empty:hidden",
                classNames?.description,
              )}
            >
              {description}
            </p>
            <Flex gap={4} className={cn("px-4", { "px-1": compact })}>
              {socials.map((social) => (
                <ActionIcon
                  key={social.platform}
                  component="a"
                  href={social.url}
                  target="_blank"
                  variant="subtle"
                  color="white"
                  radius="md"
                  className="hover:text-mocha-500 transition-colors"
                >
                  <SocialMediaPlatformIcon
                    platform={social.platform}
                    size={28}
                    stroke={1.25}
                  />
                </ActionIcon>
              ))}
            </Flex>
          </div>
        </div>
      </div>
    </Paper>
  );
}
