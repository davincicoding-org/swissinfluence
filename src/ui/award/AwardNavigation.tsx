"use client";

import type { IconProps } from "@tabler/icons-react";
import type { FunctionComponent, PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
import { useTranslations } from "next-intl";
import { Link } from "react-scroll";

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

interface AwardSection {
  id: AwardSectionId;
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

// MARK: Context
interface AwardNavigationContext {
  registerSection: (section: AwardSection) => void;
  sections: AwardSection[];
}

const AwardNavigationContext = createContext<AwardNavigationContext>({
  registerSection: () => void 0,
  sections: [],
});

export function AwardNavigationProvider({ children }: PropsWithChildren) {
  const [sections, setSections] = useState<AwardSection[]>([]);

  const registerSection = useCallback((section: AwardSection) => {
    setSections((prev) =>
      prev.find((s) => s.id === section.id) ? prev : [...prev, section],
    );
  }, []);

  return (
    <AwardNavigationContext.Provider
      value={{
        sections,
        registerSection,
      }}
    >
      {children}
    </AwardNavigationContext.Provider>
  );
}

export const useRegisterSection = ({
  id,
  label: title,
}: Omit<AwardSection, "element">) => {
  const { registerSection } = useContext(AwardNavigationContext);

  useEffect(() => {
    registerSection({
      id,
      label: title,
    });
  }, [id, registerSection, title]);
};

// MARK: Panel

export interface AwardNavigationPanelProps {
  className?: string;
}

export function AwardNavigationPanel({ className }: AwardNavigationPanelProps) {
  const { sections } = useContext(AwardNavigationContext);
  const t = useTranslations("navigation.aria");

  return (
    <div
      className={cn(
        "flex gap-1 rounded-full border border-base-300 bg-white/30 p-1 backdrop-blur-md empty:hidden",
        className,
      )}
    >
      {sections.map(({ id, label }) => {
        const Icon = ICONS[id];
        return (
          <div
            key={id}
            className="tooltip tooltip-top before:tracking-widest"
            data-tip={label}
          >
            <Link
              className={cn(
                "hover:text-unset btn !btn-circle border-transparent btn-ghost transition-colors btn-lg hover:text-primary",
              )}
              aria-label={t("navigateTo", { target: label })}
              to={id}
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
