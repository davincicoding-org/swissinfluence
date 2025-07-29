"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import Marquee from "react-fast-marquee";

import type { Brand } from "@/payload-types";
import { FadeContainer } from "@/ui/components/FadeContainer";
import { Image } from "@/ui/components/Image";
import { ensureResolved } from "@/utils/payload";

export interface BrandsMarqueeProps {
  brands: Array<Brand>;
}

export function BrandsMarquee({ brands }: BrandsMarqueeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <div ref={ref} className="bg-neutral-500">
      <FadeContainer gradientWidth={100}>
        <Marquee
          pauseOnHover
          autoFill
          play={isInView}
          speed={isInView ? 50 : 0}
        >
          <div className="flex gap-8 py-3 pr-8">
            {brands.map((partner) => {
              const logo = ensureResolved(partner.logo);
              if (!logo) return null;

              return (
                <a
                  key={partner.id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener"
                >
                  <Image
                    resource={logo}
                    alt={partner.name}
                    className="aspect-video h-16"
                    imgClassName="object-contain object-center"
                    sizes="128px"
                    loading="lazy"
                  />
                </a>
              );
            })}
          </div>
        </Marquee>
      </FadeContainer>
    </div>
  );
}
