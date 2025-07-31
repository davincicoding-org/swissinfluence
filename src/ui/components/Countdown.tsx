"use client";

import dynamic from "next/dynamic";

export type { CountdownProps } from "react-countdown";

export const Countdown = dynamic(() => import("react-countdown"), {
  ssr: false,
});
