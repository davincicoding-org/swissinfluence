import { IconCalendar, IconMapPin, IconTicket } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import type { Location, ScheduleSlots } from "@/payload-types";
import { Schedule } from "@/ui/components/Schedule";
import { cn, formatDate } from "@/ui/utils";

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
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="mt-auto grid grid-cols-2 gap-5 lg:grid-cols-3">
        <div className="flex flex-col overflow-clip rounded-box bg-base-100 shadow-sm lg:flex-row">
          <div className="flex shrink-0 items-center justify-center bg-primary p-2 lg:aspect-square lg:h-20">
            <IconCalendar className="stroke-white" size={48} stroke={1} />
          </div>
          <p
            className={cn(
              "m-auto text-center tracking-wider uppercase",
              date ? "text-2xl text-nowrap" : "text-balance",
            )}
          >
            {date ? formatDate(date) : t("date-tbd")}
          </p>
        </div>

        <a
          className="flex flex-col overflow-clip rounded-box bg-base-100 shadow-sm lg:flex-row"
          href={location.url}
          target="_blank"
        >
          <div className="flex shrink-0 items-center justify-center bg-primary p-2 lg:aspect-square lg:h-20">
            <IconMapPin className="stroke-white" size={48} stroke={1} />
          </div>
          <div className="m-auto grow p-2 max-lg:text-center lg:px-5 lg:py-3">
            <p className="text-xl tracking-wider uppercase">{location.name}</p>
            <p className="text-sm tracking-wider text-neutral-600 uppercase">
              {location.city}
            </p>
          </div>
        </a>

        <a
          href={registrationUrl ?? ""}
          target="_blank"
          className={cn(
            "btn col-span-2 !h-auto min-h-12 !rounded-box btn-xl btn-primary lg:col-span-1",
            { "btn-disabled": !registrationUrl },
          )}
        >
          <IconTicket className="no-resize" size={40} stroke={1} />
          {t("register-cta")}
        </a>
      </div>

      {schedule && schedule.length > 0 && <Schedule slots={schedule} />}
    </div>
  );
}
