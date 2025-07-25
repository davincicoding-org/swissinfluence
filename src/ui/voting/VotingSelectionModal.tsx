"use client";

import type { BoxProps } from "@mantine/core";
import type { Ref } from "react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Indicator,
  Menu,
  Modal,
  Paper,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { IconList, IconRestore, IconX } from "@tabler/icons-react";
import { isEqual } from "lodash-es";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";

import type { Category, Influencer, ProfilePicture } from "@/payload-types";
import type { AwardCategory, InfluencerVote, VotingValues } from "@/types";
import { Image } from "@/ui/components/Image";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { SocialMediaPlatformIcon } from "@/ui/components/SocialMediaPlatformIcon";
import { cn } from "@/ui/utils";
import { ensureResolved } from "@/utils/payload";

import type { VotingSubmissionFormProps } from "./VotingSubmissionForm";
import { scaleUp } from "../transitions";
import { VotingSubmissionForm } from "./VotingSubmissionForm";

export interface VotingSelectionModalProps {
  categories: AwardCategory[];
  focusCategory?: Category["id"];
  opened: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<VotingValues, "award">, callback: () => void) => void;
}

interface CategorySelection {
  category: Pick<Category, "id" | "name">;
  influencers: Array<Pick<Influencer, "id" | "name" | "image">>;
}

