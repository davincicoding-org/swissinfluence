import { Button, Paper } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { Agency } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { cn } from "@/ui/utils";
import { ensureResolved } from "@/utils/payload";

export interface AgencyTileProps {
  data: Agency;
  className?: string;
}

export function AgencyTile({ data, className }: AgencyTileProps) {
  const t = useTranslations("network.agencies");

  const image = ensureResolved(data.image);
  const logo = ensureResolved(data.logo);

  return (
    <Paper
      radius="lg"
      className={cn("relative overflow-clip bg-cover bg-center", className)}
    >
      {image && (
        <Image
          resource={image}
          alt={`${data.name} background`}
          fill
          className="absolute inset-0 object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      )}
      <div
        className={cn(
          "relative mx-auto flex max-w-lg flex-col items-center bg-black/50 px-6 py-12 text-white",
          "before:absolute before:inset-y-0 before:-left-36 before:w-36 before:bg-gradient-to-l before:from-black/50 before:to-transparent",
          "after:absolute after:inset-y-0 after:-right-36 after:w-36 after:bg-gradient-to-r after:from-black/50 after:to-transparent",
        )}
      >
        {logo && (
          <a
            href={data.website}
            target="_blank"
            rel="noopener"
            className="mb-8"
          >
            <Image
              resource={logo}
              alt={`${data.name} logo`}
              className="mx-auto max-h-24 max-w-[80%]"
              sizes="(max-width: 768px) 160px, 256px"
            />
          </a>
        )}

        <h3 className="mb-3 text-3xl">{data.name}</h3>
        <p className="mb-5 text-lg">{data.description}</p>

        <Button
          component="a"
          href={`mailto:${data.email}`}
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
