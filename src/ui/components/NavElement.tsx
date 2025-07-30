"use client";

import type { PropsWithChildren } from "react";
import { ScrollElement } from "react-scroll";

import type { AwardSection } from "../award/AwardNavigation";
import { useRegisterSection } from "../award/AwardNavigation";

export interface NavSectionProps extends AwardSection {
  className?: string;
}

function Element({
  name,
  label,
  className,
  children,
  ...props
}: PropsWithChildren<NavSectionProps>) {
  useRegisterSection({ name, label });

  return (
    <section
      className={className}
      ref={(el) => {
        // @ts-expect-error poorly typed
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        props.parentBindings.domNode = el;
      }}
    >
      {children}
    </section>
  );
}

export const NavSection = ScrollElement(Element);
