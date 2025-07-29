import { useTranslations } from "next-intl";

import { HTMLRichText } from "@/ui/components/HTMLRichText";
import { TimeLeft } from "@/ui/components/TimeLeft";
import { cn } from "@/ui/utils";

export interface AwardNominationProps {
  deadline: string;
  formURL: string;
  className?: string;
}

export function AwardNomination({
  deadline,
  formURL,
  className,
}: AwardNominationProps) {
  const t = useTranslations("award.nomination");

  return (
    <div className="grid gap-4">
      <div className="rounded-box border border-base-300 bg-base-100 shadow-md md:order-2">
        <HTMLRichText
          className="prose-lg max-w-none p-4"
          content={String(t.raw("description"))}
        />
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row-reverse md:items-center">
        <a
          className="btn tracking-widest uppercase btn-xl btn-primary"
          href={formURL}
          target="_blank"
        >
          {t("CTA")}
        </a>

        <p className="text-center text-lg uppercase md:text-3xl">
          <TimeLeft deadline={deadline} />
        </p>
      </div>
    </div>
  );
}
