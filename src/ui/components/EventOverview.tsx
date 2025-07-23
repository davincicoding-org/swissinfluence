"use client";

import { Box, Button, Paper } from "@mantine/core";
import { IconCalendar, IconMapPin, IconTicket } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { Location, ScheduleSlots } from "@/payload-types";
import { Schedule } from "@/ui/components/Schedule";
import { cn } from "@/ui/utils";

export interface EventOverviewProps {
  date: string | undefined | null;
  location: Location;
  registrationUrl: string | undefined | null;
  className?: string;
  schedule: ScheduleSlots | undefined;
}

export function EventOverview({
  date,
  location,
  registrationUrl,
  schedule,
  className,
}: EventOverviewProps) {
  const t = useTranslations("events.event");

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="mt-auto grid grid-cols-2 gap-5 max-lg:flex-col lg:flex">
        <Paper
          shadow="sm"
          radius="md"
          className="grid flex-1 overflow-clip bg-neutral-200 lg:flex lg:items-center"
        >
          <Box
            bg="mocha"
            className="flex h-full shrink-0 items-center justify-center max-lg:h-16 lg:aspect-square lg:p-3"
          >
            <IconCalendar
              className="shrink-0 stroke-white"
              size={48}
              stroke={1}
            />
          </Box>

          <div className="grow p-2 max-lg:text-center lg:px-5 lg:py-3">
            <p
              className={cn(
                "font-light uppercase tracking-wider",
                date ? "text-nowrap text-2xl" : "text-balance",
              )}
            >
              {date
                ? dayjs(new Date(date)).format("DD.MM.YYYY")
                : t("date-tbd")}
            </p>
          </div>
        </Paper>
        <Paper
          shadow="sm"
          radius="md"
          className="grid flex-1 overflow-clip bg-neutral-200 transition-transform active:scale-95 lg:flex lg:items-center"
          component="a"
          href={location.url}
          target="_blank"
        >
          <Box
            bg="mocha"
            className="flex h-full shrink-0 items-center justify-center max-lg:h-16 lg:aspect-square lg:p-3"
          >
            <IconMapPin
              className="shrink-0 stroke-white"
              size={48}
              stroke={1}
            />
          </Box>
          <div className="grow p-2 max-lg:text-center lg:px-5 lg:py-3">
            <p className="text-xl font-light uppercase tracking-wider">
              {location.name}
            </p>
            <p className="text-sm uppercase text-neutral-600">
              {location.city}
            </p>
          </div>
        </Paper>
        {registrationUrl && (
          <Button
            radius="md"
            component="a"
            href={registrationUrl}
            target="_blank"
            size="xl"
            leftSection={<IconTicket size={40} stroke={1} />}
            classNames={{
              root: "lg:max-h-none lg:h-auto max-lg:col-span-2",
              label: "font-medium text-xl lg:text-2xl",
            }}
          >
            {t("register-cta")}
          </Button>
        )}
      </div>

      {schedule && schedule.length > 0 && <Schedule slots={schedule} />}
    </div>
  );
}
