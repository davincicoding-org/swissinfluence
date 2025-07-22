"use client";

import { Box, Button, Paper, Space } from "@mantine/core";
import { IconCalendar, IconMapPin, IconTicket } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { Location, ScheduleSlots } from "@/payload-types";
import { Schedule } from "@/ui/components/Schedule";
import { cn } from "@/ui/utils";

export interface EventSectionProps {
  date: string | undefined | null;
  location: Location;
  registrationUrl: string | undefined | null;
  className?: string;
  schedule: ScheduleSlots | undefined;
  id?: string;
}

export function EventSection({
  date,
  location,
  registrationUrl,
  schedule,
  className,
  id,
}: EventSectionProps) {
  const t = useTranslations("events.event");

  return (
    <section
      id={id}
      className={cn(
        "container flex max-w-4xl flex-col py-24 sm:py-32",
        { "min-h-screen": schedule?.length },
        className,
      )}
    >
      <div className="mt-auto grid grid-cols-2 gap-5 max-md:flex-col md:flex">
        <Paper
          shadow="sm"
          radius="md"
          className="grid flex-1 overflow-clip bg-neutral-200 md:flex md:items-center"
        >
          <Box
            bg="mocha"
            className="flex h-full shrink-0 items-center justify-center max-md:h-16 md:aspect-square md:p-3"
          >
            <IconCalendar
              className="shrink-0 stroke-white"
              size={48}
              stroke={1}
            />
          </Box>

          <div className="grow p-2 max-md:text-center md:px-5 md:py-3">
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
          className="grid flex-1 overflow-clip bg-neutral-200 transition-transform hover:scale-105 active:scale-95 md:flex md:items-center"
          component="a"
          href={location.url}
          target="_blank"
        >
          <Box
            bg="mocha"
            className="flex h-full shrink-0 items-center justify-center max-md:h-16 md:aspect-square md:p-3"
          >
            <IconMapPin
              className="shrink-0 stroke-white"
              size={48}
              stroke={1}
            />
          </Box>
          <div className="grow p-2 max-md:text-center md:px-5 md:py-3">
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
              root: "md:max-h-none md:h-auto max-md:col-span-2",
              label: "font-medium text-xl md:text-2xl",
            }}
          >
            {t("register-cta")}
          </Button>
        )}
      </div>

      {schedule && schedule.length > 0 && (
        <>
          <Space h="lg" />
          <Schedule slots={schedule} />
        </>
      )}
    </section>
  );
}
