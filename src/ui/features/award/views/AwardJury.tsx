"use client";

import Image from "next/image";

import { ActionIcon } from "@mantine/core";
import { useLocale } from "next-intl";

import { PersonaCard } from "@/ui/components/PersonaCard";
import { SocialMediaPlatformIcon } from "@/ui/components/SocialMediaPlatformIcon";

import { type IJuryMember } from "../data";

export interface IAwardJuryProps {
  members: Array<IJuryMember>;
}

export function AwardJury({ members }: IAwardJuryProps) {
  const locale = useLocale();

  const handleMemberClick = (member: IJuryMember) => {
    if (member.socials.length === 1) {
      window.open(member.socials[0]?.url, "_blank");
    }
  };

  return (
    <>
      {/* Mobile View */}
      <div className="space-y-4 md:hidden">
        {members.map((member) => (
          <div
            key={member.id}
            role="button"
            className="group relative"
            onClick={() => handleMemberClick(member)}
            tabIndex={0}
          >
            <div className="flex cursor-pointer items-center space-x-4 rounded-xl border bg-mocha-50 p-4 shadow backdrop-blur-sm">
              <Image
                src={member.image.src}
                width={member.image.width}
                height={member.image.height}
                placeholder={member.image.blurDataURL ? "blur" : undefined}
                blurDataURL={member.image.blurDataURL}
                alt={member.name}
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-neutral-600">
                  {member.description[locale]}
                </p>
              </div>
            </div>

            {/* Expanding Overlay (only shown for multiple socials) */}
            {member.socials.length > 1 && (
              <div
                className={`bg-mocha/10 pointer-events-none absolute inset-0 flex translate-y-4 flex-col items-center justify-center gap-6 rounded-xl opacity-0 backdrop-blur-md transition-all duration-300 ease-in-out group-focus:pointer-events-auto group-focus:translate-y-0 group-focus:opacity-100`}
              >
                <div className="flex gap-4">
                  {member.socials.map((social) => (
                    <ActionIcon
                      key={social.platform}
                      component="a"
                      href={social.url}
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
        ))}
      </div>

      {/* Desktop View (Grid tiles) */}
      <div className="hidden grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-evenly gap-8 md:grid">
        {members.map((member) => (
          <PersonaCard
            key={member.id}
            name={member.name}
            image={member.image}
            socials={member.socials}
            description={member.description[locale]}
            className="aspect-square"
            classNames={{ description: "text-sm" }}
          />
        ))}
      </div>
    </>
  );
}
