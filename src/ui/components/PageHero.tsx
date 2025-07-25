import { type ReactNode } from "react";

import type { Photo } from "@/payload-types";
import { cn } from "@/ui/utils";

import { Image } from "./Image";

export interface PageHeroProps {
  image: Photo;
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
}: PageHeroProps) {
  return (
    <header
      className={cn("relative z-10 flex h-svh flex-col shadow-md", className)}
    >
      <Image
        resource={image}
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
        <div className="flex flex-wrap gap-8 p-4 max-sm:flex-col sm:items-end sm:p-8">
          <div className="flex min-w-0 flex-1 flex-col gap-3 max-sm:text-center">
            <p className="hyphens-auto text-balance text-5xl font-light uppercase tracking-wider text-mocha-300 sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </p>
            <p className="text-balance text-xl font-light uppercase tracking-widest text-white empty:hidden sm:text-2xl md:text-3xl">
              {headline}
            </p>
          </div>
          {CTA}
        </div>
        {footer}
      </div>
    </header>
  );
}
