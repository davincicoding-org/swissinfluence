import Image from "next/image";

import { Flex, Tooltip } from "@mantine/core";
import Marquee from "react-fast-marquee";

import { FadeContainer } from "@/ui/components/FadeContainer";

import { type IAwardPartner } from "../data";

export interface IAwardPartnersProps {
  partners: Array<IAwardPartner>;
}

export function AwardPartners({ partners }: IAwardPartnersProps) {
  return (
    <FadeContainer gradientWidth={100}>
      <Marquee pauseOnHover autoFill>
        <Flex className="gap-8 py-3 pr-8">
          {partners.map(({ id, name, image, url }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener"
              className="aspect-video h-16"
            >
              <Tooltip label={name} position="bottom">
                <Image
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  placeholder={image.blurDataURL ? "blur" : undefined}
                  blurDataURL={image.blurDataURL}
                  alt={name}
                  className="h-full w-full object-contain object-center"
                />
              </Tooltip>
            </a>
          ))}
        </Flex>
      </Marquee>
    </FadeContainer>
  );
}
