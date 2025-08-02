"use client";

import type { MotionProps } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as m from "motion/react-m";

import { cn } from "../utils";

const AnimatedTabsContext = createContext<{
  activeTab: string | number | undefined;
  setActiveTab: (tab: string | number) => void;
}>({
  activeTab: undefined,
  setActiveTab: () => void 0,
});

export interface AnimatedTabsProps {
  defaultValue?: string | number;
}

export function AnimatedTabs({
  defaultValue,
  children,
}: React.PropsWithChildren<AnimatedTabsProps>) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <AnimatedTabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AnimatedTabsContext.Provider>
  );
}

export interface AnimatedTabsControlsProps {
  grow?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  primary?: boolean;
  tabs: {
    value: string | number;
    label: string;
    disabled?: boolean;
  }[];
  className?: string;
  onTabChange?: (tab: string | number) => void;
}

export function AnimatedTabsControls({
  tabs,
  grow,
  primary,
  size,
  className,
  onTabChange,
}: AnimatedTabsControlsProps) {
  const { activeTab, setActiveTab } = useContext(AnimatedTabsContext);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab !== undefined) onTabChange?.(activeTab);

    if (!containerRef.current) return;
    const tab =
      containerRef.current.querySelector<HTMLAnchorElement>(
        `[data-active="true"]`,
      );
    if (!tab) return;
    const visibleWidth = containerRef.current.clientWidth;
    const tabWidth = tab.clientWidth;

    containerRef.current.scrollTo({
      left: tab.offsetLeft - (visibleWidth - tabWidth) / 2,
      behavior: "smooth",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div
      role="tablist"
      ref={containerRef}
      className={cn(
        "scroll-horizontal tabs flex-nowrap tabs-box uppercase",
        {
          "tabs-xs": size === "xs",
          "tabs-sm": size === "sm",
          "tabs-md": size === "md",
          "tabs-lg": size === "lg",
          "tabs-xl": size === "xl",
        },
        className,
      )}
    >
      {tabs.map((item) => (
        <a
          key={item.value}
          role="tab"
          data-active={activeTab === item.value}
          className={cn("tab text-nowrap", {
            "tab-active pointer-events-none": activeTab === item.value,
            "text-primary-content [--tab-bg:var(--color-primary)]":
              activeTab === item.value && primary,
            "tab-disabled": item.disabled,
            "flex-1": grow,
          })}
          onClick={() => setActiveTab(item.value)}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

export interface AnimatedTabsPanelProps extends Omit<MotionProps, "children"> {
  value: string | number;
  className?: string;
}

export function AnimatedTabsPanel({
  value,
  children,
  ...props
}: React.PropsWithChildren<AnimatedTabsPanelProps>) {
  const { activeTab } = useContext(AnimatedTabsContext);
  if (activeTab !== value) return null;
  return <m.div {...props}>{children}</m.div>;
}
