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
import { ActionIcon, Paper, Tooltip } from "@mantine/core";
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
import { Link, scroller } from "react-scroll";

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

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const name = hash.replace("#", "");
    scroller.scrollTo(name, {});
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
    <Paper
      radius="xl"
      withBorder
      bg="transparent"
      className={cn("flex gap-1 p-1 backdrop-blur-md empty:hidden", className)}
    >
      {sections.map(({ id, label }) => {
        const Icon = ICONS[id];
        return (
          <Tooltip
            key={id}
            label={label}
            position="top"
            radius="md"
            classNames={{
              tooltip: "font-medium tracking-wider",
            }}
            transitionProps={{ transition: "pop", duration: 300 }}
          >
            <ActionIcon
              className={cn("hover:text-unset text-gray-500 transition-colors")}
              radius="xl"
              size="xl"
              color="mocha"
              variant="subtle"
              aria-label={t("navigateTo", { target: label })}
              component={Link}
              to={id}
              spy
              hashSpy
              activeClass="!bg-mocha-500 !text-white"
            >
              <Icon size={28} />
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Paper>
  );
}
