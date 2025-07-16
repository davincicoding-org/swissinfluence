"use client";

import { Paper, Space } from "@mantine/core";
import { IconCalendar, IconMapPin } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { CurrentAwardShow } from "@/types";
import { Schedule } from "@/ui/components/Schedule";
import { cn } from "@/ui/utils";

export interface IAwardShowProps {
  show: CurrentAwardShow;
  className?: string;
  id?: string;
}

export function AwardShow({ show, className, id }: IAwardShowProps) {
  const t = useTranslations("award.show");

  return (
    <section
      id={id}
      className={cn(
        "container flex min-h-screen max-w-4xl flex-col py-24 sm:py-32",
        className,
      )}
    >
      <div className="mt-auto grid grid-cols-2 gap-5 max-md:flex-col md:flex">
        <Paper
          shadow="sm"
          radius="md"
          className="grid flex-1 overflow-clip bg-neutral-200 md:flex md:items-center"
        >
          <div className="flex h-full shrink-0 items-center justify-center bg-mocha-500 max-md:h-16 md:aspect-square md:p-3">
            <IconCalendar
              className="shrink-0 stroke-white"
              size={48}
              stroke={1}
            />
          </div>

          <div className="grow p-2 max-md:text-center md:px-5 md:py-3">
            <h3
              className={cn(
                "font-light uppercase tracking-wider",
                show.date ? "text-nowrap text-2xl" : "text-balance",
              )}
            >
              {show.date
                ? dayjs(new Date(show.date)).format("DD. MMM")
                : t("date-tbd")}
            </h3>
          </div>
        </Paper>
        <Paper
          shadow="sm"
          radius="md"
          className="grid flex-1 overflow-clip bg-neutral-200 transition-transform active:scale-95 md:flex md:items-center"
          component="a"
          href={show.location.url}
          target="_blank"
        >
          <div className="flex h-full shrink-0 items-center justify-center bg-mocha-500 max-md:h-16 md:aspect-square md:p-3">
            <IconMapPin
              className="shrink-0 stroke-white"
              size={48}
              stroke={1}
            />
          </div>
          <div className="grow p-2 max-md:text-center md:px-5 md:py-3">
            <h3 className="text-xl font-light uppercase tracking-wider">
              {show.location.name}
            </h3>
            <p className="uppercase max-md:text-sm">{show.location.city}</p>
          </div>
        </Paper>
        {show.registrationUrl && (
          <Paper
            shadow="sm"
            radius="md"
            component="a"
            href={show.registrationUrl ?? undefined}
            target="_blank"
            className={cn(
              "col-span-2 flex flex-1 cursor-pointer items-center justify-center overflow-clip bg-mocha-500 p-3 text-2xl uppercase tracking-wider text-white transition-all hover:bg-mocha-300 active:scale-95",
            )}
          >
            {t("buy-cta")}
          </Paper>
        )}
        {/* <Paper
          shadow="sm"
          radius="md"
          component="a"
          href={
            show.ticketSale.url && show.ticketSale.open
              ? show.ticketSale.url
              : undefined
          }
          target="_blank"
          className={cn(
            "col-span-2 flex flex-1 items-center justify-center overflow-clip p-3 text-2xl uppercase tracking-wider text-white",
            {
              "cursor-pointer bg-mocha-500 transition-all hover:bg-mocha-300 active:scale-95":
                show.ticketSale.url && show.ticketSale.open,
              "bg-neutral-500": show.ticketSale.url && !show.ticketSale.open,
              "bg-neutral-500 text-base": !show.ticketSale.url,
            },
          )}
        >
          {show.ticketSale.url && show.ticketSale.open ? t("buy-cta") : null}
          {show.ticketSale.url && !show.ticketSale.open ? t("sold-out") : null}
          {!show.ticketSale.url ? t("sale-not-open") : null}
        </Paper> */}
      </div>

      <Space h="lg" />

      {show.schedule && <Schedule slots={show.schedule} />}
    </section>
  );
}
