"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  ActionIcon,
  Button,
  Flex,
  FocusTrap,
  Modal,
  Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useLocale } from "next-intl";

import type { NetworkEvent } from "@/types";
import { RichText } from "@/ui/components/RichText-dep";
import { cn } from "@/ui/utils";

export interface IEventTileProps {
  data: NetworkEvent;
  className?: string;
}

export function EventTile({
  data: {
    title,
    image,
    description,
    start: startDate,
    end: endDate,
    logo,
    tickets,
  },
  className,
}: IEventTileProps) {
  const locale = useLocale();
  const [isExpanded, expansion] = useDisclosure(false);

  const formattedDate = useMemo(() => {
    const fromDate = dayjs(startDate);
    const untilDate = dayjs(endDate);

    if (fromDate.isSame(untilDate, "day")) return fromDate.format("DD.MM.YYYY");

    return `${fromDate.format("DD.MM.YYYY")} - ${untilDate.format("DD.MM.YYYY")}`;
  }, [startDate, endDate]);

  return (
    <>
      <Paper
        radius="lg"
        shadow="sm"
        className={cn(
          "group relative flex aspect-square cursor-pointer flex-col overflow-clip",
          className,
        )}
        onClick={({ currentTarget }) => {
          expansion.open();
          currentTarget.scrollIntoView({
            block: "nearest",
            inline: "nearest",
            behavior: "smooth",
          });
        }}
      >
        <Image
          src={image.src}
          alt="Background"
          fill
          placeholder={image.blurDataURL ? "blur" : undefined}
          blurDataURL={image.blurDataURL}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <Flex
          className="absolute inset-0 bg-black/40"
          direction="column"
          justify="space-between"
        >
          <Image
            alt="Event Organizer Logo"
            className="m-4 ml-auto h-12 w-auto"
            src={logo.src}
            width={logo.width}
            height={logo.height}
            placeholder={logo.blurDataURL ? "blur" : undefined}
            blurDataURL={logo.blurDataURL}
          />

          <Flex
            className={cn("relative mt-auto p-4 text-white")}
            gap="sm"
            wrap="nowrap"
            justify="space-between"
            align="end"
          >
            <div>
              <span>{formattedDate}</span>
              <p className="text-2xl">{title[locale]}</p>
            </div>
            <IconArrowRight className={cn("shrink-0")} size={32} stroke={1.5} />
          </Flex>
        </Flex>
      </Paper>
      <Modal.Root
        transitionProps={{ transition: "slide-up" }}
        classNames={{
          body: "p-0",
          header: "bg-transparent h-14 py-0 justify-end",
        }}
        xOffset={0}
        yOffset={0}
        centered
        opened={isExpanded}
        size="lg"
        onClose={expansion.close}
      >
        <Modal.Overlay />
        <Modal.Content
          radius="lg"
          className="bg-cover bg-fixed bg-center"
          classNames={{ inner: "!bg-none" }}
        >
          <Image
            alt="Event Background"
            src={image.src}
            fill
            placeholder={image.blurDataURL ? "blur" : undefined}
            blurDataURL={image.blurDataURL}
            className="absolute inset-0 object-cover"
          />
          <Modal.Header>
            <ActionIcon
              color="white"
              variant="outline"
              size="lg"
              radius="xl"
              onClick={expansion.close}
            >
              <IconX />
            </ActionIcon>
          </Modal.Header>
          <Modal.Body className="relative -mt-16 grid">
            <FocusTrap.InitialFocus />
            <div className="flex flex-col bg-black/60 p-6 text-white">
              <Image
                alt="Event Organizer Logo"
                className="m-4 mx-auto h-16 w-auto"
                src={logo.src}
                width={logo.width}
                height={logo.height}
                placeholder={logo.blurDataURL ? "blur" : undefined}
                blurDataURL={logo.blurDataURL}
              />

              <p className="mt-8 text-3xl">{title[locale]}</p>

              <RichText
                content={description[locale]}
                className="prose-lg py-6 text-white"
              />
              <Button
                component="a"
                radius="md"
                size="lg"
                fullWidth
                className="uppercase"
                disabled={!tickets}
                href={tickets ?? undefined}
                target="_blank"
              >
                Apply Now
              </Button>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
