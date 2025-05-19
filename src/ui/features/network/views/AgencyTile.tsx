import { Button, Paper } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/ui/utils";

import { type IAgency } from "../data";

export interface IAgencyTileProps {
  data: IAgency;
  className?: string;
}

export function AgencyTile({
  data: { image, logo, website, name, about, email },
  className,
}: IAgencyTileProps) {
  const locale = useLocale();
  const t = useTranslations("network.agencies");

  return (
    <Paper
      radius="lg"
      className={cn("overflow-clip bg-cover bg-center", className)}
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div
        className={cn(
          "relative mx-auto flex max-w-lg flex-col items-center bg-black/50 px-6 py-12 text-white",
          "before:absolute before:inset-y-0 before:-left-36 before:w-36 before:bg-gradient-to-l before:from-black/50 before:to-transparent",
          "after:absolute after:inset-y-0 after:-right-36 after:w-36 after:bg-gradient-to-r after:from-black/50 after:to-transparent",
        )}
      >
        <a href={website} target="_blank" rel="noopener" className="mb-8">
          <img
            src={logo}
            alt={`${name} logo`}
            className="mx-auto max-h-24 max-w-[80%]"
          />
        </a>

        <h3 className="mb-3 text-3xl">{name}</h3>
        <p className="mb-5 text-lg">{about[locale]}</p>

        <Button
          component="a"
          href={`mailto:${email}`}
          target="_blank"
          variant="outline"
          color="white"
          size="lg"
          className="uppercase"
        >
          {t("contact-CTA")}
        </Button>
      </div>
    </Paper>
  );
}
