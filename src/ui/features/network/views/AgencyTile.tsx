import Image from "next/image";
import { Button, Paper } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";

import type { Agency } from "@/types";
import { cn } from "@/ui/utils";

export interface IAgencyTileProps {
  data: Agency;
  className?: string;
}

export function AgencyTile({
  data: { image, logo, website, name, description, email },
  className,
}: IAgencyTileProps) {
  const locale = useLocale();
  const t = useTranslations("network.agencies");

  return (
    <Paper
      radius="lg"
      className={cn("relative overflow-clip bg-cover bg-center", className)}
    >
      <Image
        src={image.src}
        alt={`${name} logo`}
        fill
        placeholder={image.blurDataURL ? "blur" : undefined}
        blurDataURL={image.blurDataURL}
        className="absolute inset-0 object-cover"
      />
      <div
        className={cn(
          "relative mx-auto flex max-w-lg flex-col items-center bg-black/50 px-6 py-12 text-white",
          "before:absolute before:inset-y-0 before:-left-36 before:w-36 before:bg-gradient-to-l before:from-black/50 before:to-transparent",
          "after:absolute after:inset-y-0 after:-right-36 after:w-36 after:bg-gradient-to-r after:from-black/50 after:to-transparent",
        )}
      >
        <a href={website} target="_blank" rel="noopener" className="mb-8">
          <Image
            src={logo.src}
            alt={`${name} logo`}
            width={logo.width}
            height={logo.height}
            placeholder={logo.blurDataURL ? "blur" : undefined}
            blurDataURL={logo.blurDataURL}
            className="mx-auto max-h-24 max-w-[80%]"
          />
        </a>

        <h3 className="mb-3 text-3xl">{name}</h3>
        <p className="mb-5 text-lg">{description[locale]}</p>

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
