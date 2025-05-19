"use client";
import { useState } from "react";

import { Accordion, Paper, Space } from "@mantine/core";
import { IconCalendar, IconMapPin } from "@tabler/icons-react";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/ui/utils";

import { RichText } from "@/ui/components/RichText";

import { type IAwardShow } from "../data";

export interface IAwardShowProps {
  show: IAwardShow;
  className?: string;
  id?: string;
}

export function AwardShow({ show, className, id }: IAwardShowProps) {
  const locale = useLocale();
  const t = useTranslations("award.show");

  const [activeSection, setActiveSection] = useState(0);

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
          href={show.location.mapsURL}
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
        <Paper
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
        </Paper>
      </div>

      <Space h="lg" />

      <Paper
        radius="md"
        className="mb-auto overflow-clip bg-neutral-200 md:hidden"
      >
        <Accordion>
          {show.schedule.map((slot, index) => (
            <Accordion.Item
              key={slot.title.en}
              value={index.toString()}
              className="border-b-2 last:border-none"
            >
              <Accordion.Control className="active:bg-transparent">
                <h4 className="mb-1 text-lg leading-none text-mocha-500">
                  {slot.start && slot.end
                    ? `${slot.start} - ${slot.end}`
                    : null}
                  {slot.start && !slot.end
                    ? t("slot-from", { time: slot.start })
                    : null}
                  {!slot.start && slot.end
                    ? t("slot-until", { time: slot.end })
                    : null}
                </h4>
                <h4 className="text-nowrap text-xl font-medium leading-none">
                  {slot.title[locale]}
                </h4>
              </Accordion.Control>
              <Accordion.Panel className="bg-white">
                <RichText
                  className="prose-lg prose-li:m-0"
                  content={String(slot.description[locale])}
                />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Paper>

      <Paper
        shadow="sm"
        radius="md"
        className="mb-auto grid grid-cols-[2fr,3fr] overflow-clip bg-white max-md:hidden"
      >
        <div className="bg-neutral-200 shadow">
          {show.schedule.map((slot, index) => (
            <div
              key={slot.title.en}
              className={cn(
                "border-b-2 border-neutral-300 px-4 py-3 last:border-none",
                {
                  "bg-mocha-200": activeSection === index,
                },
              )}
              onMouseEnter={() => setActiveSection(index)}
            >
              <h4 className="mb-1 text-lg leading-none text-mocha-500">
                {slot.start && slot.end ? `${slot.start} - ${slot.end}` : null}
                {slot.start && !slot.end
                  ? t("slot-from", { time: slot.start })
                  : null}
                {!slot.start && slot.end
                  ? t("slot-until", { time: slot.end })
                  : null}
              </h4>
              <h4 className="text-nowrap text-xl font-medium leading-none">
                {slot.title[locale]}
              </h4>
            </div>
          ))}
        </div>
        <div className="my-auto grow p-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <RichText
                className="prose-lg prose-li:m-0"
                content={String(
                  show.schedule[activeSection]?.description[locale],
                )}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </Paper>
    </section>
  );
}
