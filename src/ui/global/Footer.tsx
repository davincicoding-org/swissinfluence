"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Company } from "@/payload-types";
import type { ContactInfo } from "@/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/ui/utils";

import { SocialsLinks } from "../components/SocialLinks";
import { NewsletterSignUp } from "./NewsletterSignUp";

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
        "relative z-10 flex flex-col bg-neutral-700 px-4 pt-8 pb-6 text-neutral-300",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-6 max-sm:flex-wrap">
        <Image
          className="w-24 lg:w-32"
          alt="SIA Logo"
          src="/logos/main.svg"
          width={89}
          height={44}
        />
        <div className="inline-flex items-center justify-between gap-x-4 gap-y-3 rounded-box bg-neutral-600 p-3 shadow-md max-sm:order-1 max-sm:basis-full max-sm:flex-wrap sm:max-w-108">
          <p className="text-sm leading-snug text-pretty text-neutral-300">
            {t("newsletter.description")}
          </p>
          <button
            className="btn shrink-0 btn-sm btn-primary max-sm:basis-full"
            onClick={() => setNewsletterSignUpOpened(true)}
          >
            {t("newsletter.CTA")}
          </button>
          <NewsletterSignUp
            opened={newsletterSignUpOpened}
            onClose={() => setNewsletterSignUpOpened(false)}
            submitting={newsletterSubmitting}
            onSubmit={handleNewsletterSubmit}
          />
        </div>
        <SocialsLinks
          // className={cn("flex justify-end gap-2 md:w-36")}
          items={company.socials ?? []}
          classNames={{
            item: "btn-lg md:btn-xl",
            icon: "size-8 md:size-10",
          }}
        />
      </div>

      <div className="mx-16 my-8 h-px rounded-full bg-current opacity-30" />

      <div className="flex flex-col gap-4 sm:flex-row-reverse sm:items-center">
        <div
          className={cn(
            "flex flex-1 flex-wrap justify-center gap-x-4 gap-y-1 sm:max-w-sm sm:justify-end",
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
          className={cn(
            "flex flex-1 flex-col justify-between gap-1 text-sm max-sm:text-center",
          )}
        >
          <span>
            © {new Date().getFullYear()} - {company.name}
          </span>
          <span>
            Website by{" "}
            <a
              href="https://davincicoding.ch"
              target="_blank"
              className="font-medium tracking-widest text-yellow-400 underline-offset-4 hover:underline"
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
