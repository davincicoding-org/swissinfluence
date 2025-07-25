"use client";

import type { MotionNodeAnimationOptions } from "motion/react";
import type { PropsWithChildren, ReactElement, ReactNode } from "react";
import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

const HoverContentContext = createContext<{
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

export interface HoverContentProps {
  defaultValue?: string | number;
}

export function HoverContent({
  children,
  defaultValue,
}: PropsWithChildren<HoverContentProps>) {
  const [activeItem, setActiveItem] = useState<string | number | undefined>(
    defaultValue,
  );
  const contentMapRef = useRef<Map<string | number, ReactNode>>(new Map());

  const registerContent = useCallback(
    (id: string | number, content: ReactNode) => {
      contentMapRef.current.set(id, content);
    },
    [],
  );

  const getContent = useCallback((id: string | number) => {
    return contentMapRef.current.get(id) ?? null;
  }, []);

  return (
    <HoverContentContext.Provider
      value={{
        activeItem,
        activateItem: setActiveItem,
        registerContent,
        getContent,
      }}
    >
      {children}
    </HoverContentContext.Provider>
  );
}

export interface HoverContentItemProps {
  id: string | number;
  trigger: ReactElement<{
    onMouseEnter?: () => void;
    "data-active"?: boolean;
  }>;
}

export function HoverContentItem({
  id,
  trigger,
  children,
}: PropsWithChildren<HoverContentItemProps>) {
  const { activeItem, activateItem, registerContent } =
    useContext(HoverContentContext);

  const isActive = activeItem === id;

  registerContent(id, children);

  return (
    <>
      {cloneElement(trigger, {
        onMouseEnter: () => activateItem(id),
        "data-active": isActive,
        ...trigger.props,
      })}
    </>
  );
}

export interface HoverContentPortalProps extends MotionNodeAnimationOptions {
  className?: string;
}

export function HoverContentPortal({ ...props }: HoverContentPortalProps) {
  const { activeItem, getContent } = useContext(HoverContentContext);

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
