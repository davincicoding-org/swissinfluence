"use client";

import type { MotionProps } from "motion/react";
import { type Route } from "next";
import Link from "next/link";
import * as m from "motion/react-m";

import { cn } from "@/ui/utils";

import type { ImageProps } from "./Image";
import { Image } from "./Image";

export interface LinkTileProps<R extends string> {
  label: string;
  imageProps: ImageProps;
  href: Route<R>;
  className?: string;
  external?: boolean;
  imageClassName?: string;
}

export function LinkTile<R extends string>({
  label,
  imageProps,
  href,
  className,
  external,
  ...motionProps
}: LinkTileProps<R> & MotionProps) {
  return (
    <m.div className={cn("group", className)} {...motionProps}>
      <Link
        target={external ? "_blank" : undefined}
        href={href}
        className="@container relative grid h-full w-full overflow-clip rounded-xl bg-mocha-300 duration-300 active:!scale-95"
      >
        <Image
          {...imageProps}
          className={cn(
            "h-full w-full object-cover object-center duration-1000 group-hover:scale-110",
            imageProps.className,
          )}
          alt=""
        />
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center hyphens-auto text-balance bg-neutral-700/50 px-4 text-center font-semibold uppercase !leading-tight tracking-wider text-white duration-500 group-hover:bg-mocha-500",
            "@sm:text-4xl @lg:text-5xl text-3xl",
          )}
        >
          {label}
        </div>
      </Link>
    </m.div>
  );
}
