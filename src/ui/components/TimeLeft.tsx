"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";

dayjs.extend(relativeTime);

export interface TimeLeftProps {
  deadline: string;
}

export function TimeLeft({ deadline }: TimeLeftProps) {
  const t = useTranslations("misc");
  const timeLeft = dayjs(deadline).fromNow(true);

  useEffect(() => {
    const millisecondsLeft = dayjs(deadline).diff();

    if (millisecondsLeft <= 0) return;

    const MAX_TIMEOUT = 2_147_483_647;

    const timer = setTimeout(
      () => {
        window.location.reload();
      },
      Math.min(millisecondsLeft, MAX_TIMEOUT),
    );

    return () => clearTimeout(timer);
  }, [deadline]);

  return <>{t("time-left", {  timeLeft })}</>;
}
