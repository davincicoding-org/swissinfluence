"use client";

import type { PropsWithChildren } from "react";
import { Element } from "react-scroll";

import type { AwardSectionId } from "../award/AwardNavigation";
import { useRegisterSection } from "../award/AwardNavigation";

export interface NavElementProps {
  id: AwardSectionId;
  label: string;
}

export function NavElement({
  id,
  label,
  children,
}: PropsWithChildren<NavElementProps>) {
  useRegisterSection({ id, label });

  return (
    <Element name={id} id={id}>
      {children}
    </Element>
  );
}