export function VotingSelectionModal({
  categories,
  focusCategory,
  opened,
  submitting,
  onClose,
  onSubmit,
}: VotingSelectionModalProps) {
  const t = useTranslations("voting.selection");

  const [votes, setVotes] = useState<VotingValues["votes"]>([]);
  const onToggleVote = (vote: InfluencerVote) =>
    setVotes((prev) =>
      prev.some((v) => isEqual(v, vote))
        ? prev.filter((v) => !isEqual(v, vote))
        : [...prev, vote],
    );

  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isListOpen, listView] = useDisclosure(false);
  const [listTriggerRef, setListTriggerRef] =
    useState<HTMLButtonElement | null>(null);
  const [listRef, setListRef] = useState<HTMLDivElement | null>(null);
  useClickOutside(() => listView.close(), null, [listRef, listTriggerRef]);

  const selection = useMemo<CategorySelection[]>(
    () =>
      categories
        .map(({ nominees, category }) => ({
          category,
          influencers: nominees.filter((nominee) =>
            votes.some((vote) =>
              isEqual(vote, { influencer: nominee.id, category: category.id }),
            ),
          ),
        }))
        .filter(({ influencers }) => influencers.length > 0),
    [categories, votes],
  );

  const handleReset = () => setVotes([]);
  const handleSubmit: VotingSubmissionFormProps["onSubmit"] = (
    values,
    callback,
  ) =>
    onSubmit({ ...values, votes }, () => {
      setVotes([]);
      callback();
      setIsSubmissionOpen(false);
      onClose();
    });

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        size="xl"
        radius="lg"
        withCloseButton={false}
        closeOnEscape={!isSubmissionOpen}
        classNames={{
          body: cn("p-0 transition-all duration-500", {
            "blur-md": isSubmissionOpen,
          }),
          overlay: "backdrop-blur-md",
        }}
      >
        <div className="sticky top-0 z-20 -mb-12 flex h-12 items-center justify-end pr-3 sm:-mb-16 sm:h-16">
          <ActionIcon
            variant="default"
            size={38}
            radius="xl"
            className="bg-transparent backdrop-blur-sm max-sm:border-none sm:bg-white/50"
            onClick={onClose}
          >
            <IconX size={32} stroke={1.5} />
          </ActionIcon>
        </div>

        {categories.map(({ category, nominees }) => {
          const isSelected = (influencerId: Influencer["id"]) =>
            votes.some((vote) =>
              isEqual(vote, {
                influencer: influencerId,
                category: category.id,
              }),
            );
          const handleToggle = (influencerId: Influencer["id"]) =>
            onToggleVote({
              influencer: influencerId,
              category: category.id,
            });

          return (
            <Fragment key={category.id}>
              <ListView
                category={category.name}
                focused={category.id === focusCategory}
                hiddenFrom="sm"
                nominees={nominees}
                isSelected={isSelected}
                onToggle={handleToggle}
              />
              <GridView
                category={category.name}
                focused={category.id === focusCategory}
                visibleFrom="sm"
                nominees={nominees}
                isSelected={isSelected}
                onToggle={handleToggle}
              />
            </Fragment>
          );
        })}

        <div className="pointer-events-none sticky bottom-0 z-10 flex justify-center p-3 *:pointer-events-auto">
          <AnimatePresence mode="wait">
            {votes.length > 0 ? (
              <Menu
                position="top"
                radius="md"
                width={338}
                opened={isListOpen}
                shadow="md"
                transitionProps={{ transition: scaleUp }}
              >
                <Menu.Target>
                  <m.div
                    className="flex items-center gap-5"
                    key="actions"
                    initial={{ y: "150%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "150%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Tooltip label={t("reset")}>
                      <ActionIcon
                        variant="default"
                        size="input-md"
                        radius="md"
                        classNames={{
                          root: "bg-white/50 backdrop-blur-sm",
                        }}
                        onClick={handleReset}
                      >
                        <IconRestore size={28} stroke={1.5} />
                      </ActionIcon>
                    </Tooltip>
                    <Button
                      key="submit"
                      radius="md"
                      size="lg"
                      className="uppercase"
                      onClick={() => setIsSubmissionOpen(true)}
                    >
                      {t("submit")}
                    </Button>

                    <Indicator
                      label={votes.length}
                      size={16}
                      classNames={{ indicator: "font-medium" }}
                    >
                      <ActionIcon
                        size="input-md"
                        variant="default"
                        radius="md"
                        classNames={{
                          root: "bg-white/50 backdrop-blur-sm",
                        }}
                        ref={setListTriggerRef}
                        onClick={listView.toggle}
                      >
                        <IconList size={28} stroke={1.5} />
                      </ActionIcon>
                    </Indicator>
                  </m.div>
                </Menu.Target>
                <Menu.Dropdown p={0} className="overflow-clip">
                  <SelectionList
                    ref={setListRef}
                    selection={selection}
                    onRemove={onToggleVote}
                  />
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Paper
                key="info"
                withBorder
                classNames={{
                  root: "bg-mocha-100/80 backdrop-blur-sm p-3",
                }}
                component={m.div}
                initial={{ y: "150%" }}
                animate={{ y: 0 }}
                exit={{ y: "150%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                radius="md"
              >
                <p className="select-none text-pretty text-lg font-medium leading-tight text-mocha-800">
                  {t("instructions")}
                </p>
              </Paper>
            )}
          </AnimatePresence>
        </div>
      </Modal>
      <Modal
        opened={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
        withCloseButton={false}
        fullScreen
        closeOnEscape={false}
        closeOnClickOutside={false}
        withOverlay={false}
        transitionProps={{ transition: "fade" }}
        classNames={{
          content: "bg-transparent",
          body: "h-full flex justify-center items-center",
        }}
      >
        <Paper
          withBorder
          shadow="md"
          radius="md"
          className="max-w-sm overflow-clip"
        >
          <VotingSubmissionForm
            isSubmitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => setIsSubmissionOpen(false)}
          />
        </Paper>
      </Modal>
    </>
  );
}

interface ViewProps extends BoxProps {
  category: string;
  focused: boolean;
  nominees: Influencer[];
  isSelected: (influencerId: Influencer["id"]) => boolean;
  onToggle: (influencerId: Influencer["id"]) => void;
}

// MARK: Grid View

function GridView({
  category,
  focused,
  nominees,
  onToggle,
  isSelected,
  ...props
}: ViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!focused) return;
    ref.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [focused]);
  return (
    <Box {...props} ref={ref}>
      <div className="sticky top-0 z-10 flex h-16 items-center px-4 md:py-3">
        <Badge
          size="xl"
          variant="default"
          classNames={{
            root: "h-auto bg-white/50 py-1 backdrop-blur-sm",
            label: "text-xl font-medium",
          }}
        >
          {category}
        </Badge>
      </div>
      <Box
        className={cn(
          "grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 px-4 pb-4",
        )}
      >
        {nominees.map((nominee) => (
          <PersonaCard
            key={nominee.id}
            role="button"
            tabIndex={0}
            className={cn(
              "cursor-pointer opacity-70 transition-all hover:opacity-100",
              {
                "border-8 border-mocha-500 opacity-100": isSelected(nominee.id),
              },
            )}
            socials={nominee.socials ?? []}
            name={nominee.name}
            image={nominee.image as ProfilePicture}
            imageSizes="500px"
            revealed
            onClick={() => onToggle(nominee.id)}
            onSocialClick={(e) => e.stopPropagation()}
          />
        ))}
      </Box>
    </Box>
  );
}

