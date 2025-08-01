"use client";

import { useRef } from "react";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { cn } from "@/ui/utils";
import { ensureResolved } from "@/utils/payload";

export interface CertificationRegistrationProps {
  title: string;
  headline: string;
  image: Photo;
  content: React.ReactNode;
  application: {
    label: string;
    url: string;
  };
  className?: string;
}

export function CertificationRegistration({
  title,
  headline,
  content,
  image,
  className,
  application,
}: CertificationRegistrationProps) {
  const t = useTranslations("influencers.certification");
  const modalRef = useRef<HTMLDialogElement>(null);

  const photo = ensureResolved(image);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "group relative cursor-pointer overflow-clip rounded-box border border-base-300 bg-base-100 shadow-md transition-transform hover:scale-[1.01]",
          className,
        )}
        onClick={() => modalRef.current?.showModal()}
      >
        {photo && (
          <Image
            resource={photo}
            alt=""
            className="aspect-video w-full"
            imgClassName="transition-transform group-hover:scale-105 duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
        <div className="absolute right-0 bottom-0 left-0 bg-black/50 p-4 text-white before:absolute before:inset-x-0 before:-top-24 before:h-24 before:bg-linear-to-t before:from-black/50 before:to-transparent">
          <h3 className="mb-1.5 text-xl leading-tight font-medium text-balance uppercase sm:text-2xl">
            {title}
          </h3>
          <p>{headline}</p>
        </div>
      </div>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box p-0">
          <header className="sticky top-0 z-10 mb-4 flex h-14 items-center justify-between border-b border-base-300 pr-2 pl-4 backdrop-blur-sm">
            <h3 className="text-2xl font-medium">{t("title")}</h3>
            <button
              className="btn !btn-circle btn-ghost btn-sm"
              onClick={() => modalRef.current?.close()}
            >
              <IconX />
            </button>
          </header>
          <div className="p-4">{content}</div>
          <div className="p-4 pt-0">
            <a
              className="btn btn-block uppercase btn-lg btn-primary"
              href={application.url}
              target="_blank"
            >
              {application.label}
            </a>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
