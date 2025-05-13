import { Button, Paper, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import { cn } from "@/ui/utils";

export interface INewsletterProps {
  formURL: string;
  className?: string;
}

export function Newsletter({ formURL, className }: INewsletterProps) {
  const t = useTranslations("newsletter");
  return (
    <Paper
      withBorder
      shadow="sm"
      radius="lg"
      className={cn(
        "flex justify-between gap-6 bg-neutral-200 p-8 max-md:flex-col",
        className,
      )}
    >
      <Stack gap="xs">
        <h3 className="text-3xl text-balance uppercase">{t("title")}</h3>
        <p>{t("description")}</p>
      </Stack>
      <Button
        component="a"
        href={formURL}
        target="_blank"
        color="mocha"
        size="md"
        radius="md"
        className="my-auto h-auto shrink-0 tracking-wider uppercase"
        classNames={{
          inner: "min-h-11 py-2",
          label: "text-balance text-wrap leading-snug",
        }}
      >
        {t("CTA")}
      </Button>
    </Paper>
  );
}
