import { type Route } from "next";
import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import { LinkTile } from "@/ui/components/LinkTile";
import { PageHero } from "@/ui/components/PageHero";
import { cn } from "@/ui/utils";

export interface INetworkPageProps<R extends string> {
  heroImage: Photo;
  links: Array<{
    label: string;
    image: Photo;
    href: Route<R> | string;
    large?: boolean;
    external?: boolean;
  }>;
}

export function NetworkPage<R extends string>({
  heroImage,
  links,
}: INetworkPageProps<R>) {
  const t = useTranslations("network.page");

  return (
    <>
      <PageHero
        className="snap-start"
        image={heroImage}
        title={t("hero.title")}
        headline={t("hero.headline")}
      />
      <main className="relative z-20 snap-start snap-always bg-white/80 py-32 backdrop-blur lg:pb-64">
        <section className="container grid auto-rows-auto gap-8 md:grid-cols-2 lg:gap-12">
          {links.map((link) => (
            <LinkTile
              key={link.label}
              label={link.label}
              image={link.image}
              href={link.href as Route<R>}
              external={link.external}
              className={cn("aspect-video", {
                "md:col-span-2 md:aspect-auto md:h-80": link.large,
              })}
              initial={{ scale: 0.9, opacity: 0.5 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            />
          ))}
        </section>
      </main>
    </>
  );
}
