"use client";

import type { BoxProps } from "@mantine/core";
import { useMemo } from "react";
import {
  ActionIcon,
  Box,
  Button,
  CloseButton,
  Divider,
  Indicator,
  Modal,
  NavLink,
  Paper,
  Popover,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconList, IconX } from "@tabler/icons-react";
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
  votes: VotingValues["votes"];
  onToggleVote: (vote: InfluencerVote) => void;
  opened: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function VotingSelectionModal({
  categories,
  votes,
  onToggleVote,
  opened,
  onClose,
  onSubmit,
}: VotingSelectionModalProps) {
  const t = useTranslations("voting.selection");
  const selectedInfluencers = useMemo<
    {
      category: Pick<Category, "id" | "name">;
      influencers: Array<Pick<Influencer, "id" | "name">>;
    }[]
  >(
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
      <div className="flex flex-col gap-2">
        {categories.map(({ category, nominees }) => {
          if (nominees.length === 0) return null;
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
            <div key={category.id}>
              <h3 className="sticky top-0 z-10 bg-white/50 px-4 py-2 text-2xl backdrop-blur-sm md:py-3 md:text-3xl">
                {category.name}
              </h3>
              <ListView
                hiddenFrom="sm"
                className="px-4"
                nominees={nominees}
                isSelected={isSelected}
                onToggle={handleToggle}
              />
              <GridView
                visibleFrom="sm"
                className="px-4"
                nominees={nominees}
                isSelected={isSelected}
                onToggle={handleToggle}
              />
            </div>
          );
        })}
      </div>
      <div className="sticky bottom-0 z-10 flex h-16 items-center justify-between gap-2 bg-white/50 px-4 py-3 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          {votes.length > 0 ? (
            <>
              <Popover position="top-start" offset={0} radius="md">
                <Popover.Target>
                  <Indicator
                    label={votes.length}
                    size={16}
                    offset={4}
                    classNames={{ indicator: "font-medium" }}
                  >
                    <ActionIcon
                      key="list"
                      size="xl"
                      variant="subtle"
                      radius="md"
                      className={cn("text-current transition-opacity", {
                        "pointer-events-none opacity-0": votes.length === 0,
                      })}
                      component={m.button}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <IconList size={32} stroke={1.5} />
                    </ActionIcon>
                  </Indicator>
                </Popover.Target>
                <Popover.Dropdown
                  p={0}
                  className="!bg-white/30 backdrop-blur-sm"
                >
                  <ScrollArea
                    scrollbars="y"
                    classNames={{
                      viewport: "max-h-96",
                    }}
                  >
                    <Stack gap={8} p="xs">
                      {selectedInfluencers.map(({ category, influencers }) => (
                        <Paper
                          key={category.id}
                          withBorder
                          radius="md"
                          className="overflow-clip !bg-white/50"
                        >
                          <Text
                            c="white"
                            size="sm"
                            bg="mocha.3"
                            className="px-2 py-1.5 font-medium"
                          >
                            {category.name}
                          </Text>
                          <Divider />
                          <AnimatePresence>
                            {influencers.map((influencer) => (
                              <NavLink
                                key={influencer.id}
                                label={influencer.name}
                                component={m.button}
                                exit={{ opacity: 0, x: 10 }}
                                rightSection={<IconX size={16} />}
                                py={4}
                                px="xs"
                                onClick={() =>
                                  onToggleVote({
                                    influencer: influencer.id,
                                    category: category.id,
                                  })
                                }
                              />
                            ))}
                          </AnimatePresence>
                        </Paper>
                      ))}
                    </Stack>
                  </ScrollArea>
                </Popover.Dropdown>
              </Popover>

              <Button
                key="submit"
                radius="md"
                size="md"
                component={m.button}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onSubmit}
              >
                {t("submit")}
              </Button>
            </>
          ) : (
            <m.span
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-balance text-lg font-medium leading-tight"
            >
              {t("empty")}
            </m.span>
          )}
        </AnimatePresence>
        <CloseButton size="xl" radius="md" onClick={onClose} />
      </div>
    </Modal>
  );
}

interface NomineesProps extends BoxProps {
  nominees: Influencer[];
  isSelected: (influencerId: Influencer["id"]) => boolean;
  onToggle: (influencerId: Influencer["id"]) => void;
}

function GridView({
  nominees,
  onToggle,
  isSelected,
  className,
  ...props
}: NomineesProps) {
  return (
    <Box
      {...props}
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4",
        className,
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
  );
}

function ListView({
  nominees,
  onToggle,
  isSelected,
  className,
  ...props
}: NomineesProps) {
  return (
    <Box {...props} className={cn("flex flex-col gap-3", className)}>
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
            <h3 className="grow text-lg font-medium leading-tight">
              {nominee.name}
            </h3>
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
    </Box>
  );
  return (
    <Box
      {...props}
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4",
        className,
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
          onClick={() => onToggle(nominee.id)}
          name={nominee.name}
          image={nominee.image as ProfilePicture}
          revealed
        />
      ))}
    </Box>
  );
}
