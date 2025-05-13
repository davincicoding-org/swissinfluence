"use client";

import Image from "next/image";
import { useMemo } from "react";

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

import { cn } from "@/ui/utils";

import { type IEventDocument } from "@/cms/resources/event/schema";
import { RichText } from "@/ui/components/RichText";
import { type SupportedLocale } from "@/i18n/config";

export interface IEventTileProps {
  data: IEventDocument;
  className?: string;
}

export function EventTile({
  data: { title, image, description, date, logo, ticketSale },
  className,
}: IEventTileProps) {
  const locale = useLocale() as SupportedLocale;
  const [isExpanded, expansion] = useDisclosure(false);

  const formattedDate = useMemo(() => {
    const fromDate = dayjs(date.from);
    const untilDate = dayjs(date.until);

    if (fromDate.isSame(untilDate, "day")) return fromDate.format("DD.MM.YYYY");

    return `${fromDate.format("DD.MM.YYYY")} - ${untilDate.format("DD.MM.YYYY")}`;
  }, [date]);

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
          height={image.height}
          width={image.width}
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
        opened={isExpanded}
        size="lg"
        onClose={expansion.close}
      >
        <Modal.Overlay />
        <Modal.Content
          radius={0}
          className="bg-cover bg-fixed bg-center"
          classNames={{ inner: "!bg-none" }}
          style={{ backgroundImage: `url(${image.src})` }}
        >
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
          <Modal.Body className="-mt-16 grid">
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
                color="mocha"
                component="a"
                radius="md"
                size="lg"
                fullWidth
                className="uppercase"
                disabled={!ticketSale.open}
                href={ticketSale.url}
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
