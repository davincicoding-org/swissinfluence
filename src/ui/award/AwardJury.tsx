import type { Expert } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { ensureResolved } from "@/utils/payload";

import { SocialsLinks } from "../components/SocialLinks";
import { derivative } from "../utils";

export interface AwardJuryProps {
  members: Array<Expert>;
}

// TODO merge mobile and desktop views to reduce html size

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
            <div
              key={member.id}
              className="flex items-center rounded-box border border-base-300 bg-base-100 p-2 max-sm:sticky"
              style={{ top: `${12 + index * 0.375}rem` }}
            >
              <Image
                resource={image}
                alt={member.name}
                className="h-20 w-20 shrink-0 rounded-md object-cover"
                sizes="128px"
              />
              <div className="grow pl-3">
                <p className="mb-1 leading-tight font-medium">{member.name}</p>
                <div>
                  <p className="text-sm leading-tight text-pretty text-neutral-600">
                    {member.description}
                  </p>
                </div>
              </div>
              <SocialsLinks
                items={member.socials ?? []}
                maxItems={2}
                direction="column"
                classNames={{
                  root: "my-auto shrink-0",
                  dropdown: "bg-base-100 shadow-sm",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Desktop View (Grid tiles) */}
      <div className="hidden cols-autofill-250 justify-evenly gap-8 md:grid">
        {members.map((member) => (
          <PersonaCard
            key={member.id}
            name={member.name}
            image={ensureResolved(member.image)!}
            socials={member.socials ?? []}
            description={member.description}
            className="aspect-square"
            imageSizes="500px"
          />
        ))}
      </div>
    </>
  );
}
