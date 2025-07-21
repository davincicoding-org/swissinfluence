"use client";

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

import type { NetworkEvent } from "@/types";
import { Image } from "@/ui/components/Image";
import { RichText } from "@/ui/components/RichText";
import { cn } from "@/ui/utils";
import { ensureResolved } from "@/utils/payload";

export interface IEventTileProps {
  data: NetworkEvent;
  className?: string;
}

export function EventTile({ data, className }: IEventTileProps) {
  const [isExpanded, expansion] = useDisclosure(false);

  const formattedDate = dayjs(data.date).format("DD.MM.YYYY");

  const image = ensureResolved(data.image)!;
  const logo = ensureResolved(data.logo)!;

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
        {image && (
          <Image
            resource={image}
            alt="Background"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <Flex
          className="absolute inset-0 bg-black/40"
          direction="column"
          justify="space-between"
        >
          {logo && (
            <Image
              resource={logo}
              alt="Event Organizer Logo"
              sizes="96px"
              className="m-4 ml-auto h-12 w-auto"
            />
          )}
          <Flex
            className={cn("relative mt-auto p-4 text-white")}
            gap="sm"
            wrap="nowrap"
            justify="space-between"
            align="end"
          >
            <div>
              <span>{formattedDate}</span>
              <p className="text-2xl">{data.title}</p>
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
          {image && (
            <Image
              resource={image}
              alt="Event Background"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="absolute inset-0 object-cover"
            />
          )}
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
              {logo && (
                <Image
                  resource={logo}
                  alt="Event Organizer Logo"
                  sizes="128px"
                  className="m-4 mx-auto h-16 w-auto"
                />
              )}

              <p className="mt-8 text-3xl">{data.title}</p>

              <RichText data={data.content} className="py-6 text-white" />
              <Button
                component="a"
                radius="md"
                size="lg"
                fullWidth
                className="uppercase"
                disabled={!data.registrationUrl}
                href={data.registrationUrl ?? undefined}
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
