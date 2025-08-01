"use client";

import { useRef } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { tv } from "tailwind-variants";

import type { Photo } from "@/payload-types";
import type { Brand } from "@/types";
import { Image } from "@/ui/components/Image";

import { Dialog, DialogContent, DialogTrigger } from "./Dialog";

export interface ExpandableCardProps {
  title: string;
  image: Photo;
  organizer?: Brand;
  content: React.ReactNode;
  badge?: React.ReactNode;
  cta?: {
    label: string;
    url: string;
  };
  className?: string;
}

const $ = {
  root: tv({
    base: "group relative flex cursor-pointer overflow-clip rounded-box border border-base-300 bg-base-100 shadow-md transition-transform duration-300 active:scale-95",
  }),
  image: tv({
    base: "relative aspect-square size-32 shrink-0 overflow-clip sm:size-60 md:size-72",
  }),
  logoContainer: tv({
    base: "absolute inset-x-0 bottom-0 sm:top-3",
  }),
  logo: tv({
    base: "mx-auto aspect-video w-24 object-right",
  }),
  content: tv({
    base: "inset-0 flex flex-col justify-center p-3 sm:absolute sm:justify-end",
  }),
  badge: tv({
    base: "mb-2 badge shrink-0 badge-sm shadow-sm sm:mx-auto sm:badge-lg",
  }),
  contentBottom: tv({
    base: "sm:rounded-lg sm:bg-base-100/60 sm:p-2 sm:backdrop-blur-sm",
  }),
  title: tv({
    base: "text-lg leading-tight tracking-wider text-pretty sm:text-center",
  }),
  description: tv({
    base: "",
  }),
};

// TODO make this prettier
export function ExpandableCard({
  title,
  badge,
  image,
  organizer,
  content,
  cta,
  className,
}: ExpandableCardProps) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={$.root({ className })}
          onClick={() => ref.current?.showModal()}
        >
          <div className={$.image()}>
            <Image
              resource={image}
              alt={title}
              className="size-full"
              imgClassName="transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 128px, (max-width: 768px) 240px, 288px"
            />
            {organizer && (
              <div className={$.logoContainer()}>
                <Image
                  resource={organizer.logo}
                  alt="Logo"
                  className={$.logo()}
                  imgClassName="object-contain"
                />
              </div>
            )}
          </div>
          <div className={$.content()}>
            {badge && <div className={$.badge()}>{badge}</div>}
            <div className={$.contentBottom()}>
              <p className={$.title()}>{title}</p>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-xl p-0">
        <div className="relative aspect-video">
          <Image
            resource={image}
            alt={title}
            fill
            className="size-full"
            // TODO optimize sizes
            // sizes="(max-width: 640px) 128px, (max-width: 768px) 240px, 288px"
          />
          <header className="absolute inset-x-0 bottom-0 flex flex-nowrap items-end justify-between gap-5 bg-linear-to-t from-black/50 from-50% to-transparent p-4 pt-8">
            <DialogTitle className="text-2xl leading-tight tracking-wider text-pretty text-white">
              {title}
            </DialogTitle>
            {organizer && (
              <a href={organizer.website} target="_blank" rel="noopener">
                <Image
                  resource={organizer.logo}
                  alt="Logo"
                  className="aspect-video"
                  imgClassName="object-contain !object-right !object-bottom"
                  sizes="160px"
                />
              </a>
            )}
          </header>
        </div>
        <div className="scroll-vertical aspect-square p-6 md:aspect-video">
          {content}
          {cta ? (
            <div className="sticky bottom-0 flex">
              <a
                href={cta.url}
                target="_blank"
                className="btn mx-auto btn-lg btn-primary"
              >
                {cta.label}
              </a>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
