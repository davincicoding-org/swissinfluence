import { useState } from "react";
import { Accordion, Paper, ScrollArea } from "@mantine/core";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

import type { ScheduleSlots } from "@/payload-types";

import { cn } from "../utils";
import { RichText } from "./RichText";

export interface ScheduleProps {
  slots: NonNullable<ScheduleSlots>;
}

export function Schedule({ slots }: ScheduleProps) {
  // TODO: use correct translations
  const t = useTranslations("award.show");
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
                <RichText
                  className="prose-lg prose-li:m-0"
                  data={slot.description}
                />
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
        <ScrollArea className="!h-96 bg-neutral-200 shadow" scrollbars="y">
          {slots.map((slot, index) => (
            <div
              key={slot.id}
              className={cn(
                "border-b-2 border-neutral-300 px-4 py-3 last:border-none",
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
          <motion.div
            key={activeSection}
            className="my-auto grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ScrollArea className="!h-96" scrollbars="y">
              <RichText
                className="prose-lg p-3 prose-li:m-0"
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
          </motion.div>
        </AnimatePresence>
      </Paper>
    </>
  );
}
