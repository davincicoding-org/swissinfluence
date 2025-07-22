"use client";

import { ActionIcon, Menu, Paper } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";

import type { Expert } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { SocialMediaPlatformIcon } from "@/ui/components/SocialMediaPlatformIcon";
import { ensureResolved } from "@/utils/payload";

import { derivative } from "../utils";

export interface AwardJuryProps {
  members: Array<Expert>;
}

export function AwardJury({ members }: AwardJuryProps) {
  return (
    <>
      {/* Mobile View */}
      <div className="flex flex-col gap-4 md:hidden">
        {members.map((member, index) => {
          const image = ensureResolved(member.image);
          if (!image) return null;

          const { mainSocials, extraSocials } = derivative(() => {
            const socials = member.socials ?? [];
            if (socials.length <= 2)
              return {
                mainSocials: socials,
                extraSocials: [],
              };
            return {
              mainSocials: socials.slice(0, 1),
              extraSocials: socials.slice(1),
            };
          });

          return (
            <Paper
              key={member.id}
              radius="md"
              withBorder
              bg="gray.0"
              className="flex items-center p-2 max-sm:sticky"
              style={{ top: `${10 + index * 0.375}rem` }}
            >
              <Image
                resource={image}
                alt={member.name}
                className="h-20 w-20 shrink-0 rounded-md object-cover"
                sizes="128px"
              />
              <div className="grow pl-3">
                <p className="mb-1 font-semibold leading-tight">
                  {member.name}
                </p>
                <div>
                  <p className="text-pretty text-sm leading-tight text-neutral-600">
                    {member.description}
                  </p>
                </div>
              </div>
              <div
                className="my-auto flex shrink-0 flex-col gap-0.5"
                style={{ direction: "rtl" }}
              >
                {mainSocials.map((social) => (
                  <ActionIcon
                    key={social.platform}
                    component="a"
                    href={social.url}
                    target="_blank"
                    size="md"
                    variant="subtle"
                    color="default"
                    aria-label={social.platform}
                  >
                    <SocialMediaPlatformIcon
                      platform={social.platform}
                      size={28}
                      stroke={1}
                    />
                  </ActionIcon>
                ))}

                {extraSocials.length > 0 && (
                  <Menu
                    position="left"
                    radius="md"
                    offset={-31}
                    transitionProps={{ transition: "fade" }}
                  >
                    <Menu.Target>
                      <ActionIcon
                        size="md"
                        variant="subtle"
                        color="default"
                        aria-label="More social links"
                      >
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown p={0} bg="gray.0" className="flex">
                      {extraSocials.map((social) => (
                        <Menu.Item
                          key={social.platform}
                          p={2}
                          component="a"
                          href={social.url}
                          target="_blank"
                          aria-label={social.platform}
                        >
                          <SocialMediaPlatformIcon
                            platform={social.platform}
                            size={28}
                            stroke={1}
                          />
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                )}
              </div>
            </Paper>
          );
        })}
      </div>

      {/* Desktop View (Grid tiles) */}
      <div className="hidden grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-evenly gap-8 md:grid">
        {members.map((member) => (
          <PersonaCard
            key={member.id}
            name={member.name}
            image={ensureResolved(member.image)!}
            socials={member.socials ?? []}
            description={member.description}
            className="aspect-square"
            classNames={{ description: "text-sm" }}
            imageSizes="500px"
          />
        ))}
      </div>
    </>
  );
}
