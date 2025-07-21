"use client";

import { ActionIcon } from "@mantine/core";

import type { Expert } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { SocialMediaPlatformIcon } from "@/ui/components/SocialMediaPlatformIcon";
import { ensureResolved } from "@/utils/payload";

export interface IAwardJuryProps {
  members: Array<Expert>;
}

export function AwardJury({ members }: IAwardJuryProps) {
  const handleMemberClick = (member: Expert) => {
    if (!member.socials) return;
    if (member.socials.length > 1) return;
    window.open(member.socials[0]?.url, "_blank");
  };

  return (
    <>
      {/* Mobile View */}
      <div className="space-y-4 md:hidden">
        {members.map((member) => {
          const image = ensureResolved(member.image);
          if (!image) return null;
          return (
            <div
              key={member.id}
              role="button"
              className="group relative"
              onClick={() => handleMemberClick(member)}
              tabIndex={0}
            >
              <div className="flex cursor-pointer items-center space-x-4 rounded-xl border bg-mocha-50 p-2 shadow backdrop-blur-sm">
                <Image
                  resource={image}
                  alt={member.name}
                  className="h-20 w-20 shrink-0 rounded-lg object-cover"
                  sizes="128px"
                />
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-pretty text-sm leading-tight text-neutral-600">
                    {member.description}
                  </p>
                </div>
              </div>

              {/* Expanding Overlay (only shown for multiple socials) */}
              {member.socials && member.socials.length > 1 && (
                <div
                  className={`bg-mocha/10 pointer-events-none absolute inset-0 flex translate-y-4 flex-col items-center justify-center gap-6 rounded-xl opacity-0 backdrop-blur-md transition-all duration-300 ease-in-out group-focus:pointer-events-auto group-focus:translate-y-0 group-focus:opacity-100`}
                >
                  <div className="flex gap-4">
                    {member.socials.map((social) => (
                      <ActionIcon
                        key={social.platform}
                        component="a"
                        href={social.url}
                        target="_blank"
                        size="xl"
                        variant="subtle"
                        color="default"
                      >
                        <SocialMediaPlatformIcon
                          platform={social.platform}
                          size={40}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
