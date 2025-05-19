import { Button, Paper, ScrollArea } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { ImageMedia } from "@/cms/lib/fields";
import { cn } from "@/ui/utils";

import { RichText } from "@/ui/components/RichText";
import { TimeLeft } from "@/ui/components/TimeLeft";

export interface IAwardNominationProps {
  deadline: string;
  image: ImageMedia;
  formURL: string;
  className?: string;
}

export function NewcomerScout({
  deadline,
  formURL,
  image,
  className,
}: IAwardNominationProps) {
  const t = useTranslations("award.newcomer-scout");

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="lg"
      className={cn(
        "grid justify-between overflow-clip bg-neutral-200 lg:aspect-[2/1] lg:max-h-[70vh] lg:grid-cols-[1fr_auto]",
        className,
      )}
    >
      <Paper
        radius="lg"
        className="flex aspect-square flex-col gap-2 bg-neutral-400 bg-cover shadow-sm lg:order-2"
        style={{ backgroundImage: `url(${image.src})` }}
      >
        <Paper
          radius="lg"
          className="mt-auto grid gap-2 bg-white/30 p-4 backdrop-blur max-lg:hidden"
        >
          <Button
            radius="md"
            color="mocha"
            size="lg"
            className="uppercase"
            component="a"
            href={formURL}
            target="_blank"
          >
            {t("CTA")}
          </Button>

          <p className="text-center text-lg font-semibold uppercase tracking-wider">
            <TimeLeft deadline={deadline} />
          </p>
        </Paper>
      </Paper>

      <ScrollArea
        scrollbars="y"
        classNames={{
          root: cn(
            "relative",
            "before:bg-gradient-to-b before:from-neutral-200 before:to-transparent before:z-5 before:absolute before:top-0 before:inset-x-0 before:h-6 before:pointer-events-none",
            "after:bg-gradient-to-t after:from-neutral-200 after:to-transparent after:z-5 after:absolute after:bottom-0 after:inset-x-0 after:h-6 after:pointer-events-none",
          ),
          scrollbar: "z-10",
        }}
      >
        <div className="grid">
          <h3 className="px-4 py-6 pb-0 text-2xl font-light uppercase tracking-wider lg:px-8">
            {t("title")}
          </h3>

          <RichText
            className="prose-lg min-w-0 max-w-full shrink text-pretty px-4 py-6 leading-snug lg:px-8"
            content={String(t.raw("description") ?? "")}
          />
          <div className="m-4 mt-0 grid gap-2 lg:hidden">
            <Button
              radius="md"
              color="mocha"
              size="md"
              className="uppercase"
              component="a"
              href={formURL}
              target="_blank"
            >
              {t("CTA")}
            </Button>
            <p className="mt-2 text-center font-medium uppercase tracking-wider">
              <TimeLeft deadline={deadline} />
            </p>
          </div>
        </div>
      </ScrollArea>
    </Paper>
  );
}
