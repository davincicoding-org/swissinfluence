"use client";

import type { MotionNodeAnimationOptions } from "motion/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useMap } from "@mantine/hooks";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Slot } from "radix-ui";

import { cn } from "../utils";

const HoverPortalContext = createContext<{
  activeItem: string | number | undefined;
  activateItem: (id: string | number) => void;
  contentMap: Map<string | number, React.ReactNode>;
}>({
  activeItem: undefined,
  activateItem: () => void 0,
  contentMap: new Map<string | number, React.ReactNode>(),
});

export interface HoverPortalProps {
  defaultValue?: string | number;
}

export function HoverPortal({
  children,
  defaultValue,
}: React.PropsWithChildren<HoverPortalProps>) {
  const [activeItem, setActiveItem] = useState<string | number | undefined>();
  useEffect(() => {
    setTimeout(() => {
      setActiveItem(defaultValue);
    }, 100);
  }, [defaultValue]);

  const contentMap = useMap<string | number, React.ReactNode>();

  return (
    <HoverPortalContext.Provider
      value={{
        activeItem,
        activateItem: setActiveItem,
        contentMap,
      }}
    >
      {children}
    </HoverPortalContext.Provider>
  );
}

export interface HoverPortalTriggerProps {
  id: string | number;
  className?: string;
}

export function HoverPortalTrigger({
  id,
  className,
  children,
}: React.PropsWithChildren<HoverPortalTriggerProps>) {
  const { activeItem, activateItem } = useContext(HoverPortalContext);

  const isActive = activeItem === id;

  return (
    <Slot.Root
      className={cn(className)}
      data-active={isActive}
      onMouseEnter={() => activateItem(id)}
    >
      {children}
    </Slot.Root>
  );
}

export interface HoverPortalContentProps {
  id: string | number;
  passthrough?: boolean;
}

export function HoverPortalContent({
  id,
  passthrough,
  children,
}: React.PropsWithChildren<HoverPortalContentProps>) {
  const { contentMap } = useContext(HoverPortalContext);

  const hasChildren = Boolean(children);
  useEffect(() => {
    if (!hasChildren) return;
    contentMap.set(id, children);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, contentMap, hasChildren]);

  if (!passthrough) return null;
  return children;
}

export interface HoverPortalTargetProps extends MotionNodeAnimationOptions {
  className?: string;
}

export function HoverPortalTarget({ ...props }: HoverPortalTargetProps) {
  const { activeItem, contentMap } = useContext(HoverPortalContext);

  return (
    <AnimatePresence mode="wait">
      {activeItem !== undefined && (
        <m.div key={activeItem} {...props}>
          {contentMap.get(activeItem)}
        </m.div>
      )}
    </AnimatePresence>
  );
}
