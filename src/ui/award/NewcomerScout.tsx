import { useMemo } from "react";
import dayjs from "dayjs";
import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

import type { NewcomerScoutTimeline, Photo } from "@/payload-types";
import type { RichTextProps } from "@/ui/components/RichText";
import {
  AnimatedTabs,
  AnimatedTabsControls,
  AnimatedTabsPanel,
} from "@/ui/components/AnimatedTabs";
import { Image } from "@/ui/components/Image";
import { RichText } from "@/ui/components/RichText";
import { TimeLeft } from "@/ui/components/TimeLeft";
import { cn, derivative, formatDate } from "@/ui/utils";

export interface AwardNominationProps {
  image: Photo;
  info: RichTextProps["data"];
  perks: RichTextProps["data"];
  deadline: string;
  formURL: string;
  timeline: NonNullable<NewcomerScoutTimeline>;
  className?: string;
}

export function NewcomerScout({
  className,
  image,
  info,
  perks,
  deadline,
  formURL,
  timeline,
}: AwardNominationProps) {
  const t = useTranslations("award.newcomer-scout");
  return (
    <div
      className={cn(
        "mx-auto grid min-h-0 max-w-4xl overflow-clip rounded-box border border-base-300 bg-base-100 shadow-md md:aspect-video md:grid-cols-2",
        className,
      )}
    >
      <div className="relative grid md:order-2">
        <Image
          resource={image}
          alt="Newcomer Scout"
          className="aspect-square sm:aspect-auto"
          // TODO this should be 90vw on mobile, but Lighthouse is complaining
          sizes="(max-width: 48rem) 80vw, 368px"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-3">
          <div className="badge-ghostd mx-auto badge border-white/50 bg-white/50 p-3 badge-xl tracking-widest text-neutral uppercase backdrop-blur-xs">
            <TimeLeft deadline={deadline} />
          </div>
          <a
            className="btn uppercase btn-lg btn-primary"
            href={formURL}
            target="_blank"
          >
            {t("CTA")}
          </a>
        </div>
      </div>

      <AnimatedTabs defaultValue="INFO">
        <div className={cn("scroll-vertical flex min-h-0 flex-col")}>
          <div className="z-10 bg-base-100 px-3 pt-3 md:sticky md:top-0">
            <AnimatedTabsControls
              grow
              className="border border-base-300 *:text-base *:font-medium"
              tabs={[
                { label: t("info"), value: "INFO" },
                { label: t("perks"), value: "PERKS" },
                { label: t("timeline"), value: "TIMELINE" },
              ]}
            />
          </div>

          <AnimatePresence mode="wait">
            <AnimatedTabsPanel
              key="info"
              value="INFO"
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RichText data={info} />
            </AnimatedTabsPanel>
            <AnimatedTabsPanel
              key="perks"
              value="PERKS"
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RichText data={perks} />
            </AnimatedTabsPanel>
            <AnimatedTabsPanel
              key="timeline"
              value="TIMELINE"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Timeline timeline={timeline} className="px-6" />
            </AnimatedTabsPanel>
          </AnimatePresence>

          <div className="px-3 pb-3 md:hidden">
            <a
              className="btn btn-block uppercase btn-primary"
              href={formURL}
              target="_blank"
            >
              {t("CTA")}
            </a>
          </div>
        </div>
      </AnimatedTabs>
    </div>
  );
}

// MARK: Timeline

interface TimelineProps {
  timeline: NonNullable<NewcomerScoutTimeline>;
  className?: string;
}

function Timeline({ timeline, className }: TimelineProps) {
  const items = useMemo(
    () =>
      timeline.map<{
        id: string | null | undefined;
        content: string;
        date: string;
        status: "past" | "present" | "future";
      }>((item) => ({
        id: item.id,
        content: item.title,
        date: derivative(() => {
          switch (item.dateType) {
            case "DAY":
              return formatDate(item.date);

            case "PERIOD":
              return `${formatDate(item.date)} - ${formatDate(item.dateEnd ?? "")}`;

            case "MONTH":
              return dayjs(item.date).format("MMMM");
          }
        }),
        status: (() => {
          switch (item.dateType) {
            case "DAY":
              if (dayjs(item.date).isBefore(undefined, "day")) return "past";
              if (dayjs(item.date).isAfter(undefined, "day")) return "future";
              return "present";

            case "PERIOD":
              if (dayjs(item.dateEnd).isBefore(undefined, "day")) return "past";
              if (dayjs(item.date).isAfter(undefined, "day")) return "future";

              return "present";

            case "MONTH":
              if (dayjs(item.date).isBefore(undefined, "month")) return "past";
              if (dayjs(item.date).isAfter(undefined, "month")) return "future";

              return "present";
          }
        })(),
      })),
    [timeline],
  );

  return (
    <div className={className}>
      <div
        className={cn(
          "ml-2 h-6 w-1",
          items[0]?.status === "future" ? "bg-base-300" : "bg-primary/30",
        )}
      />
      <ul className="timeline timeline-vertical timeline-compact">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={cn({
              "*:last:bg-primary/30": item.status === "past",
              "*:last:bg-primary": item.status === "present",
            })}
          >
            <hr
              className={cn({
                "bg-primary/30":
                  items[Math.max(index - 1, 0)]?.status === "past",
                "bg-primary": items[index - 1]?.status === "present",
              })}
            />
            <div
              className={cn("timeline-start mb-0 pl-2", {
                "opacity-50": item.status === "past",
                "font-medium": item.status === "present",
                "text-primary": item.status !== "future",
              })}
            >
              {item.date}
            </div>
            <div className="timeline-middle">
              <div
                className={cn("size-5 rounded-full border-4", {
                  "border-transparent bg-primary/30": item.status === "past",
                  "border-primary": item.status === "present",
                  "border-base-300": item.status === "future",
                })}
              />
            </div>
            <div
              className={cn(
                "timeline-end mt-0 mb-3 timeline-box border-none p-0 px-2 text-lg leading-snug shadow-none",
                {
                  "opacity-50": item.status === "past",
                },
              )}
            >
              {item.content}
            </div>
            <hr />
          </li>
        ))}
      </ul>
      <div
        className={cn("ml-2 h-3 w-1", {
          "bg-base-300": items[items.length - 1]?.status === "future",
          "bg-primary": items[items.length - 1]?.status === "present",
          "bg-primary/30": items[items.length - 1]?.status === "past",
        })}
      />
    </div>
  );
}
