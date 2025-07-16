"use client";

import type { MotionProps } from "motion/react";
import { type Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import type { Photo } from "@/payload-types";
import { cn } from "@/ui/utils";

export interface ILinkTileProps<R extends string> {
  label: string;
  image: Photo | null;
  href: Route<R>;
  className?: string;
  external?: boolean;
  imageClassName?: string;
}

export function LinkTile<R extends string>({
  label,
  image,
  href,
  className,
  external,
  ...motionProps
}: ILinkTileProps<R> & MotionProps) {
  return (
    <motion.div className={cn("group", className)} {...motionProps}>
      <Link
        target={external ? "_blank" : undefined}
        href={href}
        className="@container relative grid h-full w-full overflow-clip rounded-xl bg-mocha-300 duration-300 active:!scale-95"
      >
        {image && (
          <Image
            src={image.url ?? ""}
            width={image.width ?? 0}
            height={image.height ?? 0}
            // placeholder={image.blurDataURL ? "blur" : undefined}
            // blurDataURL={image.blurDataURL}
            className={cn(
              "h-full w-full object-cover object-center duration-1000 group-hover:scale-110",
            )}
            alt=""
          />
        )}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center hyphens-auto text-balance bg-neutral-700/50 px-4 text-center font-semibold uppercase !leading-tight tracking-wider text-white duration-500 group-hover:bg-mocha-500",
            "@sm:text-4xl @lg:text-5xl text-3xl",
          )}
        >
          {label}
        </div>
      </Link>
    </motion.div>
  );
}
