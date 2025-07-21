"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Paper } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { Company } from "@/payload-types";
import type { ContactInfo } from "@/types";
import { Link } from "@/i18n/navigation";
import { SocialMediaPlatformIcon } from "@/ui/components/SocialMediaPlatformIcon";
import { NewsletterSignUp } from "@/ui/global/NewsletterSignUp";
import { cn } from "@/ui/utils";

export interface FooterProps {
  company: Company;
  className?: string;
  newsletterHandler: (values: ContactInfo) => Promise<void>;
}

export function Footer({ company, className, newsletterHandler }: FooterProps) {
  const t = useTranslations();

  const [newsletterSignUpOpened, setNewsletterSignUpOpened] = useState(false);

  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  const handleNewsletterSubmit = async (values: ContactInfo) => {
    setNewsletterSubmitting(true);
    await newsletterHandler(values);
    setNewsletterSignUpOpened(false);
    setNewsletterSubmitting(false);
  };

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
            src="/logos/main.svg"
            width={89}
            height={44}
          />
        </Link>
        <Paper
          bg={undefined}
          shadow="xs"
          radius="md"
          className="flex items-center justify-between bg-neutral-600 max-md:order-1 max-md:basis-full max-sm:flex-wrap"
        >
          <p className="text-pretty p-2 text-sm leading-snug text-neutral-300 md:px-2.5 md:pr-4">
            {t("newsletter.description")}
          </p>
          <Button
            size="sm"
            radius="md"
            className="shrink-0 max-sm:basis-full"
            onClick={() => setNewsletterSignUpOpened(true)}
          >
            {t("newsletter.CTA")}
          </Button>
          <NewsletterSignUp
            opened={newsletterSignUpOpened}
            onClose={() => setNewsletterSignUpOpened(false)}
            submitting={newsletterSubmitting}
            onSubmit={handleNewsletterSubmit}
          />
        </Paper>
        <div className={cn("flex justify-end gap-2 md:w-36")}>
          {(company.socials ?? []).map((social) => (
            <a
              key={social.platform}
              href={social.url}
              aria-label={social.platform}
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
      </div>

      <div className="flex flex-col gap-4 md:flex-row-reverse md:items-center">
        <div
          className={cn(
            "flex max-w-sm flex-1 flex-wrap gap-x-4 gap-y-1 md:justify-end",
          )}
        >
          <a
            href={company.contactUrl}
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
