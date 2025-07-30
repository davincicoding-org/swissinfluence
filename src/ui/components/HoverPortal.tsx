"use client";

import type { MotionNodeAnimationOptions } from "motion/react";
import type { PropsWithChildren, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMap } from "@mantine/hooks";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Slot } from "radix-ui";

import { cn } from "../utils";

const HoverPortalContext = createContext<{
  activeItem: string | number | undefined;
  activateItem: (id: string | number) => void;
  registerContent: (id: string | number, content: ReactNode) => void;
  getContent: (id: string | number) => ReactNode;
}>({
  activeItem: undefined,
  activateItem: () => void 0,
  registerContent: () => void 0,
  getContent: () => null,
});

export interface HoverPortalProps {
  defaultValue?: string | number;
}

export function HoverPortal({
  children,
  defaultValue,
}: PropsWithChildren<HoverPortalProps>) {
  const [activeItem, setActiveItem] = useState<string | number | undefined>(
    defaultValue,
  );
  const contentMap = useMap<string | number, ReactNode>();

  const registerContent = useCallback(
    (id: string | number, content: ReactNode) => {
      contentMap.set(id, content);
    },
    [contentMap],
  );

  const getContent = useCallback(
    (id: string | number) => {
      return contentMap.get(id) ?? null;
    },
    [contentMap],
  );

  return (
    <HoverPortalContext.Provider
      value={{
        activeItem,
        activateItem: setActiveItem,
        registerContent,
        getContent,
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
}: PropsWithChildren<HoverPortalTriggerProps>) {
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
}: PropsWithChildren<HoverPortalContentProps>) {
  const { registerContent } = useContext(HoverPortalContext);

  const hasChildren = Boolean(children);
  useEffect(() => {
    if (!hasChildren) return;
    registerContent(id, children);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, registerContent, hasChildren]);

  if (!passthrough) return null;
  return children;
}

export interface HoverPortalTargetProps extends MotionNodeAnimationOptions {
  className?: string;
}

export function HoverPortalTarget({ ...props }: HoverPortalTargetProps) {
  const { activeItem, getContent } = useContext(HoverPortalContext);

  return (
    <AnimatePresence mode="wait">
      {activeItem !== undefined && (
        <m.div key={activeItem} {...props}>
          {getContent(activeItem)}
        </m.div>
      )}
    </AnimatePresence>
  );
}
