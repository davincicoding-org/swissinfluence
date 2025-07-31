import { useId } from "react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { ScheduleSlots } from "@/payload-types";

import { cn } from "../utils";
import {
  HoverPortal,
  HoverPortalContent,
  HoverPortalTarget,
  HoverPortalTrigger,
} from "./HoverPortal";
import { RichText } from "./RichText";

export interface ScheduleProps {
  slots: NonNullable<ScheduleSlots>;
  className?: string;
}

export function Schedule({ slots, className }: ScheduleProps) {
  const t = useTranslations("events.event");
  const id = useId();

  return (
    <HoverPortal defaultValue={0}>
      <div
        className={cn(
          "grid overflow-clip rounded-box bg-base-100 shadow-md md:grid-cols-[1fr_2fr]",
          className,
        )}
      >
        <div
          className={cn(
            "join-vertical join overflow-y-auto md:max-h-96 md:bg-base-200 md:shadow-md",
          )}
        >
          {slots.map((slot, index) => (
            <HoverPortalTrigger
              id={index}
              key={slot.id}
              className="transition-colors md:data-[active=true]:bg-primary/20"
            >
              <div className="collapse join-item shrink-0 !rounded-none border border-base-300 md:cursor-auto">
                <label htmlFor={`schedule-${id}-${index}`} className="sr-only">
                  Toggle
                </label>
                <input type="checkbox" id={`schedule-${id}-${index}`} />

                <div className="collapse-title md:!pr-4">
                  <p className="mb-1 leading-none opacity-60">
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
                  <p className="pr-2 text-xl leading-tight font-medium">
                    {slot.title}
                  </p>
                </div>
                <div className="collapse-content md:hidden">
                  <HoverPortalContent id={index} passthrough>
                    <RichText data={slot.description} />
                  </HoverPortalContent>
                </div>
              </div>
            </HoverPortalTrigger>
          ))}
        </div>
        <div className="max-md:hidden">
          <HoverPortalTarget
            className="max-h-96 overflow-y-auto p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          />
        </div>
      </div>
    </HoverPortal>
  );
}
