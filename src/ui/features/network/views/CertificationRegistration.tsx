"use client";

import type { ImageAsset } from "@davincicoding/cms/image";
import Image from "next/image";
import { Button, FocusTrap, Modal, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";

import { RichText } from "@/ui/components/RichText-dep";
import { cn } from "@/ui/utils";

export interface ICertificationRegistrationProps {
  title: string;
  headline: string;
  image: ImageAsset;
  description: string;
  application: {
    label: string;
    url: string;
  };
  className?: string;
}

export function CertificationRegistration({
  title,
  headline,
  description,
  image,
  className,
  application,
}: ICertificationRegistrationProps) {
  const t = useTranslations("network.influencers.certification");
  const [isExpanded, expansion] = useDisclosure(false);

  return (
    <>
      <Paper
        shadow="xs"
        withBorder
        radius="lg"
        className={cn(
          "relative cursor-pointer overflow-clip transition-transform hover:scale-[1.01]",
          className,
        )}
        onClick={expansion.open}
      >
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          placeholder={image.blurDataURL ? "blur" : undefined}
          blurDataURL={image.blurDataURL}
          className="aspect-video w-full"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white before:absolute before:inset-x-0 before:-top-24 before:h-24 before:bg-gradient-to-t before:from-black/50 before:to-transparent">
          <h3 className="mb-1.5 text-balance text-xl font-medium uppercase leading-tight sm:text-2xl">
            {title}
          </h3>
          <p>{headline}</p>
        </div>
      </Paper>
      <Modal
        title={t("title")}
        opened={isExpanded}
        onClose={expansion.close}
        radius="lg"
        classNames={{
          header: "bg-transparent backdrop-blur",
          title: "text-2xl font-medium",
        }}
      >
        <FocusTrap.InitialFocus />
        <RichText
          className="prose prose-p:m-3 prose-li:m-0"
          content={description}
        />
        <Button
          component="a"
          mt="lg"
          fullWidth
          size="md"
          className="uppercase"
          href={application.url}
          target="_blank"
        >
          {application.label}
        </Button>
      </Modal>
    </>
  );
}
