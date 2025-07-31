"use client";

import type { IconProps } from "@tabler/icons-react";
import type { FunctionComponent } from "react";
import { useEffect } from "react";
import {
  IconCamera,
  IconGavel,
  IconRocket,
  IconRosette,
  IconSpeakerphone,
  IconStar,
  IconTheater,
  IconTrophy,
} from "@tabler/icons-react";
import { Link } from "react-scroll";
import { createStore, useStore } from "zustand";

import { cn } from "../utils";

export type AwardSectionId =
  | "show"
  | "impressions"
  | "nomination"
  | "newcomer-scout"
  | "categories"
  | "creator-challenges"
  | "jury"
  | "past-impressions"
  | "hall-of-fame";

export interface AwardSection {
  name: AwardSectionId;
  label: string;
}

const ICONS: Record<AwardSectionId, FunctionComponent<IconProps>> = {
  show: IconTheater,
  impressions: IconCamera,
  nomination: IconRocket,
  "newcomer-scout": IconRosette,
  categories: IconStar,
  "creator-challenges": IconSpeakerphone,
  jury: IconGavel,
  "past-impressions": IconCamera,
  "hall-of-fame": IconTrophy,
};

// MARK: Store
interface AwardNavigationStore {
  registerSection: (section: AwardSection) => void;
  sections: AwardSection[];
}

const awardNavigationStore = createStore<AwardNavigationStore>((set) => ({
  sections: [],
  registerSection: (section) => {
    set((state) => ({
      sections: state.sections.some((s) => s.name === section.name)
        ? state.sections.map((s) => (s.name === section.name ? section : s))
        : [...state.sections, section],
    }));
  },
}));

export const useRegisterSection = ({ name, label }: AwardSection) => {
  const registerSection = useStore(
    awardNavigationStore,
    (state) => state.registerSection,
  );

  useEffect(() => {
    registerSection({
      name,
      label,
    });
  }, [name, label]);
};

// MARK: Panel

export interface AwardNavigationPanelProps {
  className?: string;
}

export function AwardNavigationPanel({ className }: AwardNavigationPanelProps) {
  const sections = useStore(awardNavigationStore, (state) => state.sections);

  return (
    <div
      className={cn(
        "flex gap-1 rounded-full border border-base-300 bg-white/30 p-1 backdrop-blur-md empty:hidden",
        className,
      )}
    >
      {sections.map(({ name, label }) => {
        const Icon = ICONS[name];
        return (
          <div
            key={name}
            className="tooltip tooltip-top before:tracking-widest"
            data-tip={label}
          >
            <Link
              className={cn(
                "hover:text-unset btn !btn-circle border-transparent btn-ghost transition-colors btn-lg hover:text-primary",
              )}
              // aria-label={t("navigateTo", { target: label })}
              to={name}
              spy
              hashSpy
              activeClass="!bg-primary !text-primary-content"
            >
              <Icon size={28} stroke={1.5} />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
