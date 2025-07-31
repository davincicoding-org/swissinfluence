import type { Expert } from "@/types";
import {
  MotionPersonaCard,
  PersonaCardContainer,
} from "@/ui/components/PersonaCard";

import { OnScreenList } from "../components/OnScreenList";

export interface AwardJuryProps {
  members: Array<Expert>;
}

export function AwardJury({ members }: AwardJuryProps) {
  return (
    <OnScreenList
      className="grid gap-4 sm:cols-autofill-250 md:gap-8"
      Placeholder={PersonaCardContainer}
    >
      {members.map((member, index) => (
        <MotionPersonaCard
          key={member.id}
          name={member.name}
          image={member.image}
          socials={member.socials ?? []}
          description={member.description}
          className="max-sm:sticky sm:!top-auto"
          imageSizes="500px"
          style={{ top: ` ${12 + index * 0.5}rem` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
          }}
        />
      ))}
    </OnScreenList>
  );
}

// Mobile View
{
  /* <div
  key={member.id}
  className="flex items-center rounded-box border border-base-300 bg-base-100 p-2 max-sm:sticky"
  // style={{ top: `${12 + index * 0.375}rem` }}
>
  <Image
    resource={member.image}
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
</div>; */
}
