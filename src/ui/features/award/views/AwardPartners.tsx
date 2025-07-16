import Image from "next/image";
import { Flex, Tooltip } from "@mantine/core";
import Marquee from "react-fast-marquee";

import type { Brand } from "@/payload-types";
import { FadeContainer } from "@/ui/components/FadeContainer";
import { ensureResolved } from "@/utils/payload";

export interface IAwardPartnersProps {
  partners: Array<Brand>;
}

export function AwardPartners({ partners }: IAwardPartnersProps) {
  return (
    <FadeContainer gradientWidth={100}>
      <Marquee pauseOnHover autoFill>
        <Flex className="gap-8 py-3 pr-8">
          {partners.map((partner) => {
            const logo = ensureResolved(partner.logo);
            if (!logo) return null;
            return (
              <a
                key={partner.id}
                href={partner.website}
                target="_blank"
                rel="noopener"
                className="aspect-video h-16"
              >
                <Tooltip label={partner.name} position="bottom">
                  <Image
                    src={logo.url ?? ""}
                    width={logo.width ?? 0}
                    height={logo.height ?? 0}
                    // placeholder={logo.blurDataURL ? "blur" : undefined}
                    // blurDataURL={logo.blurDataURL ?? ""}
                    alt={partner.name}
                    className="h-full w-full object-contain object-center"
                  />
                </Tooltip>
              </a>
            );
          })}
        </Flex>
      </Marquee>
    </FadeContainer>
  );
}
