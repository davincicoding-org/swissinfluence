"use client";

import type { PaperProps } from "@mantine/core";
import { ActionIcon, Flex, Paper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import type { ProfilePicture, Socials } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { cn } from "@/ui/utils";

import { SocialMediaPlatformIcon } from "./SocialMediaPlatformIcon";
import { TextOverflowReveal } from "./TextOverflowReveal";

export interface IPersonaCardProps {
  name: string;
  description?: string;
  revealed?: boolean;
  image: ProfilePicture;
  socials?: NonNullable<Socials>;
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
        resource={image}
        alt={name}
        className="block aspect-square"
        imgClassName="transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      <div
        className={cn(
          "absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pb-4 pr-3 text-white transition-opacity duration-300 group-hover:opacity-100",
          (isTouchDevice ?? revealed) ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute inset-x-0 bottom-0 flex w-full min-w-0 items-end justify-between gap-1 pb-4 pr-3">
          <div className="min-w-0 shrink">
            <TextOverflowReveal
              text={name}
              classNames={{
                root: "mb-1",
                text: cn(
                  "pl-4 text-lg font-medium tracking-widest text-white",
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
                  "text-pretty px-4 font-light leading-snug text-neutral-300 empty:hidden",
                  classNames?.description,
                )}
              >
                {description}
              </p>
            </div>
          </div>
          <Flex gap={4} direction="column">
            {socials.map((social) => (
              <ActionIcon
                key={social.platform}
                component="a"
                href={social.url}
                target="_blank"
                variant="subtle"
                color="white"
                radius="md"
                size="lg"
                className="transition-colors hover:text-mocha-500"
              >
                <SocialMediaPlatformIcon
                  platform={social.platform}
                  size={32}
                  stroke={1.25}
                />
              </ActionIcon>
            ))}
          </Flex>
        </div>
      </div>
    </Paper>
  );
}
