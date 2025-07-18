"use client";

import { Button, FocusTrap, Modal, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import type { RichTextProps } from "@/ui/components/RichText";
import { Image } from "@/ui/components/Image";
import { RichText } from "@/ui/components/RichText";
import { cn } from "@/ui/utils";
import { ensureResolved } from "@/utils/payload";

export interface ICertificationRegistrationProps {
  title: string;
  headline: string;
  image: Photo;
  content: RichTextProps["data"];
  application: {
    label: string;
    url: string;
  };
  className?: string;
}

export function CertificationRegistration({
  title,
  headline,
  content,
  image,
  className,
  application,
}: ICertificationRegistrationProps) {
  const t = useTranslations("network.influencers.certification");
  const [isExpanded, expansion] = useDisclosure(false);

  const photo = ensureResolved(image);

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
        {photo && (
          <Image
            resource={photo}
            alt=""
            className="aspect-video w-full"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
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
        closeButtonProps={{
          size: "lg",
        }}
        radius="lg"
        classNames={{
          header: "bg-transparent backdrop-blur",
          title: "text-2xl font-medium",
        }}
      >
        <FocusTrap.InitialFocus />
        <RichText
        // className="prose prose-p:m-3 prose-li:m-0"
         data={content} />
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
