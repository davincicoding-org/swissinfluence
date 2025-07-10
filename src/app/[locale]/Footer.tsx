"use client";

import Image from "next/image";
import { Button, Paper } from "@mantine/core";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { type GlobalData } from "@/react-admin/globals";
import { SocialMediaPlatformIcon } from "@/ui/components/SocialMediaPlatformIcon";
import { cn } from "@/ui/utils";

export interface IFooterProps {
  company: GlobalData<"company">;
  contactURL: string;
  newsletterURL: string;
  className?: string;
}

export function Footer({
  company,
  contactURL,
  newsletterURL,
  className,
}: IFooterProps) {
  const t = useTranslations();

  return (
    <footer
      className={cn(
        "relative z-10 flex flex-col gap-6 bg-neutral-700 px-4 pb-6 pt-8 text-neutral-400",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-6 max-md:flex-wrap">
        <Link href="/" className="md:w-36">
          <Image
            className="w-24 lg:w-32"
            alt="SIA Logo"
            src="$/logos/main.svg"
            width={89}
            height={44}
          />
        </Link>
        <Paper
          bg={undefined}
          shadow="xs"
          radius="md"
          className="flex items-center justify-between gap-x-4 gap-y-3 bg-neutral-600 p-3 max-md:order-1 max-md:basis-full max-sm:flex-wrap md:p-2"
        >
          <p className="md:text-centerd text-pretty text-sm leading-snug text-neutral-300">
            {t("newsletter.description")}
          </p>
          <Button
            component="a"
            href={newsletterURL}
            target="_blank"
            size="xs"
            className="shrink-0 max-sm:basis-full"
          >
            {t("newsletter.CTA")}
          </Button>
        </Paper>
        <div className={cn("flex justify-end gap-2 md:w-36")}>
          {company.socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener"
              className="transition-colors hover:text-mocha-500"
            >
              <SocialMediaPlatformIcon
                platform={social.platform}
                size={40}
                strokeWidth={1}
              />
            </a>
          ))}
        </div>
        {/* <div className="flex gap-1 rounded border border-neutral-500 bg-white/20 text-white max-md:hidden">
          {locales.map((option) => (
            <Link
              key={option}
              href={
                pathname.replace(
                  new RegExp(`^/${locale}`),
                  `/${option}`,
                ) as Route<R>
              }
              className={cn("block px-2.5 py-2 uppercase leading-none", {
                "pointer-events-none rounded bg-mocha-500": locale === option,
              })}
            >
              {option}
            </Link>
          ))}
        </div> */}
      </div>

      <div className="flex flex-col gap-4 md:flex-row-reverse md:items-center">
        <div
          className={cn("flex flex-1 flex-wrap gap-x-4 gap-y-1 md:justify-end")}
        >
          <a
            href={contactURL}
            target="_blank"
            rel="noopener"
            className="underline-offset-4 hover:underline"
          >
            {t("navigation.sub.contact")}
          </a>

          <Link
            href={`/imprint`}
            target="_blank"
            className="underline-offset-4 hover:underline"
          >
            {t("navigation.sub.imprint")}
          </Link>
          <Link
            href={`/privacy`}
            target="_blank"
            className="underline-offset-4 hover:underline"
          >
            {t("navigation.sub.privacy")}
          </Link>
          <Link
            href={`/nomination-process`}
            target="_blank"
            className="underline-offset-4 hover:underline"
          >
            {t("navigation.sub.nomination-process")}
          </Link>
          <Link
            href={`/sponsoring`}
            target="_blank"
            className="underline-offset-4 hover:underline"
          >
            {t("navigation.sub.sponsoring")}
          </Link>
        </div>

        <div
          className={cn("flex flex-1 flex-col justify-between gap-1 text-sm")}
        >
          <span>
            © {new Date().getFullYear()} - {company.name}
          </span>
          <span>
            Website by{" "}
            <a
              href="https://davincicoding.ch"
              target="_blank"
              className="underline underline-offset-4"
              rel="noopener"
            >
              DAVINCI CODING
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
