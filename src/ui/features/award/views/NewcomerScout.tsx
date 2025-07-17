import { Button, Paper, ScrollArea } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import type { RichTextProps } from "@/ui/components/RichText";
import { Image } from "@/ui/components/Image";
import { RichText } from "@/ui/components/RichText";
import { TimeLeft } from "@/ui/components/TimeLeft";
import { cn } from "@/ui/utils";

export interface IAwardNominationProps {
  deadline: string;
  image: Photo;
  content: RichTextProps["data"];
  formURL: string;
  className?: string;
}

export function NewcomerScout({
  deadline,
  formURL,
  content,
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
        className="relative flex aspect-square flex-col gap-2 bg-neutral-400 shadow-sm lg:order-2"
      >
        <Image
          resource={image}
          alt="Newcomer Scout"
          className="absolute inset-0 h-full w-full object-cover object-center"
          sizes="(max-width: 1023px) 100vw, 50vw"
        />

        <Paper
          radius={0}
          className="relative z-10 mt-auto grid gap-2 bg-white/30 p-4 backdrop-blur max-lg:hidden"
        >
          <Button
            radius="md"
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
            "before:z-5 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-6 before:bg-gradient-to-b before:from-neutral-200 before:to-transparent",
            "after:z-5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-6 after:bg-gradient-to-t after:from-neutral-200 after:to-transparent",
          ),
          scrollbar: "z-10",
        }}
      >
        <div className="grid">
          <RichText
            className="prose-lg min-w-0 max-w-full shrink text-pretty px-4 py-6 leading-snug lg:px-8"
            enableProse={false}
            data={content}
          />
          <div className="m-4 mt-0 grid gap-2 lg:hidden">
            <Button
              radius="md"
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
