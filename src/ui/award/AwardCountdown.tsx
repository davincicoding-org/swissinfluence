"use client";

import Countdown from "react-countdown";

export interface IAwardCountdownProps {
  date: string;
}

export function AwardCountdown({ date }: IAwardCountdownProps) {
  return <Countdown date={date} />;
}
