"use client";

import type { SegmentedControlProps } from "@mantine/core";
import type { MotionProps } from "motion/react";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { SegmentedControl } from "@mantine/core";
import * as m from "motion/react-m";

const AnimatedTabsContext = createContext<{
  activeTab: string | undefined;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: undefined,
  setActiveTab: () => void 0,
});

export interface AnimatedTabsProps {
  defaultValue?: string;
}

export function AnimatedTabs({
  defaultValue,
  children,
}: PropsWithChildren<AnimatedTabsProps>) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <AnimatedTabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AnimatedTabsContext.Provider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AnimatedTabsControlsProps
  extends Omit<SegmentedControlProps, "value" | "onChange"> {}

export function AnimatedTabsControls(props: AnimatedTabsControlsProps) {
  const { activeTab, setActiveTab } = useContext(AnimatedTabsContext);

  return (
    <SegmentedControl
      value={activeTab}
      onChange={(value) => setActiveTab(value)}
      {...props}
    />
  );
}

export interface AnimatedTabsPanelProps extends Omit<MotionProps, "children"> {
  value: string;
  className?: string;
}

export function AnimatedTabsPanel({
  value,
  children,
  ...props
}: PropsWithChildren<AnimatedTabsPanelProps>) {
  const { activeTab } = useContext(AnimatedTabsContext);
  if (activeTab !== value) return null;
  return <m.div {...props}>{children}</m.div>;
}
