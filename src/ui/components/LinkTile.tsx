"use client";
import Image from "next/image";
import Link from "next/link";

import { motion, type MotionProps } from "motion/react";
import { type Route } from "next";

import { type ImageMedia } from "@/cms/lib/fields";
import { cn } from "@/ui/utils";

export interface ILinkTileProps<R extends string> {
  label: string;
  image: ImageMedia;
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
        className="@container relative grid h-full w-full overflow-clip rounded-xl bg-green-300 duration-300 active:!scale-95"
      >
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          placeholder={image.blurDataURL ? "blur" : undefined}
          blurDataURL={image.blurDataURL}
          className={cn(
            "h-full w-full object-cover object-center duration-1000 group-hover:scale-110",
          )}
          alt=""
        />
        <div
          className={cn(
            "group-hover:bg-mocha-500 absolute inset-0 flex items-center justify-center bg-neutral-700/50 px-4 text-center !leading-tight font-semibold tracking-wider text-balance hyphens-auto text-white uppercase duration-500",
            "text-3xl @sm:text-4xl @lg:text-5xl",
          )}
        >
          {label}
        </div>
      </Link>
    </motion.div>
  );
}
