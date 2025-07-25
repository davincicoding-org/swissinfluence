import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Paper,
  ScrollArea,
} from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { ScheduleSlots } from "@/payload-types";

import { cn } from "../utils";
import {
  HoverContent,
  HoverContentItem,
  HoverContentPortal,
} from "./HoverContent";
import { RichText } from "./RichText";
import { ScrollableSpoiler } from "./ScrollableSpoiler";

export interface ScheduleProps {
  slots: NonNullable<ScheduleSlots>;
}

export function Schedule({ slots }: ScheduleProps) {
  const t = useTranslations("events.event");

  return (
    <>
      {/* Mobile */}
      <Paper
        radius="md"
        className="mb-auto overflow-clip bg-neutral-200 md:hidden"
      >
        <Accordion>
          {slots.map((slot, index) => (
            <AccordionItem
              key={slot.id}
              value={index.toString()}
              className="border-b-2 last:border-none"
            >
              <AccordionControl className="active:bg-transparent">
                <p className="mb-1 text-lg leading-none text-mocha-500">
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
                </p>
                <p className="pr-2 text-xl font-medium leading-tight">
                  {slot.title}
                </p>
              </AccordionControl>
              <AccordionPanel className="bg-white">
                <RichText data={slot.description} />
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Paper>

      {/* Desktop */}

      <HoverContent defaultValue={0}>
        <Paper
          shadow="sm"
          radius="md"
          className="mb-auto grid grid-cols-[2fr,3fr] overflow-clip bg-white max-md:hidden"
        >
          <ScrollArea
            scrollbars="y"
            bg="gray.0"
            classNames={{
              root: "border-r",
              viewport: "max-h-96",
            }}
          >
            {slots.map((slot, index) => (
              <HoverContentItem
                key={slot.id}
                id={index}
                trigger={
                  <div
                    className={cn(
                      "border-b border-neutral-300 px-4 py-3 last:border-none",
                      "data-[active=true]:bg-mocha-200",
                    )}
                  >
                    <p className="mb-1 text-lg leading-none text-neutral-600">
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
                    </p>
                    <p className="text-pretty text-xl font-medium leading-tight">
                      {slot.title}
                    </p>
                  </div>
                }
              >
                <RichText data={slot.description} />
              </HoverContentItem>
            ))}
          </ScrollArea>

          <ScrollableSpoiler
            className="grow"
            classNames={{
              scrollArea: {
                viewport: "max-h-96",
              },
            }}
          >
            <HoverContentPortal
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            />
          </ScrollableSpoiler>
        </Paper>
      </HoverContent>
    </>
  );
}
