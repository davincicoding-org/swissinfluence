"use client";

import type { ActionIconProps, FlexProps, HoverCardProps } from "@mantine/core";
import { useMemo } from "react";
import { ActionIcon, Flex, HoverCard } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";

import { type SocialMedia } from "@/cms/common/socials";

import { SocialMediaPlatformIcon } from "./SocialMediaPlatformIcon";

export interface ISocialsProps {
  items: Array<SocialMedia>;
  ActionIconProps?: Omit<ActionIconProps, "children" | "className">;
  HoverCardProps?: Omit<HoverCardProps, "children" | "className">;
}

// MAYBE move to PersonaTile
export function Socials({
  items,
  ActionIconProps,
  HoverCardProps,
  ...flexProps
}: ISocialsProps & FlexProps) {
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
    <Flex gap={4} {...flexProps}>
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
        <HoverCard
          withinPortal={false}
          position="top-start"
          radius="md"
          {...HoverCardProps}
        >
          <HoverCard.Target>
            <ActionIcon
              variant="subtle"
              size="sm"
              color="white"
              radius="md"
              className="h-[var(--ai-size-lg)] transition-colors hover:text-mocha-500"
              {...ActionIconProps}
            >
              <IconDotsVertical />
            </ActionIcon>
          </HoverCard.Target>
          <HoverCard.Dropdown className="flex flex-col gap-1 border-none bg-transparent p-1">
            {stacked.map((social) => (
              <ActionIcon
                key={social.platform}
                component="a"
                href={social.url}
                target="_blank"
                variant="subtle"
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
    </Flex>
  );
}
