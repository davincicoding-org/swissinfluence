"use client";

import type { BoxProps } from "@mantine/core";
import { Fragment, useEffect, useMemo, useRef } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Indicator,
  Menu,
  Modal,
  Paper,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
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

export interface VotingSelectionModalProps {
  categories: AwardCategory[];
  focusCategory?: Category["id"];
  votes: VotingValues["votes"];
  onToggleVote: (vote: InfluencerVote) => void;
  opened: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onReset: () => void;
}

interface CategorySelection {
  category: Pick<Category, "id" | "name">;
  influencers: Array<Pick<Influencer, "id" | "name">>;
}

export function VotingSelectionModal({
  categories,
  focusCategory,
  votes,
  onToggleVote,
  opened,
  onClose,
  onSubmit,
  onReset,
}: VotingSelectionModalProps) {
  const t = useTranslations("voting.selection");
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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      radius="lg"
      withCloseButton={false}
      classNames={{
        body: "p-0",
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
      <Center className="pointer-events-none sticky bottom-0 z-10 p-3 *:pointer-events-auto">
        <AnimatePresence mode="wait">
          {votes.length > 0 ? (
            <m.div
              className="flex items-center gap-2"
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Menu position="top" radius="md" withArrow>
                <Menu.Target>
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
                    >
                      <IconList size={28} stroke={1.5} />
                    </ActionIcon>
                  </Indicator>
                </Menu.Target>
                <Menu.Dropdown p={0}>
                  <SelectionList
                    selection={selection}
                    onRemove={onToggleVote}
                  />
                </Menu.Dropdown>
              </Menu>
              <Button
                key="submit"
                radius="md"
                size="md"
                className="uppercase"
                onClick={onSubmit}
              >
                {t("submit")}
              </Button>
              <Tooltip label={t("reset")}>
                <ActionIcon
                  size="input-md"
                  variant="default"
                  radius="md"
                  classNames={{
                    root: "bg-white/50 backdrop-blur-sm",
                  }}
                  onClick={onReset}
                >
                  <IconRestore size={28} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </m.div>
          ) : (
            <Paper
              key="info"
              withBorder
              component={m.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              radius="lg"
              classNames={{
                root: "bg-mocha-100/80 backdrop-blur-sm p-3",
              }}
            >
              <p className="max-w-md select-none text-pretty text-lg font-medium leading-tight text-mocha-800">
                {t("instructions")}
              </p>
            </Paper>
          )}
        </AnimatePresence>
      </Center>
    </Modal>
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
          "grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 px-4 pb-4",
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
  onRemove,
}: {
  selection: CategorySelection[];
  onRemove: (params: {
    category: Category["id"];
    influencer: Influencer["id"];
  }) => void;
}) {
  return (
    <ScrollArea
      scrollbars="y"
      classNames={{
        viewport: "max-h-64",
      }}
    >
      <AnimatePresence>
        {selection.flatMap(({ category, influencers }) => [
          <MotionMenuLabel
            key={category.id}
            component={m.div}
            exit={{ opacity: 0, x: 10 }}
          >
            {category.name}
          </MotionMenuLabel>,
          ...influencers.map((influencer) => (
            <Menu.Item
              key={influencer.id}
              leftSection={<IconX size={16} />}
              component={m.button}
              exit={{ opacity: 0, x: 10 }}
              onClick={() =>
                onRemove({
                  category: category.id,
                  influencer: influencer.id,
                })
              }
            >
              {influencer.name}
            </Menu.Item>
          )),
        ])}
      </AnimatePresence>
    </ScrollArea>
  );
}
