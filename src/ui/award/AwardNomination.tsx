import { Button, Paper, ScrollArea } from "@mantine/core";
import { useTranslations } from "next-intl";

import { HTMLRichText } from "@/ui/components/HTMLRichText";
import { TimeLeft } from "@/ui/components/TimeLeft";
import { cn } from "@/ui/utils";

export interface IAwardNominationProps {
  deadline: string;
  formURL: string;
  className?: string;
}

export function AwardNomination({
  deadline,
  formURL,
  className,
}: IAwardNominationProps) {
  const t = useTranslations("award.nomination");
  return (
    <Paper
      withBorder
      shadow="sm"
      radius="lg"
      className={cn(
        "grid justify-between overflow-clip bg-neutral-200 lg:grid-cols-[auto,1fr]",
        className,
      )}
    >
      <Paper
        radius="lg"
        className="flex flex-col gap-2 bg-neutral-400 p-6 shadow-sm lg:min-w-96 lg:p-10"
      >
        <h3 className="text-4xl font-light uppercase tracking-wider sm:text-5xl md:text-6xl">
          {t("title")}
        </h3>
        <p className="text-xl uppercase md:text-2xl">
          <TimeLeft deadline={deadline} />
        </p>

        <Button
          radius="md"
          size="lg"
          className="-m-6 mt-auto uppercase tracking-widest max-lg:hidden"
          component="a"
          href={formURL}
          target="_blank"
        >
          {t("CTA")}
        </Button>
      </Paper>

      <ScrollArea
        scrollbars="y"
        type="always"
        classNames={{
          root: cn(
            "relative lg:max-h-[70vh]",
            "before:z-5 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-6 before:bg-gradient-to-b before:from-neutral-200 before:to-transparent",
            "after:z-5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-6 after:bg-gradient-to-t after:from-neutral-200 after:to-transparent",
          ),
          scrollbar: "z-10",
        }}
      >
        <div className="grid">
          <HTMLRichText
            className="prose-lg min-w-0 max-w-full shrink px-4 py-6 leading-snug lg:px-8"
            content={String(t.raw("description"))}
          />

          <Button
            radius="md"
            size="md"
            className="m-4 mt-0 uppercase tracking-widest lg:hidden"
            component="a"
            href={formURL}
            target="_blank"
          >
            {t("CTA")}
          </Button>
        </div>
      </ScrollArea>
    </Paper>
  );
}
