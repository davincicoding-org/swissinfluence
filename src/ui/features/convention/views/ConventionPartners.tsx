import { Flex, Tooltip } from "@mantine/core";
import Marquee from "react-fast-marquee";

import type { Brand } from "@/payload-types";
import { FadeContainer } from "@/ui/components/FadeContainer";
import { Image } from "@/ui/components/Image";
import { ensureResolved } from "@/utils/payload";

export interface IConventionPartnersProps {
  partners: Array<Brand>;
}

export function ConventionPartners({ partners }: IConventionPartnersProps) {
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
              >
                <Tooltip label={partner.name} position="bottom">
                  <Image
                    resource={logo}
                    alt={partner.name}
                    className="aspect-video h-16"
                    imgClassName="object-contain object-center"
                    sizes="128px"
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
