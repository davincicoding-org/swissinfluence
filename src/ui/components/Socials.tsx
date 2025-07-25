"use client";

import type { ActionIconProps, HoverCardProps } from "@mantine/core";
import { useMemo } from "react";
import { ActionIcon, HoverCard } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";

import type { Socials } from "@/payload-types";

import { cn } from "../utils";
import { SocialMediaPlatformIcon } from "./SocialMediaPlatformIcon";

export interface SocialsProps {
  className?: string;
  items: NonNullable<Socials>;
  ActionIconProps?: Omit<ActionIconProps, "children" | "className">;
  HoverCardProps?: Omit<HoverCardProps, "children" | "className">;
}

export function Socials({
  items,
  ActionIconProps,
  HoverCardProps,
  className,
  ...flexProps
}: SocialsProps) {
  const { inline, stacked } = useMemo(() => {
    if (items.length <= 2)
      return {
        inline: items,
        stacked: undefined,
      };

    return {
      inline: items.slice(0, 1),
      stacked: items.slice(1),
    };
  }, [items]);

  return (
    <div className={cn("flex gap-1", className)} {...flexProps}>
      {inline.map((social) => (
        <ActionIcon
          key={social.platform}
          component="a"
          href={social.url}
          target="_blank"
          variant="subtle"
          size="lg"
          color="white"
          radius="md"
          aria-label={social.platform}
          className="transition-colors hover:text-mocha-500"
          {...ActionIconProps}
        >
          <SocialMediaPlatformIcon
            platform={social.platform}
            size={30}
            stroke={1.25}
          />
        </ActionIcon>
      ))}

      {stacked ? (
        <HoverCard position="top" offset={-34} radius="md" {...HoverCardProps}>
          <HoverCard.Target>
            <ActionIcon
              variant="transparent"
              size="sm"
              color="white"
              radius="md"
              className={cn(
                "h-[var(--ai-size-lg)] transition-opacity aria-[expanded=true]:opacity-0",
              )}
              aria-label="More social links"
              {...ActionIconProps}
            >
              <IconDotsVertical />
            </ActionIcon>
          </HoverCard.Target>
          <HoverCard.Dropdown className="flex flex-col gap-1 border-none bg-transparent p-0">
            {stacked.map((social) => (
              <ActionIcon
                key={social.platform}
                component="a"
                href={social.url}
                target="_blank"
                variant="transparent"
                size="lg"
                color="white"
                radius="md"
                className="transition-colors hover:text-mocha-500"
                {...ActionIconProps}
              >
                <SocialMediaPlatformIcon
                  platform={social.platform}
                  size={30}
                  stroke={1.25}
                />
              </ActionIcon>
            ))}
          </HoverCard.Dropdown>
        </HoverCard>
      ) : null}
    </div>
  );
}
