import { type ReactNode } from "react";
import Image from "next/image";
import { Flex, Paper, Stack } from "@mantine/core";

import type { Photo } from "@/payload-types";
import { cn } from "@/ui/utils";

export interface IPageHeroProps {
  image: Pick<Photo, "url" | "width" | "height">;
  title: ReactNode;
  headline?: ReactNode;
  footer?: ReactNode;
  CTA?: ReactNode;
  className?: string;
}

export function PageHero({
  image,
  title,
  headline,
  footer,
  CTA,
  className,
}: IPageHeroProps) {
  return (
    <Paper
      component="header"
      shadow="sm"
      radius={0}
      className={cn("relative z-10 flex h-svh flex-col", className)}
    >
      <Image
        src={image.url ?? ""}
        // placeholder={image.blurDataURL ? "blur" : undefined}
        // blurDataURL={image.blurDataURL}
        // width={image.width ?? 0}
        // height={image.height ?? 0}
        alt="Page hero"
        sizes="100vw"
        fill
        priority
        className="!fixed inset-0 z-0 object-cover object-center will-change-transform"
      />
      <div
        className={cn(
          "relative mt-auto bg-black/60",
          "before:absolute before:inset-x-0 before:-top-32 before:h-32 before:bg-gradient-to-t before:from-black/60 before:to-transparent before:content-['']",
        )}
      >
        <Flex
          gap="lg"
          wrap="wrap"
          className="p-4 max-sm:flex-col sm:items-end sm:p-8"
        >
          <Stack gap="xs" className="min-w-0 flex-1 max-sm:text-center">
            <h1 className="hyphens-auto text-balance text-5xl font-light uppercase tracking-wider text-mocha-300 sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="text-balance text-xl font-light uppercase tracking-widest text-white empty:hidden sm:text-2xl md:text-3xl">
              {headline}
            </p>
          </Stack>
          {CTA}
        </Flex>
        {footer}
      </div>
    </Paper>
  );
}