// MARK: List View

function ListView({
  category,
  focused,
  nominees,
  onToggle,
  isSelected,
  className,
  ...props
}: ViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!focused) return;
    ref.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [focused]);

  return (
    <Box ref={ref} className={cn(className)} {...props}>
      <div className="sticky top-0 z-10 flex h-12 items-center bg-white/50 pl-4 pr-12 backdrop-blur-sm">
        <span className="min-w-0 select-none truncate text-2xl font-medium leading-none">
          {category}
        </span>
      </div>
      <div className={cn("flex flex-col gap-3 px-4 pb-3")}>
        {nominees.map((nominee) => {
          const image = ensureResolved(nominee.image);
          if (!image) return null;
          return (
            <Paper
              key={nominee.id}
              withBorder
              bg="gray.0"
              radius="md"
              className={cn(
                "flex cursor-pointer items-center gap-x-3 overflow-clip border-2 pr-2 transition-colors duration-300",
                {
                  "border-mocha-500 !bg-mocha-50": isSelected(nominee.id),
                },
              )}
              role="button"
              onClick={() => onToggle(nominee.id)}
              tabIndex={0}
            >
              <Image
                resource={image}
                alt={nominee.name}
                className="h-20 w-20 shrink-0 object-cover"
                sizes="128px"
              />
              <p className="min-w-0 grow select-none truncate text-lg font-medium leading-tight">
                {nominee.name}
              </p>

              <div className="flex max-h-16 shrink-0 flex-col flex-wrap gap-1">
                {(nominee.socials ?? []).map((social) => (
                  <ActionIcon
                    key={social.platform}
                    component="a"
                    href={social.url}
                    target="_blank"
                    size="md"
                    variant="subtle"
                    color="default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SocialMediaPlatformIcon
                      platform={social.platform}
                      size={40}
                      stroke={1.5}
                    />
                  </ActionIcon>
                ))}
              </div>
            </Paper>
          );
        })}
      </div>
    </Box>
  );
}

// MARK: Selection List

const MotionMenuLabel = m.create(Menu.Label);

function SelectionList({
  selection,
  ref,
  onRemove,
}: {
  selection: CategorySelection[];
  ref: Ref<HTMLDivElement>;
  onRemove: (params: {
    category: Category["id"];
    influencer: Influencer["id"];
  }) => void;
}) {
  return (
    <ScrollArea
      viewportRef={ref}
      scrollbars="y"
      classNames={{
        viewport: "max-h-96 px-1",
        scrollbar: "z-20",
      }}
    >
      <AnimatePresence>
        {selection.map(({ category, influencers }) => (
          <m.div key={`category-${category.id}`} exit={{ opacity: 0, x: 10 }}>
            <MotionMenuLabel
              key={category.id}
              component={m.div}
              className="sticky top-0 z-10 bg-white/50 pt-2 text-base backdrop-blur-sm"
            >
              {category.name}
            </MotionMenuLabel>
            <Paper
              withBorder
              radius="md"
              className="mx-2 mb-2 mt-1 overflow-clip"
            >
              <AnimatePresence>
                {influencers.map((influencer) => (
                  <Fragment key={influencer.id}>
                    <Divider className="first:hidden" />
                    <Menu.Item
                      key={`${category.id}-${influencer.id}`}
                      leftSection={
                        <Image
                          resource={influencer.image as ProfilePicture}
                          alt={influencer.name}
                          className="h-10 w-10 shrink-0 rounded-md object-cover"
                          sizes="40px"
                        />
                      }
                      rightSection={
                        <IconX size={20} className="text-gray-500" />
                      }
                      component={m.button}
                      exit={{ opacity: 0, x: 10 }}
                      classNames={{
                        item: "p-2 pr-3 rounded-none",
                        itemLabel: "text-base font-medium truncate",
                      }}
                      onClick={() =>
                        onRemove({
                          category: category.id,
                          influencer: influencer.id,
                        })
                      }
                    >
                      {influencer.name}
                    </Menu.Item>
                  </Fragment>
                ))}
              </AnimatePresence>
            </Paper>
          </m.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  );
}
