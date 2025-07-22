import { useState } from "react";
import { Accordion, Paper, ScrollArea } from "@mantine/core";
import dayjs from "dayjs";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";

import type { ScheduleSlots } from "@/payload-types";

import { cn } from "../utils";
import { RichText } from "./RichText";

export interface ScheduleProps {
  slots: NonNullable<ScheduleSlots>;
}

export function Schedule({ slots }: ScheduleProps) {
  const t = useTranslations("events.event");
  const [activeSection, setActiveSection] = useState(0);

  return (
    <>
      {/* Mobile */}
      <Paper
        radius="md"
        className="mb-auto overflow-clip bg-neutral-200 md:hidden"
      >
        <Accordion>
          {slots.map((slot, index) => (
            <Accordion.Item
              key={slot.id}
              value={index.toString()}
              className="border-b-2 last:border-none"
            >
              <Accordion.Control className="active:bg-transparent">
                <h4 className="mb-1 text-lg leading-none text-mocha-500">
                  {slot.from && slot.to
                    ? `${dayjs(slot.from).format("HH:mm")} - ${dayjs(slot.to).format("HH:mm")}`
                    : null}
                  {slot.from && !slot.to
                    ? t("slot-from", {
                        time: dayjs(slot.from).format("HH:mm"),
                      })
                    : null}
                  {!slot.from && slot.to
                    ? t("slot-until", {
                        time: dayjs(slot.to).format("HH:mm"),
                      })
                    : null}
                </h4>
                <h4 className="text-nowrap text-xl font-medium leading-none">
                  {slot.title}
                </h4>
              </Accordion.Control>
              <Accordion.Panel className="bg-white">
                <RichText data={slot.description} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Paper>

      {/* Desktop */}

      <Paper
        shadow="sm"
        radius="md"
        className="mb-auto grid grid-cols-[2fr,3fr] overflow-clip bg-white max-md:hidden"
      >
        <ScrollArea
          scrollbars="y"
          classNames={{
            root: "bg-neutral-200 shadow",
            viewport: "max-h-96",
          }}
        >
          {slots.map((slot, index) => (
            <div
              key={slot.id}
              className={cn(
                "border-b border-neutral-300 px-4 py-3 last:border-none",
                {
                  "bg-mocha-200": activeSection === index,
                },
              )}
              onMouseEnter={() => setActiveSection(index)}
            >
              <h4 className="mb-1 text-lg leading-none text-mocha-500">
                {slot.from && slot.to
                  ? `${dayjs(slot.from).format("HH:mm")} - ${dayjs(slot.to).format("HH:mm")}`
                  : null}
                {slot.from && !slot.to
                  ? t("slot-from", {
                      time: dayjs(slot.from).format("HH:mm"),
                    })
                  : null}
                {!slot.from && slot.to
                  ? t("slot-until", {
                      time: dayjs(slot.to).format("HH:mm"),
                    })
                  : null}
              </h4>
              <h4 className="text-pretty text-xl font-medium leading-tight">
                {slot.title}
              </h4>
            </div>
          ))}
        </ScrollArea>

        <AnimatePresence mode="wait">
          <m.div
            key={activeSection}
            className="my-auto grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ScrollArea
              scrollbars="y"
              classNames={{
                viewport: "max-h-96",
              }}
            >
              <RichText
                className="p-3"
                data={
                  slots[activeSection]?.description ?? {
                    root: {
                      type: "doc",
                      children: [],
                      direction: "ltr",
                      format: "",
                      indent: 0,
                      version: 1,
                    },
                  }
                }
              />
            </ScrollArea>
          </m.div>
        </AnimatePresence>
      </Paper>
    </>
  );
}
