import type { BoxProps, TimelineProps } from "@mantine/core";
import { useMemo } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Paper,
  Timeline,
  TimelineItem,
} from "@mantine/core";
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
import { ScrollableSpoiler } from "@/ui/components/ScrollableSpoiler";
import { TimeLeft } from "@/ui/components/TimeLeft";
import { cn, derivative } from "@/ui/utils";

export interface AwardNominationProps {
  image: Photo;
  info: RichTextProps["data"];
  perks: RichTextProps["data"];
  deadline: string;
  formURL: string;
  timeline: NonNullable<NewcomerScoutTimeline>;
  className?: string;
}

export function NewcomerScout({ className, ...props }: AwardNominationProps) {
  return (
    <Paper
      withBorder
      shadow="sm"
      radius="lg"
      className={cn("mx-auto max-w-4xl overflow-clip", className)}
    >
      <TabsView {...props} hiddenFrom="md" />
      <ColumnsView {...props} visibleFrom="md" />
    </Paper>
  );
}

// MARK: Tabs View

function TabsView({
  image,
  info,
  perks,
  deadline,
  formURL,
  timeline,
  className,
  ...props
}: AwardNominationProps & BoxProps) {
  const t = useTranslations("award.newcomer-scout");

  return (
    <AnimatedTabs defaultValue="INFO">
      <Box className={cn("", className)} {...props}>
        <div className="relative">
          <Image
            resource={image}
            alt="Newcomer Scout"
            className="aspect-square sm:aspect-video"
            sizes="(max-width: 430px) 800px, 1500px"
          />
          <AnimatedTabsControls
            classNames={{
              root: "p-1.5 rounded-none bg-white/30 backdrop-blur-sm absolute bottom-0 inset-x-0",
              control: "[&:not([data-active=true])]:text-black",
              label: "font-medium text-inherit",
            }}
            size="md"
            withItemsBorders={false}
            variant="light"
            data={[
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
            className="p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RichText data={info} />
          </AnimatedTabsPanel>
          <AnimatedTabsPanel
            key="perks"
            value="PERKS"
            className="p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RichText data={perks} />
          </AnimatedTabsPanel>
          <AnimatedTabsPanel
            key="timeline"
            value="TIMELINE"
            className="px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Center>
              <TimelineView timeline={timeline} />
            </Center>
          </AnimatedTabsPanel>
        </AnimatePresence>

        <div className="px-3 pb-3">
          <Button
            radius="md"
            size="md"
            fullWidth
            className="uppercase"
            component="a"
            href={formURL}
            target="_blank"
          >
            {t("CTA")}
          </Button>
          <p className="mt-2 text-center text-sm font-medium uppercase tracking-wider">
            <TimeLeft deadline={deadline} />
          </p>
        </div>
      </Box>
    </AnimatedTabs>
  );
}

// MARK: Columns View

function ColumnsView({
  info,
  perks,
  image,
  deadline,
  formURL,
  timeline,
  className,
  ...props
}: AwardNominationProps & BoxProps) {
  const t = useTranslations("award.newcomer-scout");

  return (
    <Box
      className={cn("grid grid-cols-[1fr_400px] gap-1", className)}
      {...props}
    >
      <ScrollableSpoiler
        classNames={{
          scrollArea: {
            viewport: "max-h-[50vh]",
          },
        }}
      >
        <div className="py-6">
          <RichText data={info} className="max-w-none px-8" />
          <Divider
            label={t("perks")}
            labelPosition="center"
            classNames={{
              root: "mt-5 mb-2",
              label: "text-3xl",
            }}
          />
          <RichText data={perks} className="max-w-none px-8" />
          <Divider
            label={t("timeline")}
            labelPosition="center"
            classNames={{
              root: "my-5",
              label: "text-3xl",
            }}
          />
          <Center>
            <TimelineView timeline={timeline} />
          </Center>
        </div>
      </ScrollableSpoiler>

      <div className="relative grid">
        <Image
          resource={image}
          alt="Newcomer Scout"
          className="h-[50vh] w-full"
          sizes="800px"
        />
        <div className="absolute inset-x-0 bottom-0 bg-white/30 p-3 backdrop-blur-sm">
          <Button
            radius="md"
            size="md"
            fullWidth
            className="uppercase"
            component="a"
            href={formURL}
            target="_blank"
          >
            {t("CTA")}
          </Button>
          <p className="mt-2 text-center font-medium uppercase tracking-wider">
            <TimeLeft deadline={deadline} />
          </p>
        </div>
      </div>
    </Box>
  );
}

// MARK: Timeline View

interface TimelineViewProps extends TimelineProps {
  timeline: NonNullable<NewcomerScoutTimeline>;
}

function TimelineView({ timeline, ...props }: TimelineViewProps) {
  const { items, activeIndex } = useMemo(
    () => ({
      items: timeline.map<{
        id: string | null | undefined;
        title: string;
        date: string;
      }>((item) => ({
        id: item.id,
        title: item.title,
        date: derivative(() => {
          switch (item.dateType) {
            case "DAY":
              return dayjs(item.date).format("DD.MM.YYYY");
            case "PERIOD":
              return `${dayjs(item.date).format("DD.MM.YYYY")} - ${dayjs(item.dateEnd).format("DD.MM.YYYY")}`;
            case "MONTH":
              return dayjs(item.date).format("MMMM");
          }
        }),
      })),
      activeIndex: timeline.findIndex((item, index, all) => {
        if (dayjs(item.date).isAfter(undefined, "day")) return false;
        if (dayjs(item.date).isSame(undefined, "day")) return true;
        if (
          (item.dateEnd && dayjs(item.dateEnd).isAfter(undefined, "day")) ||
          dayjs(item.dateEnd).isSame(undefined, "day")
        )
          return true;
        const nextItem = all[index + 1];
        if (!nextItem) return true;
        return dayjs(nextItem.date).isAfter(undefined, "day");
      }, 0),
    }),
    [timeline],
  );

  // FIXME line is not colored
  return (
    <Timeline active={activeIndex} {...props}>
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          title={item.title}
          classNames={{
            itemTitle: "text-pretty",
            itemContent: "text-pretty text-neutral-500",
          }}
        >
          {item.date}
        </TimelineItem>
      ))}
    </Timeline>
  );
}
