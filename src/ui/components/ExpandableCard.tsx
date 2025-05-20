"use client";

import type { ImageMedia } from "@davincicoding/cms/image";
import type { ReactNode } from "react";
import { useId } from "react";
import Image from "next/image";
import {
  ActionIcon,
  Button,
  FocusTrap,
  Group,
  Modal,
  Paper,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { motion } from "motion/react";

import { cn } from "@/ui/utils";

interface ExpandableCardProps {
  title: string;
  description: string;
  image: ImageMedia;
  logo?: ReactNode;
  content: ReactNode;
  cta?: {
    label: string;
    url: string;
  };
  className?: string;
}

const ModalContent = motion(Modal.Content);

export function ExpandableCard({
  title,
  description,
  image,
  logo,
  content,
  cta,
  className,
}: ExpandableCardProps) {
  const [isExpanded, { open, close }] = useDisclosure(false);
  const id = useId();

  return (
    <>
      <Paper
        component={motion.div}
        layoutId={`card-${title}-${id}`}
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
          <motion.div layoutId={`image-${title}-${id}`}>
            <Image
              width={image.width}
              height={image.height}
              src={image.src}
              alt={title}
              className="h-60 w-full rounded-lg object-cover object-center"
              placeholder={image.blurDataURL ? "blur" : undefined}
              blurDataURL={image.blurDataURL}
            />
          </motion.div>
          <div className="flex flex-col items-center justify-center">
            <Text
              component={motion.h3}
              layoutId={`title-${title}-${id}`}
              className="mb-1 line-clamp-2 text-center text-base font-medium leading-tight"
            >
              {title}
            </Text>
            <Text className="text-center text-base text-neutral-600 md:text-left">
              {description}
            </Text>
          </div>
        </div>
      </Paper>

      <Modal.Root
        opened={isExpanded}
        onClose={close}
        transitionProps={{ duration: 0 }}
        centered
        size="md"
        //   overlayProps={{
        //     blur: 3,
        //     opacity: 0.55,
        //     color: "black",
        //   }}
      >
        <Modal.Overlay />
        <ModalContent layoutId={`card-${title}-${id}`} radius="lg">
          <Modal.Header mb={-60} bg="none" py="xs">
            <ActionIcon
              ml="auto"
              color="mocha"
              radius="xl"
              size="lg"
              onClick={close}
            >
              <IconX />
            </ActionIcon>
          </Modal.Header>
          <Modal.Body p={0}>
            <FocusTrap.InitialFocus />
            <motion.div layoutId={`image-${title}-${id}`} className="relative">
              <Image
                priority
                width={image.width}
                height={image.height}
                src={image.src}
                alt={title}
                className="h-80 w-full object-cover object-center lg:h-80"
                placeholder={image.blurDataURL ? "blur" : undefined}
                blurDataURL={image.blurDataURL}
              />
              <Group
                justify="space-between"
                align="flex-end"
                wrap="nowrap"
                gap="lg"
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 from-50% to-transparent p-4 pt-8"
              >
                <Text
                  component={motion.h3}
                  layoutId={`title-${title}-${id}`}
                  className="text-pretty text-lg font-medium leading-tight text-white"
                >
                  {title}
                </Text>
                {logo}
              </Group>
            </motion.div>

            <div className="p-4">{content}</div>

            {cta ? (
              <div className="sticky bottom-0 bg-white/80 p-4 before:absolute before:inset-x-0 before:-top-8 before:h-8 before:bg-gradient-to-t before:from-white/80 before:to-transparent">
                <Button
                  component="a"
                  href={cta.url}
                  target="_blank"
                  color="mocha"
                  radius="md"
                  size="md"
                  fullWidth
                >
                  {cta.label}
                </Button>
              </div>
            ) : null}
          </Modal.Body>
        </ModalContent>
      </Modal.Root>
    </>
  );
}
