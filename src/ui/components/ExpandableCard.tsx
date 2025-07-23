"use client";

import type { ReactNode } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  FocusTrap,
  Group,
  Modal,
  Paper,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";

import type { Photo } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { cn } from "@/ui/utils";

import { TextOverflowReveal } from "./TextOverflowReveal";

interface ExpandableCardProps {
  title: string;
  description: string;
  image: Photo;
  logo?: {
    photo: Photo;
    url: string;
  };
  content: ReactNode;
  badge?: ReactNode;
  cta?: {
    label: string;
    url: string;
  };
  className?: string;
}

export function ExpandableCard({
  title,
  description,
  badge,
  image,
  logo,
  content,
  cta,
  className,
}: ExpandableCardProps) {
  const [isExpanded, { open, close }] = useDisclosure(false);

  return (
    <>
      <Paper
        withBorder
        className={cn(
          "flex cursor-pointer flex-col rounded-xl p-4 transition-all hover:bg-neutral-100",
          className,
        )}
        radius="lg"
        shadow="sm"
        onClick={open}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="relative overflow-clip rounded-lg">
            <Image
              resource={image}
              alt={title}
              className="aspect-square"
              sizes="880px"
            />
          </div>
          <div className="-ml-2 grid items-center justify-center">
            <Text
              component="div"
              className="mb-1 w-full min-w-0 text-nowrap text-center text-base font-medium"
            >
              <TextOverflowReveal className="text-nowrap pl-2" text={title} />
            </Text>
            <Text className="min-w-0 truncate px-2 text-center text-base text-neutral-600">
              {description}
            </Text>
          </div>
        </div>
      </Paper>

      <Modal
        opened={isExpanded}
        onClose={close}
        transitionProps={{ transition: "pop" }}
        centered
        size="md"
        radius="lg"
        withCloseButton={false}
        classNames={{
          body: "p-0",
        }}
      >
        <FocusTrap.InitialFocus />
        <div className="sticky top-0 z-20 -mb-14 flex h-14 items-center justify-end pr-3">
          <ActionIcon
            variant="default"
            radius="xl"
            size="lg"
            classNames={{
              root: "bg-white/50 backdrop-blur-sm",
            }}
            onClick={close}
          >
            <IconX />
          </ActionIcon>
        </div>
        <div className="relative">
          <Image
            resource={image}
            alt={title}
            className="h-80 w-full object-cover object-center"
            sizes="880px"
            priority
          />
          <Group
            justify="space-between"
            align="flex-end"
            wrap="nowrap"
            gap="lg"
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 from-50% to-transparent p-4 pt-8"
          >
            <Text className="text-pretty text-lg font-medium leading-tight text-white">
              {title}
            </Text>
            {logo && (
              <a href={logo.url} target="_blank" rel="noopener">
                <Image
                  resource={logo.photo}
                  alt="Logo"
                  className="h-auto w-20"
                  sizes="160px"
                />
              </a>
            )}
          </Group>
          {badge && (
            <Badge size="lg" className="absolute left-4 top-4">
              {badge}
            </Badge>
          )}
        </div>

        <div className="p-4">{content}</div>

        {cta ? (
          <div className="sticky bottom-0 bg-white/80 p-4 before:absolute before:inset-x-0 before:-top-8 before:h-8 before:bg-gradient-to-t before:from-white/80 before:to-transparent">
            <Button
              component="a"
              href={cta.url}
              target="_blank"
              radius="md"
              size="md"
              fullWidth
            >
              {cta.label}
            </Button>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
