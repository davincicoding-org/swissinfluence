"use client";

import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export const MotionH1 = m.h1;
