"use client";

import type { MotionProps } from "motion/react";
import { type Route } from "next";
import * as m from "motion/react-m";

import { Link } from "@/i18n/navigation";
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
        className="@container relative grid h-full w-full overflow-clip rounded-xl bg-primary/50 duration-300 active:scale-95!"
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
            "absolute inset-0 flex items-center justify-center bg-neutral/50 px-4 text-center leading-tight font-medium tracking-wider text-balance hyphens-auto text-white uppercase duration-500 group-hover:bg-primary/80 group-hover:backdrop-blur-xs",
            "text-3xl @sm:text-4xl @lg:text-5xl",
          )}
        >
          {label}
        </div>
      </Link>
    </m.div>
  );
}
