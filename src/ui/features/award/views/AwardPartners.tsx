import Image from "next/image";
import { Flex, Tooltip } from "@mantine/core";
import Marquee from "react-fast-marquee";

import type { Brand } from "@/types";
import { FadeContainer } from "@/ui/components/FadeContainer";

export interface IAwardPartnersProps {
  partners: Array<Brand>;
}

export function AwardPartners({ partners }: IAwardPartnersProps) {
  return (
    <FadeContainer gradientWidth={100}>
      <Marquee pauseOnHover autoFill>
        <Flex className="gap-8 py-3 pr-8">
          {partners.map(({ id, name, image, website }) => (
            <a
              key={id}
              href={website}
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
