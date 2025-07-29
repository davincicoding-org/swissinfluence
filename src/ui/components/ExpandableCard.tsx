"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { IconX } from "@tabler/icons-react";

import type { Photo } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { cn } from "@/ui/utils";

import { TextOverflowReveal } from "./TextOverflowReveal";

interface ExpandableCardProps {
  title: string;
  description?: string;
  image: Photo;
  logo?: {
    photo: Photo;
    url: string;
  };
  content: ReactNode;
  badge?: ReactNode;
  cta?: {
    label: string;
    url: string;
  };
  className?: string;
}

// TODO make this prettier
export function ExpandableCard({
  title,
  description,
  badge,
  image,
  logo,
  content,
  cta,
  className,
}: ExpandableCardProps) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div
        className={cn(
          "group flex cursor-pointer flex-col rounded-box border border-base-300 bg-base-100 p-4 pb-2 shadow-sm transition-all hover:bg-base-200",
          className,
        )}
        onClick={() => ref.current?.showModal()}
      >
        <div className="flex w-full flex-col gap-3">
          <div className="relative overflow-clip rounded-lg">
            {badge && (
              <div className="absolute top-3 left-3 z-10 badge badge-lg badge-primary">
                {badge}
              </div>
            )}
            <Image
              resource={image}
              alt={title}
              className="aspect-square"
              imgClassName="transition-transform duration-500 group-hover:scale-105"
              sizes="880px"
            />
          </div>
          <div className="-ml-2 grid items-center justify-center">
            <div className="mb-1 w-full min-w-0 text-center text-base font-medium text-nowrap">
              <TextOverflowReveal className="pl-2 text-nowrap" text={title} />
            </div>
            {description && (
              <p className="mb-1 min-w-0 truncate px-2 text-center text-base text-neutral-600">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <dialog ref={ref} className="modal">
        <div className="modal-box max-h-192 p-0">
          <div className="sticky top-0 z-20 -mb-14 flex h-14 items-center justify-end pr-3">
            <button
              className="btn !btn-circle bg-white/50 btn-ghost backdrop-blur-xs"
              onClick={() => ref.current?.close()}
            >
              <IconX />
            </button>
          </div>
          <div className="relative">
            <Image
              resource={image}
              alt={title}
              className="h-80 w-full object-cover object-center"
              sizes="880px"
              priority
            />
            <div className="absolute right-0 bottom-0 left-0 flex flex-nowrap items-end justify-between gap-5 bg-linear-to-t from-black/50 from-50% to-transparent p-4 pt-8">
              <p className="text-lg leading-tight font-medium text-pretty text-white">
                {title}
              </p>
              {logo && (
                <a href={logo.url} target="_blank" rel="noopener">
                  <Image
                    resource={logo.photo}
                    alt="Logo"
                    className="h-auto w-20"
                    sizes="160px"
                  />
                </a>
              )}
            </div>
            {badge && (
              <div className="absolute top-4 left-4 badge badge-lg badge-primary">
                {badge}
              </div>
            )}
          </div>

          <div className="p-4">{content}</div>

          {cta ? (
            <div className="sticky bottom-0 bg-white/80 p-4 before:absolute before:inset-x-0 before:-top-8 before:h-8 before:bg-linear-to-t before:from-white/80 before:to-transparent">
              <a
                href={cta.url}
                target="_blank"
                className="btn btn-block btn-primary"
              >
                {cta.label}
              </a>
            </div>
          ) : null}
        </div>
        <form method="dialog" className="modal-backdrop">
          {/* TODO i18n */}
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
